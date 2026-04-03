# Claude Code Configuration for LinkedIn Content Engine

## Overview

This project uses Claude Code to generate, score, and export LinkedIn infographics with premium design and high engagement potential.

## Skills

### LinkedIn Content Creator Skill

**Location:** `.claude/skills/linkedin-content-creator/SKILL.md`

**Purpose:** Generate 5 design variants of LinkedIn concepts, score them using 360Brew algorithm, and export as PNG @ 1080×1350 @ 144dpi.

**Usage:**

Generate 5 variants:
```python
import asyncio
from batch_generator import generate_and_save

result = await generate_and_save(
    concept="Your concept here",
    num_variants=5,
    save_to_db=True
)
```

Score a concept before building:
```python
from scoring import BrewAlgorithm

brew = BrewAlgorithm()
score = brew.full_score(
    scroll_stop=85,
    clarity_3s=90,
    novelty=80,
    emotional_trigger=75,
    format_fit=85
)
print(f"Overall: {score.overall}/100 → {score.go_rebuild}")
```

Export variant to PNG:
```python
from export_playwright import PlaywrightExporter

exporter = PlaywrightExporter()
result = await exporter.capture_html(
    html="<html>...</html>",
    filename="my-variant"
)
```

**Key Features:**
- 5 design layout variants (dark hero, light editorial, acrostic, steps, mosaic)
- 360Brew scoring: Virality (25), Save-Worthy (25), Visual (25), System (25)
- Playwright PNG export @ 1080×1350 @ 144dpi
- Supabase integration for variant tracking
- Anthropic Design System compliance (from Figma)

**Modules:**
- `batch_generator.py` — Generate 5 variants in parallel
- `export_playwright.py` — Export HTML → PNG at retina quality
- `scoring.py` — 360Brew algorithm scoring
- `design_system.py` — Colors, rules, patterns, validators
- `db_sync.py` — Supabase integration

## Design System

All designs use the **Anthropic Design System** (pixel-sampled from Figma):

**Colors:**
- `#BE4628` — Orange Light (light backgrounds)
- `#C84623` — Orange Dark (dark backgrounds)
- `#D26446` — Orange Warm (carousels)
- `#111111` — Black (hero, footer, headers)
- `#F5ECE3` — Cream (primary background)
- `#EFEBE0` — Beige (alternative background)
- `#FFFFFF` — White (cards)

**Typography:**
- Headers: Anthropic Sans
- Code: JetBrains Mono

**Rules:**
- ✅ Footer banner on every artifact
- ✅ Section labels above titles
- ✅ Subtitle min 15px
- ✅ Max 3 ideas per card
- ❌ NO gradients, shadows, emoji, green/blue/purple/yellow/pink
- ❌ NO Lorem ipsum, pill borders (max 4px)

## Environment Setup

Add to `.env.local` (never commit):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-...
```

Claude Code automatically loads these via `os.environ`.

## Scripts Location

All Python scripts are in `/scripts/`:
- `main.py` — Entry point, tests, CLI
- `batch_generator.py` — Generate 5 variants
- `export_playwright.py` — PNG/PDF export
- `scoring.py` — 360Brew algorithm
- `design_system.py` — Colors, rules, validators
- `db_sync.py` — Supabase integration

Run tests:
```bash
cd /home/user/linkedin-content-engine
python scripts/main.py --test
```

## Database Schema

Supabase tables needed:

```sql
-- variants table
CREATE TABLE variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept TEXT,
  html_artifact TEXT,
  png_filename VARCHAR,
  variant_num INT,
  score_overall INT,
  score_virality INT,
  score_save_worthy INT,
  score_visual INT,
  score_system_thinking INT,
  design_direction VARCHAR,
  status VARCHAR DEFAULT 'generated',
  created_at TIMESTAMP DEFAULT now()
);

-- posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES variants(id) ON DELETE CASCADE,
  post_copy TEXT,
  first_comment TEXT,
  linkedin_post_id VARCHAR,
  posted_at TIMESTAMP,
  reach INT,
  engagement INT,
  saves INT,
  created_at TIMESTAMP DEFAULT now()
);

-- exports table
CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES variants(id) ON DELETE CASCADE,
  format VARCHAR,
  file_path VARCHAR,
  file_size INT,
  exported_at TIMESTAMP DEFAULT now()
);
```

## Workflow

1. **Concept** — You provide a topic or idea
2. **Generate** — Claude Code generates 5 variants (different layouts)
3. **Score** — 360Brew algorithm scores each variant
4. **Export** — PNG files at 1080×1350 @ 144dpi
5. **Review** — Check scores, download PNGs
6. **Post** — Post on LinkedIn
7. **Track** — Database tracks reach, engagement, saves

## Performance

- Single variant: ~30-45 seconds
- 5-variant batch: ~60-90 seconds
- PNG export per variant: ~8-12 seconds
- Database sync: <1 second per variant
- **Total: ~2-3 minutes for 5 variants, end-to-end**

## Common Commands

Generate 5 variants:
```python
result = await generate_and_save("Your concept", num_variants=5, save_to_db=True)
```

Score a concept:
```python
score = brew.full_score(scroll_stop=85, clarity_3s=90, novelty=80, ...)
```

Export to PNG:
```python
result = await exporter.capture_html(html, filename="variant")
```

Get variants from database:
```python
variants = sync.get_variants(concept="Claude vs ChatGPT")
```

Update variant status:
```python
sync.update_variant_status(variant_id, "posted")
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Module not found | Run `python scripts/main.py --test` to verify setup |
| Playwright not found | `playwright install chromium` |
| Supabase connection failed | Check `.env.local` has correct keys |
| PNG export is blurry | Uses 2x scale + LANCZOS, should be sharp |
| Colors don't match | Check hex codes in `design_system.py` against Figma |

## Next Steps

1. **Setup Supabase** — Create project, run schema
2. **Add environment variables** — `.env.local` with keys
3. **Test** — `python scripts/main.py --test`
4. **Generate first batch** — `await generate_and_save("Your concept")`
5. **Review outputs** — Check scores in `/mnt/user-data/outputs/`
6. **Post on LinkedIn** — Download PNG and post
