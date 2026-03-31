"""
Batch Variant Generator
Generates multiple design variants of the same concept via Claude API
Includes parallel processing, scoring, and database sync
"""

import asyncio
import json
from typing import List, Dict, Optional
from datetime import datetime
import os
from pathlib import Path


def _load_env():
    """Load .env.local from repo root if present (no external deps needed)."""
    for candidate in [
        Path(__file__).parent.parent / '.env.local',
        Path(__file__).parent / '.env.local',
    ]:
        if candidate.exists():
            with open(candidate) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        k, _, v = line.partition('=')
                        os.environ.setdefault(k.strip(), v.strip().strip('"\''))
            break


_load_env()

from export_playwright import PlaywrightExporter
from scoring import BrewAlgorithm, format_score_report
from db_sync import SupabaseSync, BatchSync
from design_system import DESIGN_COLORS, DESIGN_RULES


class VariantGenerator:
    """Generate multiple HTML variants of the same concept"""
    
    def __init__(self):
        self.exporter = PlaywrightExporter()
        self.brew = BrewAlgorithm()
        self.sync = SupabaseSync()
        self.output_dir = "/mnt/user-data/outputs"
    
    # Design directions for 5 variants
    DESIGN_DIRECTIONS = [
        {
            'num': 1,
            'name': 'Dark Hero + Stats',
            'description': 'Dark #111 hero top (30%), massive title, stat row with metrics. Light #F8F6F1 body with feature table.',
            'template': 'dark_hero_light_body'
        },
        {
            'num': 2,
            'name': 'Light Editorial',
            'description': 'Light #F8F6F1 throughout. Comparison table with winner column. White cards on warm background.',
            'template': 'light_editorial'
        },
        {
            'num': 3,
            'name': 'Acrostic Framework',
            'description': 'Framework where letters spell word. Modular cards, equal weight. Pyramid or grid layout.',
            'template': 'modular_cards'
        },
        {
            'num': 4,
            'name': 'Numbered Steps',
            'description': '3-column grid of numbered steps. Each card: number, title, description. Progressive complexity.',
            'template': 'numbered_steps'
        },
        {
            'num': 5,
            'name': 'Asymmetric Mosaic',
            'description': 'Mixed content types. Asymmetric grid. Dark section alternates with light. Magazine-editorial vibe.',
            'template': 'mosaic'
        }
    ]
    
    def get_system_prompt(self) -> str:
        """Get the system prompt for Claude API"""
        return """You are the Ultron LinkedIn Content Engine.

Your job: Generate a complete, self-contained HTML artifact (1080×1350px) for LinkedIn.

CRITICAL RULES:
1. HTML must be valid and self-contained with inline CSS only
2. Exact dimensions: width 1080px, height 1350px minimum (full-height, no cropping)
3. Font stack: "DM Sans", Arial, Helvetica, sans-serif
4. Colors ONLY from: #BE4628, #C84623, #D26446, #111111, #F5ECE3, #EFEBE0, #FAF9F7, #FFFFFF, #939391, #2B2A26, #CCCCCC, #888888, #444444
5. NO gradients, NO shadows, NO green/blue/purple/yellow/pink
6. NO rounded pill borders (max 4px on cards, 2px on badges)
7. Section padding: 32-40px top/bottom, 40-48px sides
8. Every artifact must have a footer banner at bottom:
   - Background: #111
   - Left: white text "Ultron [specific benefit]. [pain point solution]."
   - Right: orange text "See how at 51ultron.com ->"
9. Use real typographic characters: • → — … ✓ ✗
10. No lorem ipsum, no placeholder content

OUTPUT: Raw HTML only. Start with <!DOCTYPE html>. No markdown, no backticks, no explanation.
"""
    
    async def generate_variant(
        self,
        concept: str,
        variant_num: int,
        design_direction: Dict
    ) -> Dict:
        """
        Generate a single HTML variant via Claude API
        
        Args:
            concept: The concept to generate
            variant_num: Variant number (1-5)
            design_direction: Dict with name, description, template
            
        Returns:
            dict with html, variant info, and export result
        """
        try:
            from anthropic import Anthropic
        except ImportError:
            print("Installing anthropic...")
            os.system("pip install anthropic --break-system-packages")
            from anthropic import Anthropic
        
        client = Anthropic()
        
        user_prompt = f"""Concept: {concept}

Design Direction for Variant {variant_num}: {design_direction['name']}
Layout Template: {design_direction['template']}

{design_direction['description']}

Create a unique, scroll-stopping, save-worthy LinkedIn infographic. This is variant {variant_num} of 5.
Make it visually distinct from variants 1, 2, 3, 4, 5 while addressing the same concept.

Remember:
- Footer banner mandatory
- One dominant element per section
- Maximum 3 ideas per card
- Real typography: • → — … ✓ ✗
- No lorem ipsum
"""
        
        print(f"\n📐 Generating Variant {variant_num}: {design_direction['name']}...")

        try:
            response = client.messages.create(
                model="claude-opus-4-6",
                max_tokens=4000,
                system=self.get_system_prompt(),
                messages=[{"role": "user", "content": user_prompt}]
            )
        except Exception as api_err:
            err_type = type(api_err).__name__
            if 'AuthenticationError' in err_type or '401' in str(api_err):
                print(f"   ✗ Variant {variant_num}: API key invalid — set ANTHROPIC_API_KEY in .env.local")
            else:
                print(f"   ✗ Variant {variant_num}: API error — {api_err}")
            return {
                'variant_num': variant_num,
                'design_direction': design_direction['name'],
                'template': design_direction['template'],
                'html': '',
                'export': {'success': False, 'error': str(api_err), 'error_type': err_type},
                'error': str(api_err),
                'generated_at': datetime.now().isoformat()
            }

        html = response.content[0].text

        # Clean HTML if wrapped in markdown
        if html.startswith('```'):
            html = html.split('```')[1]
            if html.startswith('html'):
                html = html[4:]
            html = html.strip()

        print(f"   ✓ HTML generated ({len(html)} chars)")

        # Export to PNG
        export_result = await self.exporter.capture_html(
            html,
            filename=f"variant-{variant_num}",
            hide_export_bar=True
        )

        if export_result.get('success'):
            renderer = export_result.get('renderer', 'playwright')
            print(f"   ✓ PNG exported: {export_result['png_filename']} ({export_result['file_size_kb']}KB) [{renderer}]")
        else:
            print(f"   ✗ PNG export failed: {export_result.get('error')}")

        return {
            'variant_num': variant_num,
            'design_direction': design_direction['name'],
            'template': design_direction['template'],
            'html': html,
            'export': export_result,
            'generated_at': datetime.now().isoformat()
        }
    
    async def batch_generate(
        self,
        concept: str,
        num_variants: int = 5,
        on_progress = None
    ) -> Dict:
        """
        Generate multiple variants in parallel
        
        Args:
            concept: The concept to generate
            num_variants: Number of variants (1-5)
            on_progress: Callback function(current, total)
            
        Returns:
            dict with all variants, batch stats
        """
        print(f"\n{'='*80}")
        print(f"🚀 BATCH GENERATION: {concept}")
        print(f"{'='*80}")
        
        # Limit to available directions
        num_variants = min(num_variants, len(self.DESIGN_DIRECTIONS))
        directions = self.DESIGN_DIRECTIONS[:num_variants]
        
        tasks = [
            self.generate_variant(concept, direction['num'], direction)
            for direction in directions
        ]
        
        variants = []
        for i, task in enumerate(asyncio.as_completed(tasks)):
            if on_progress:
                on_progress(i + 1, num_variants)
            try:
                result = await task
            except Exception as e:
                print(f"   ✗ Variant task failed: {e}")
                result = {
                    'variant_num': i + 1,
                    'design_direction': 'unknown',
                    'template': 'unknown',
                    'html': '',
                    'export': {'success': False, 'error': str(e)},
                    'error': str(e),
                    'generated_at': datetime.now().isoformat()
                }
            variants.append(result)
        
        # Sort by variant num
        variants.sort(key=lambda x: x['variant_num'])
        
        return {
            'concept': concept,
            'total_variants': num_variants,
            'variants': variants,
            'batch_completed_at': datetime.now().isoformat()
        }


