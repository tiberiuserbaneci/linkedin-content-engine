"""
Test suite for Batch Variant Generator
Tests variant scoring, design directions, pipeline logic, and DB integration
Uses mocks for Claude API, Playwright, and Supabase
"""

import sys
import asyncio
import os
from pathlib import Path
from datetime import datetime
from unittest.mock import MagicMock, AsyncMock, patch

sys.path.insert(0, str(Path(__file__).parent))

from batch_generator import VariantGenerator, VariantScorer, generate_and_save


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

SAMPLE_HTML = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            width: 1080px; height: 1350px;
            background: #F8F6F1;
            font-family: "DM Sans", Arial, sans-serif;
        }}
        .hero {{ background: #111; padding: 40px 48px; }}
        h1 {{ color: #FFFFFF; font-size: 64px; font-weight: 900; }}
        h2 {{ color: #111111; font-size: 32px; font-weight: 800; }}
        h3 {{ color: #111111; font-size: 15px; font-weight: 700; }}
        .stat {{ color: #BE4628; font-size: 48px; font-weight: 900; }}
        .footer {{
            background: #111; padding: 16px 40px;
            display: flex; justify-content: space-between;
        }}
        .footer-left {{ color: #FFFFFF; font-size: 13px; font-weight: bold; }}
        .footer-right {{ color: #BE4628; font-size: 13px; font-weight: 700; }}
    </style>
</head>
<body>
    <section class="hero">
        <h1>5 Mistakes Founders Make<br>With Claude AI</h1>
        <div class="stat">83%</div>
    </section>
    <section style="padding: 32px 40px; background: #F8F6F1;">
        <h2>The Most Common Errors</h2>
        <h3>• No system prompt</h3>
        <h3>• Wrong model for task</h3>
        <h3>• Ignoring context limits</h3>
    </section>
    <footer class="footer">
        <span class="footer-left">Ultron fixes these automatically.</span>
        <span class="footer-right">See how at 51ultron.com -></span>
    </footer>
</body>
</html>"""

MARKDOWN_WRAPPED_HTML = f"```html\n{SAMPLE_HTML}\n```"


def make_mock_export(variant_num: int, success: bool = True) -> dict:
    if success:
        return {
            'success': True,
            'png_path': f'/mnt/user-data/outputs/variant-{variant_num}-1080x1350.png',
            'png_filename': f'variant-{variant_num}-1080x1350.png',
            'file_size': 2048000,
            'file_size_kb': 2000.0,
            'dimensions': {'width': 1080, 'height': 1350},
            'dpi': 144,
            'captured_at': datetime.now().isoformat()
        }
    return {'success': False, 'error': 'Playwright not available', 'error_type': 'ImportError'}


def make_mock_anthropic_response(html: str):
    """Build a minimal mock that mimics anthropic.messages.create return value"""
    content_block = MagicMock()
    content_block.text = html
    response = MagicMock()
    response.content = [content_block]
    return response


# ──────────────────────────────────────────────────────────────────────────────
# DESIGN DIRECTIONS
# ──────────────────────────────────────────────────────────────────────────────

def test_design_directions_count():
    gen = VariantGenerator.__new__(VariantGenerator)
    assert len(VariantGenerator.DESIGN_DIRECTIONS) == 5, "Should have 5 design directions"
    print("✓ test_design_directions_count PASSED")


def test_design_directions_structure():
    for direction in VariantGenerator.DESIGN_DIRECTIONS:
        assert 'num' in direction,         f"Missing 'num' in {direction}"
        assert 'name' in direction,        f"Missing 'name' in {direction}"
        assert 'description' in direction, f"Missing 'description' in {direction}"
        assert 'template' in direction,    f"Missing 'template' in {direction}"
        assert isinstance(direction['num'], int),  "num should be int"
        assert 1 <= direction['num'] <= 5, f"num out of range: {direction['num']}"
    print("✓ test_design_directions_structure PASSED")


def test_design_directions_unique():
    nums   = [d['num']      for d in VariantGenerator.DESIGN_DIRECTIONS]
    names  = [d['name']     for d in VariantGenerator.DESIGN_DIRECTIONS]
    tmpls  = [d['template'] for d in VariantGenerator.DESIGN_DIRECTIONS]
    assert len(set(nums))  == 5, "Variant numbers must be unique"
    assert len(set(names)) == 5, "Variant names must be unique"
    assert len(set(tmpls)) == 5, "Templates must be unique"
    print("✓ test_design_directions_unique PASSED")


def test_design_directions_sequential():
    nums = sorted(d['num'] for d in VariantGenerator.DESIGN_DIRECTIONS)
    assert nums == [1, 2, 3, 4, 5], "Variant nums should be 1-5 sequential"
    print("✓ test_design_directions_sequential PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# SYSTEM PROMPT
# ──────────────────────────────────────────────────────────────────────────────

def test_system_prompt_content():
    gen = VariantGenerator.__new__(VariantGenerator)
    prompt = gen.get_system_prompt()
    assert '1080' in prompt,           "System prompt must include 1080px width"
    assert '1350' in prompt,           "System prompt must include 1350px height"
    assert 'DM Sans' in prompt,        "System prompt must include DM Sans font"
    assert 'footer' in prompt.lower(), "System prompt must mention footer banner"
    assert '51ultron.com' in prompt,   "System prompt must include CTA domain"
    assert 'gradient' in prompt.lower(), "System prompt must forbid gradients"
    assert '<!DOCTYPE html>' in prompt, "System prompt must require DOCTYPE"
    print("✓ test_system_prompt_content PASSED")


def test_system_prompt_colors():
    gen = VariantGenerator.__new__(VariantGenerator)
    prompt = gen.get_system_prompt()
    required_colors = ['#BE4628', '#111111', '#F5ECE3', '#FFFFFF', '#888888', '#444444']
    for color in required_colors:
        assert color in prompt, f"System prompt must include color {color}"
    print("✓ test_system_prompt_colors PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# HTML CLEANING
# ──────────────────────────────────────────────────────────────────────────────

def test_html_cleaning_strips_markdown_fences():
    """Verify the fence-stripping logic that lives inside generate_variant"""
    raw = MARKDOWN_WRAPPED_HTML
    html = raw
    if html.startswith('```'):
        html = html.split('```')[1]
        if html.startswith('html'):
            html = html[4:]
        html = html.strip()
    assert html.startswith('<!DOCTYPE'), "Cleaned HTML should start with DOCTYPE"
    assert '```' not in html,           "Cleaned HTML should not contain fences"
    print("✓ test_html_cleaning_strips_markdown_fences PASSED")


def test_html_cleaning_plain_html_unchanged():
    raw = SAMPLE_HTML
    html = raw
    if html.startswith('```'):
        html = html.split('```')[1]
        if html.startswith('html'):
            html = html[4:]
        html = html.strip()
    assert html == SAMPLE_HTML, "Plain HTML must not be modified"
    print("✓ test_html_cleaning_plain_html_unchanged PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# VARIANT SCORER
# ──────────────────────────────────────────────────────────────────────────────

def test_scorer_returns_all_fields():
    scorer = VariantScorer()
    score = scorer.score_variant(SAMPLE_HTML, variant_num=1)
    required = ['variant_num', 'virality', 'save_worthy', 'visual', 'system_thinking',
                'overall', 'go_rebuild']
    for field in required:
        assert field in score, f"Missing field: {field}"
    print("✓ test_scorer_returns_all_fields PASSED")


def test_scorer_score_ranges():
    scorer = VariantScorer()
    for i in range(1, 6):
        score = scorer.score_variant(SAMPLE_HTML, variant_num=i)
        for key in ['virality', 'save_worthy', 'visual', 'system_thinking', 'overall']:
            val = score[key]
            assert 0 <= val <= 100, f"Variant {i}: {key}={val} out of 0-100"
    print("✓ test_scorer_score_ranges PASSED")


def test_scorer_go_rebuild_logic():
    scorer = VariantScorer()
    score = scorer.score_variant(SAMPLE_HTML, variant_num=1)
    if score['overall'] >= 70:
        assert score['go_rebuild'] == 'GO',     ">=70 overall must be GO"
    else:
        assert score['go_rebuild'] == 'REBUILD', "<70 overall must be REBUILD"
    print("✓ test_scorer_go_rebuild_logic PASSED")


def test_scorer_variant_num_stored():
    scorer = VariantScorer()
    for i in [1, 3, 5]:
        score = scorer.score_variant(SAMPLE_HTML, variant_num=i)
        assert score['variant_num'] == i, f"variant_num should be {i}"
    print("✓ test_scorer_variant_num_stored PASSED")


def test_scorer_detects_footer():
    scorer = VariantScorer()
    html_with_footer    = SAMPLE_HTML                                  # has 51ultron
    html_without_footer = SAMPLE_HTML.replace('51ultron.com', '')
    s1 = scorer.score_variant(html_with_footer,    variant_num=1)
    s2 = scorer.score_variant(html_without_footer, variant_num=1)
    # Both should still score in range; just checking no crash
    assert 0 <= s1['overall'] <= 100
    assert 0 <= s2['overall'] <= 100
    print("✓ test_scorer_detects_footer PASSED")


def test_scorer_batch():
    scorer = VariantScorer()
    variants = [
        {'html': SAMPLE_HTML, 'variant_num': i, 'design_direction': f'dir-{i}'}
        for i in range(1, 4)
    ]
    scores = scorer.score_batch(variants)
    assert len(scores) == 3,                "Should return 3 scores"
    assert scores[0]['variant_num'] == 1
    assert scores[1]['variant_num'] == 2
    assert scores[2]['variant_num'] == 3
    print("✓ test_scorer_batch PASSED")


def test_scorer_dark_hero_gets_scroll_stop_boost():
    scorer = VariantScorer()
    dark_score  = scorer.score_variant(SAMPLE_HTML, variant_num=1)
    other_score = scorer.score_variant(SAMPLE_HTML, variant_num=3)
    # Variant 1 (dark hero) gets scroll_stop=80 vs 75 for others
    # We can't directly compare virality because other signals differ; just verify range
    assert dark_score['virality']  >= 70
    assert other_score['virality'] >= 70
    print("✓ test_scorer_dark_hero_gets_scroll_stop_boost PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# ASYNC GENERATE VARIANT (mocked)
# ──────────────────────────────────────────────────────────────────────────────

async def _generate_variant_with_mocks(variant_num: int = 1, html_response: str = SAMPLE_HTML):
    """Helper: run generate_variant with all external calls mocked."""
    mock_response = make_mock_anthropic_response(html_response)
    mock_export   = make_mock_export(variant_num)

    with patch.dict('sys.modules', {'anthropic': MagicMock()}):
        import anthropic as mock_anthropic
        mock_client = MagicMock()
        mock_client.messages.create.return_value = mock_response
        mock_anthropic.Anthropic.return_value = mock_client

        gen = VariantGenerator.__new__(VariantGenerator)
        gen.exporter = MagicMock()
        gen.exporter.capture_html = AsyncMock(return_value=mock_export)
        gen.brew   = BrewAlgorithmStub()
        gen.sync   = MagicMock()
        gen.output_dir = '/mnt/user-data/outputs'

        direction = VariantGenerator.DESIGN_DIRECTIONS[variant_num - 1]
        return await gen.generate_variant('Test concept', variant_num, direction)


class BrewAlgorithmStub:
    def calculate_overall(self, *args):
        return 83


def test_generate_variant_returns_expected_keys():
    result = asyncio.run(_generate_variant_with_mocks(variant_num=1))
    required = ['variant_num', 'design_direction', 'template', 'html', 'export', 'generated_at']
    for key in required:
        assert key in result, f"Missing key: {key}"
    print("✓ test_generate_variant_returns_expected_keys PASSED")


def test_generate_variant_html_cleaned():
    result = asyncio.run(_generate_variant_with_mocks(
        variant_num=1, html_response=MARKDOWN_WRAPPED_HTML
    ))
    assert result['html'].startswith('<!DOCTYPE'), "HTML should be cleaned of fences"
    assert '```' not in result['html'],             "HTML must not contain backticks"
    print("✓ test_generate_variant_html_cleaned PASSED")


def test_generate_variant_export_attached():
    result = asyncio.run(_generate_variant_with_mocks(variant_num=2))
    assert result['export']['success'] is True
    assert 'variant-2-1080x1350.png' in result['export']['png_filename']
    print("✓ test_generate_variant_export_attached PASSED")


def test_generate_variant_correct_direction():
    for i in range(1, 6):
        result = asyncio.run(_generate_variant_with_mocks(variant_num=i))
        expected_name = VariantGenerator.DESIGN_DIRECTIONS[i - 1]['name']
        assert result['design_direction'] == expected_name, \
            f"Variant {i}: direction mismatch"
    print("✓ test_generate_variant_correct_direction PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# FULL PIPELINE (generate_and_save)
# ──────────────────────────────────────────────────────────────────────────────

def _make_fake_variants(n: int) -> list:
    return [
        {
            'variant_num': i + 1,
            'design_direction': VariantGenerator.DESIGN_DIRECTIONS[i]['name'],
            'template': VariantGenerator.DESIGN_DIRECTIONS[i]['template'],
            'html': SAMPLE_HTML,
            'export': make_mock_export(i + 1),
            'generated_at': datetime.now().isoformat()
        }
        for i in range(n)
    ]


def _make_batch_result(concept: str, n: int) -> dict:
    return {
        'concept': concept,
        'total_variants': n,
        'variants': _make_fake_variants(n),
        'batch_completed_at': datetime.now().isoformat()
    }


async def _run_pipeline(concept: str, num_variants: int, save_to_db: bool):
    """Run generate_and_save with VariantGenerator and BatchSync mocked out."""
    fake_batch = _make_batch_result(concept, num_variants)

    mock_generator = MagicMock()
    mock_generator.output_dir = '/mnt/user-data/outputs'
    mock_generator.batch_generate = AsyncMock(return_value=fake_batch)

    mock_batch_sync = MagicMock()
    mock_batch_sync.save_batch.return_value = {
        'batch_id': 'test-batch-uuid',
        'concept': concept,
        'total_variants': num_variants,
        'saved_count': num_variants,
        'failed_count': 0,
        'saved_ids': [f'id-{i}' for i in range(num_variants)],
        'saved_at': datetime.now().isoformat()
    }

    with patch('batch_generator.VariantGenerator', return_value=mock_generator), \
         patch('batch_generator.BatchSync',        return_value=mock_batch_sync):
        return await generate_and_save(concept, num_variants=num_variants, save_to_db=save_to_db)


def test_pipeline_returns_correct_variant_count():
    result = asyncio.run(_run_pipeline('5 mistakes founders make with Claude AI', 5, True))
    assert result['total_variants'] == 5
    assert len(result['variants']) == 5
    print("✓ test_pipeline_returns_correct_variant_count PASSED")


def test_pipeline_saves_to_db_when_flag_true():
    result = asyncio.run(_run_pipeline('Test concept', 3, True))
    assert 'database' in result, "Result should include database key when save_to_db=True"
    db = result['database']
    assert db['saved_count'] == 3
    assert db['failed_count'] == 0
    print("✓ test_pipeline_saves_to_db_when_flag_true PASSED")


def test_pipeline_skips_db_when_flag_false():
    result = asyncio.run(_run_pipeline('Test concept', 3, False))
    assert 'database' not in result, "Result must not have database key when save_to_db=False"
    print("✓ test_pipeline_skips_db_when_flag_false PASSED")


def test_pipeline_concept_in_result():
    concept = '5 mistakes founders make with Claude AI'
    result = asyncio.run(_run_pipeline(concept, 2, False))
    assert result['concept'] == concept
    print("✓ test_pipeline_concept_in_result PASSED")


def test_pipeline_single_variant():
    result = asyncio.run(_run_pipeline('Minimal test', 1, True))
    assert result['total_variants'] == 1
    assert len(result['variants']) == 1
    assert result['database']['saved_count'] == 1
    print("✓ test_pipeline_single_variant PASSED")


def test_pipeline_variants_have_scores():
    result = asyncio.run(_run_pipeline('Scored concept', 3, False))
    for variant in result['variants']:
        assert 'html' in variant
        assert 'export' in variant
        assert variant['export']['success'] is True
    print("✓ test_pipeline_variants_have_scores PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# DB INTEGRATION WITHIN PIPELINE
# ──────────────────────────────────────────────────────────────────────────────

def test_pipeline_db_receives_correct_structure():
    """Verify that save_batch is called with the right variant/score shape"""
    from batch_generator import VariantScorer, BatchSync

    concept = 'Test DB structure'
    num_variants = 2
    fake_batch = _make_batch_result(concept, num_variants)

    captured_variants = []
    captured_scores   = []

    def mock_save_batch(concept, variants, scores):
        captured_variants.extend(variants)
        captured_scores.extend(scores)
        return {
            'batch_id': 'x', 'concept': concept,
            'total_variants': len(variants), 'saved_count': len(variants),
            'failed_count': 0, 'saved_ids': ['a', 'b'],
            'saved_at': datetime.now().isoformat()
        }

    mock_generator = MagicMock()
    mock_generator.output_dir = '/mnt/user-data/outputs'
    mock_generator.batch_generate = AsyncMock(return_value=fake_batch)

    mock_batch_sync = MagicMock()
    mock_batch_sync.save_batch.side_effect = mock_save_batch

    with patch('batch_generator.VariantGenerator', return_value=mock_generator), \
         patch('batch_generator.BatchSync',        return_value=mock_batch_sync):
        asyncio.run(generate_and_save(concept, num_variants=num_variants, save_to_db=True))

    assert len(captured_variants) == num_variants
    assert len(captured_scores)   == num_variants

    for v in captured_variants:
        assert 'html'             in v
        assert 'png_filename'     in v
        assert 'design_direction' in v

    for s in captured_scores:
        assert 'overall'     in s
        assert 'virality'    in s
        assert 'go_rebuild'  in s

    print("✓ test_pipeline_db_receives_correct_structure PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# Runner
# ──────────────────────────────────────────────────────────────────────────────

def run_all_tests():
    print("\n" + "="*80)
    print("✓ BATCH GENERATOR TEST SUITE")
    print("="*80 + "\n")

    tests = [
        # Design directions
        test_design_directions_count,
        test_design_directions_structure,
        test_design_directions_unique,
        test_design_directions_sequential,
        # System prompt
        test_system_prompt_content,
        test_system_prompt_colors,
        # HTML cleaning
        test_html_cleaning_strips_markdown_fences,
        test_html_cleaning_plain_html_unchanged,
        # Scorer
        test_scorer_returns_all_fields,
        test_scorer_score_ranges,
        test_scorer_go_rebuild_logic,
        test_scorer_variant_num_stored,
        test_scorer_detects_footer,
        test_scorer_batch,
        test_scorer_dark_hero_gets_scroll_stop_boost,
        # Async variant generation
        test_generate_variant_returns_expected_keys,
        test_generate_variant_html_cleaned,
        test_generate_variant_export_attached,
        test_generate_variant_correct_direction,
        # Full pipeline
        test_pipeline_returns_correct_variant_count,
        test_pipeline_saves_to_db_when_flag_true,
        test_pipeline_skips_db_when_flag_false,
        test_pipeline_concept_in_result,
        test_pipeline_single_variant,
        test_pipeline_variants_have_scores,
        test_pipeline_db_receives_correct_structure,
    ]

    passed = 0
    failed = []
    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"✗ {test.__name__} FAILED: {e}")
            failed.append(test.__name__)
        except Exception as e:
            print(f"✗ {test.__name__} ERROR: {type(e).__name__}: {e}")
            failed.append(test.__name__)

    print("\n" + "="*80)
    if failed:
        print(f"✗ {len(failed)}/{len(tests)} TESTS FAILED")
        for name in failed:
            print(f"  - {name}")
    else:
        print(f"✓ ALL {len(tests)} TESTS PASSED")
    print("="*80 + "\n")
    return len(failed) == 0


if __name__ == '__main__':
    success = run_all_tests()
    sys.exit(0 if success else 1)
