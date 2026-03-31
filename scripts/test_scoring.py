"""
Comprehensive test suite for 360BREW scoring algorithm
Tests all dimensions, edge cases, and validation logic
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from scoring import BrewAlgorithm, format_score_report


def test_high_scoring_variant():
    """Test high-scoring content that should recommend GO"""
    brew = BrewAlgorithm()

    result = brew.full_score(
        scroll_stop=85, clarity_3s=90, novelty=80, emotional_trigger=85, format_fit=90,
        utility_density=85, reusability=85, compression=80, structure_clarity=85, actionability=85,
        hierarchy_strength=85, contrast_control=80, spacing_balance=85, consistency=85, noise_level=80,
        framework_clarity=80, modularity=85, transferability=85, depth_vs_simplicity=80
    )

    assert result.overall >= 70, "High-scoring content should be >= 70"
    assert result.go_rebuild == 'GO', "Should recommend GO"
    assert len(result.strengths) >= 2, "Should have multiple strengths"
    print("✓ test_high_scoring_variant PASSED")


def test_low_scoring_variant():
    """Test low-scoring content that should recommend REBUILD"""
    brew = BrewAlgorithm()

    result = brew.full_score(
        scroll_stop=45, clarity_3s=50, novelty=40, emotional_trigger=45, format_fit=50,
        utility_density=45, reusability=50, compression=45, structure_clarity=40, actionability=45,
        hierarchy_strength=50, contrast_control=45, spacing_balance=50, consistency=45, noise_level=40,
        framework_clarity=50, modularity=45, transferability=50, depth_vs_simplicity=45
    )

    assert result.overall < 70, "Low-scoring content should be < 70"
    assert result.go_rebuild == 'REBUILD', "Should recommend REBUILD"
    assert len(result.weak_points) >= 2, "Should identify weak points"
    print("✓ test_low_scoring_variant PASSED")


def test_perfect_score():
    """Test perfect 100/100 score"""
    brew = BrewAlgorithm()

    result = brew.full_score(
        scroll_stop=100, clarity_3s=100, novelty=100, emotional_trigger=100, format_fit=100,
        utility_density=100, reusability=100, compression=100, structure_clarity=100, actionability=100,
        hierarchy_strength=100, contrast_control=100, spacing_balance=100, consistency=100, noise_level=100,
        framework_clarity=100, modularity=100, transferability=100, depth_vs_simplicity=100
    )

    assert result.overall == 100, "Perfect inputs should yield 100"
    assert result.virality == 100, "Virality should be 100"
    assert result.save_worthy == 100, "Save-worthy should be 100"
    assert result.visual == 100, "Visual should be 100"
    assert result.system_thinking == 100, "System thinking should be 100"
    assert len(result.strengths) == 4, "Should have all 4 strengths"
    assert len(result.weak_points) == 0, "Should have no weak points"
    print("✓ test_perfect_score PASSED")


def test_zero_score():
    """Test zero/minimum score"""
    brew = BrewAlgorithm()

    result = brew.full_score()  # All defaults = 0

    assert result.overall == 0, "Zero inputs should yield 0"
    assert result.virality == 0, "All dimensions should be 0"
    assert result.go_rebuild == 'REBUILD', "0 should recommend REBUILD"
    assert len(result.weak_points) == 4, "All dimensions should be weak"
    print("✓ test_zero_score PASSED")


def test_boundary_70():
    """Test boundary case at threshold (70)"""
    brew = BrewAlgorithm()

    result = brew.full_score(
        scroll_stop=70, clarity_3s=70, novelty=70, emotional_trigger=70, format_fit=70,
        utility_density=70, reusability=70, compression=70, structure_clarity=70, actionability=70,
        hierarchy_strength=70, contrast_control=70, spacing_balance=70, consistency=70, noise_level=70,
        framework_clarity=70, modularity=70, transferability=70, depth_vs_simplicity=70
    )

    assert result.overall == 70, "70 inputs should yield 70"
    assert result.go_rebuild == 'GO', "70 should recommend GO (at threshold)"
    print("✓ test_boundary_70 PASSED")


def test_boundary_69():
    """Test boundary case below threshold (69)"""
    brew = BrewAlgorithm()

    result = brew.full_score(
        scroll_stop=69, clarity_3s=69, novelty=69, emotional_trigger=69, format_fit=69,
        utility_density=69, reusability=69, compression=69, structure_clarity=69, actionability=69,
        hierarchy_strength=69, contrast_control=69, spacing_balance=69, consistency=69, noise_level=69,
        framework_clarity=69, modularity=69, transferability=69, depth_vs_simplicity=69
    )

    assert result.overall == 69, "69 inputs should yield 69"
    assert result.go_rebuild == 'REBUILD', "69 should recommend REBUILD (below threshold)"
    print("✓ test_boundary_69 PASSED")


def test_virality_dimension():
    """Test virality dimension calculation"""
    brew = BrewAlgorithm()

    score, breakdown = brew.score_virality(
        scroll_stop=100,
        clarity_3s=100,
        novelty=100,
        emotional_trigger=100,
        format_fit=100
    )

    assert score == 100, "All 100s should yield 100"
    assert breakdown['scroll_stop'] == 100
    assert breakdown['clarity_3s'] == 100
    print("✓ test_virality_dimension PASSED")


def test_save_worthy_dimension():
    """Test save-worthy dimension calculation"""
    brew = BrewAlgorithm()

    score, breakdown = brew.score_save_worthy(
        utility_density=80,
        reusability=80,
        compression=80,
        structure_clarity=80,
        actionability=80
    )

    assert score == 80, "All 80s should yield 80"
    assert breakdown['utility_density'] == 80
    print("✓ test_save_worthy_dimension PASSED")


def test_visual_dimension():
    """Test visual efficiency dimension calculation"""
    brew = BrewAlgorithm()

    score, breakdown = brew.score_visual_efficiency(
        hierarchy_strength=90,
        contrast_control=90,
        spacing_balance=90,
        consistency=90,
        noise_level=90
    )

    assert score == 90, "All 90s should yield 90"
    assert breakdown['hierarchy_strength'] == 90
    print("✓ test_visual_dimension PASSED")


def test_system_thinking_dimension():
    """Test system thinking dimension calculation"""
    brew = BrewAlgorithm()

    score, breakdown = brew.score_system_thinking(
        framework_clarity=85,
        modularity=85,
        transferability=85,
        depth_vs_simplicity=85
    )

    assert score == 85, "All 85s should yield 85"
    assert breakdown['framework_clarity'] == 85
    print("✓ test_system_thinking_dimension PASSED")


def test_format_score_report():
    """Test report formatting"""
    brew = BrewAlgorithm()

    result = brew.full_score(
        scroll_stop=85, clarity_3s=90, novelty=80, emotional_trigger=85, format_fit=90,
        utility_density=85, reusability=85, compression=80, structure_clarity=85, actionability=85,
        hierarchy_strength=85, contrast_control=80, spacing_balance=85, consistency=85, noise_level=80,
        framework_clarity=80, modularity=85, transferability=85, depth_vs_simplicity=80
    )

    report = format_score_report(result)

    assert '360BREW' in report, "Report should contain title"
    assert f'{result.overall}/100' in report, "Report should contain overall score"
    assert result.go_rebuild in report, "Report should contain recommendation"
    assert 'STRENGTHS' in report, "Report should contain strengths section"
    print("✓ test_format_score_report PASSED")


def test_mixed_scores():
    """Test with varied input scores"""
    brew = BrewAlgorithm()

    result = brew.full_score(
        scroll_stop=95, clarity_3s=80, novelty=60, emotional_trigger=90, format_fit=75,
        utility_density=85, reusability=70, compression=88, structure_clarity=82, actionability=79,
        hierarchy_strength=92, contrast_control=78, spacing_balance=86, consistency=81, noise_level=75,
        framework_clarity=88, modularity=76, transferability=84, depth_vs_simplicity=73
    )

    assert 0 <= result.overall <= 100, "Score should be between 0-100"
    assert 0 <= result.virality <= 100, "Virality should be between 0-100"
    assert 0 <= result.save_worthy <= 100, "Save-worthy should be between 0-100"
    assert 0 <= result.visual <= 100, "Visual should be between 0-100"
    assert 0 <= result.system_thinking <= 100, "System thinking should be between 0-100"
    print("✓ test_mixed_scores PASSED")


def run_all_tests():
    """Run complete test suite"""
    print("\n" + "="*80)
    print("✓ 360BREW SCORING TEST SUITE")
    print("="*80 + "\n")

    tests = [
        test_high_scoring_variant,
        test_low_scoring_variant,
        test_perfect_score,
        test_zero_score,
        test_boundary_70,
        test_boundary_69,
        test_virality_dimension,
        test_save_worthy_dimension,
        test_visual_dimension,
        test_system_thinking_dimension,
        test_format_score_report,
        test_mixed_scores,
    ]

    for test in tests:
        try:
            test()
        except AssertionError as e:
            print(f"✗ {test.__name__} FAILED: {e}")
            return False

    print("\n" + "="*80)
    print(f"✓ ALL {len(tests)} TESTS PASSED")
    print("="*80 + "\n")
    return True


if __name__ == '__main__':
    success = run_all_tests()
    sys.exit(0 if success else 1)