class VariantScorer:
    """Score generated variants for quality"""
    
    def __init__(self):
        self.brew = BrewAlgorithm()
    
    def score_variant(
        self,
        html: str,
        variant_num: int
    ) -> Dict:
        """
        Score a variant (simplified scoring based on HTML analysis)
        In production, this would be more sophisticated.
        """
        # Analyze HTML for scoring signals
        has_footer = 'footer' in html.lower() or '51ultron' in html
        has_stats = any(x in html for x in ['<h2>', '<h3>', '36px', '48px'])
        has_comparison = 'winner' in html.lower() or 'best' in html.lower()
        has_structure = html.count('<section>') > 0 or html.count('<div') > 5
        
        # Base scores
        hierarchy = 75 if has_stats else 70
        contrast = 80 if '#111' in html and '#F8' in html else 75
        spacing = 75
        consistency = 80 if 'DM Sans' in html or 'Arial' in html else 70
        noise = 80
        
        visual_score = int((hierarchy + contrast + spacing + consistency + noise) / 5)
        
        # Virality (scroll-stop depends on design)
        scroll_stop = 80 if variant_num == 1 else 75  # Dark hero usually better
        clarity = 85
        novelty = 80 if variant_num > 2 else 75
        emotional = 78
        format_fit = 90
        
        virality_score = int((scroll_stop + clarity + novelty + emotional + format_fit) / 5)
        
        # Save-worthy
        utility = 85 if has_comparison else 80
        reusability = 85
        compression = 80
        structure = 85 if has_structure else 75
        actionable = 80
        
        save_worthy_score = int((utility + reusability + compression + structure + actionable) / 5)
        
        # System thinking
        framework = 80 if has_comparison else 75
        modularity = 80
        transferable = 80
        depth = 80
        
        system_score = int((framework + modularity + transferable + depth) / 4)
        
        overall = self.brew.calculate_overall(
            virality_score, save_worthy_score, visual_score, system_score
        )
        
        return {
            'variant_num': variant_num,
            'virality': virality_score,
            'save_worthy': save_worthy_score,
            'visual': visual_score,
            'system_thinking': system_score,
            'overall': overall,
            'go_rebuild': 'GO' if overall >= 70 else 'REBUILD'
        }
    
    def score_batch(self, variants: List[Dict]) -> List[Dict]:
        """Score all variants in batch"""
        scores = []
        for variant in variants:
            score = self.score_variant(variant['html'], variant['variant_num'])
            scores.append(score)
            print(f"\n   Variant {variant['variant_num']}: {score['overall']}/100 ({score['go_rebuild']})")
        
        return scores


async def generate_and_save(
    concept: str,
    num_variants: int = 5,
    save_to_db: bool = True
) -> Dict:
    """
    Full pipeline: generate variants -> score -> export -> save to DB
    """
    generator = VariantGenerator()
    scorer = VariantScorer()
    batch_sync = BatchSync()
    
    # Generate variants
    batch_result = await generator.batch_generate(concept, num_variants)
    
    # Score variants
    print(f"\n{'='*80}")
    print(f"📊 SCORING VARIANTS")
    print(f"{'='*80}")
    scores = scorer.score_batch(batch_result['variants'])
    
    # Save to database
    if save_to_db:
        print(f"\n{'='*80}")
        print(f"💾 SAVING TO DATABASE")
        print(f"{'='*80}")
        
        db_result = batch_sync.save_batch(
            concept=concept,
            variants=[
                {
                    'html': v['html'],
                    'png_filename': v['export'].get('png_filename', ''),
                    'design_direction': v['design_direction']
                }
                for v in batch_result['variants']
            ],
            scores=scores
        )
        
        print(f"\n✓ Batch saved: {db_result['saved_count']}/{db_result['total_variants']} variants")
        if db_result['failed_count'] > 0:
            print(f"✗ Failed: {db_result['failed_count']}")
        
        batch_result['database'] = db_result
    
    # Summary
    print(f"\n{'='*80}")
    print(f"✓ BATCH COMPLETE")
    print(f"{'='*80}")
    print(f"Concept: {concept}")
    print(f"Variants: {batch_result['total_variants']}")
    print(f"Average score: {sum(s['overall'] for s in scores) / len(scores):.0f}/100")
    print(f"Output dir: {generator.output_dir}")
    
    return batch_result


if __name__ == '__main__':
    print("Batch Variant Generator Module Loaded")
    print("\nUsage: asyncio.run(generate_and_save('Your concept here', num_variants=5))")
