# LinkedIn Content Creator Skill for Claude Code

Generate, score, and export LinkedIn infographics (1080×1350px @ 144dpi) using the Anthropic Design System.

## Quick Start

### 1. Generate 5 variants of a concept:

```python
import asyncio
from batch_generator import generate_and_save

result = await generate_and_save(
    concept="Your idea here",
    num_variants=5,
    save_to_db=True
)
```

Output: 5 PNG files in `/mnt/user-data/outputs/` + metadata in Supabase

### 2. Score a concept before building:

```python
from scoring import BrewAlgorithm

brew = BrewAlgorithm()
score = brew.full_score(
    scroll_stop=85,        # Does line 1 stop scroll? 0-100
    clarity_3s=90,         # Understood in 3s? 0-100
    novelty=80,            # New angle? 0-100
    emotional_trigger=75,  # Fear/FOMO/relief/pride? 0-100
    format_fit=85          # Right format? 0-100
)
print(f"Overall: {score.overall}/100 → {score.go_rebuild}")
```

Output: Scores for Virality, Save-Worthy, Visual, System Thinking, with GO/REBUILD recommendation

### 3. Export variant to PNG/PDF:

```python
from export_playwright import PlaywrightExporter

exporter = PlaywrightExporter()
result = await exporter.capture_html(
    html="<html>...</html>",
    filename="my-variant"
)
print(f"✓ Saved: {result['png_path']}")
```

Output: PNG at 1080×1350 @ 144dpi, ready to post

---

## Architecture

```
Input: Your Concept
  ↓
batch_generator.py
  ├─ Call Claude API 5 times
  ├─ 5 different layouts (dark hero, light editorial, acrostic, steps, mosaic)
  ├─ Return HTML artifacts
  └─ Score each variant
  ↓
export_playwright.py
  ├─ Playwright captures HTML
  ├─ 2x scale rendering
  └─ PIL downsamples to 1080×1350 @ 144dpi
  ↓
scoring.py
  ├─ 360Brew algorithm
  ├─ 4 dimensions: Virality (25), Save-Worthy (25), Visual (25), System (25)
  └─ GO (70+) or REBUILD (<70)
  ↓
db_sync.py
  ├─ Save variants to Supabase
  ├─ Store scores, HTML, PNG filename
  └─ Enable tracking & analytics
  ↓
Output: /mnt/user-data/outputs/
  ├─ variant-1-1080x1350.png
  ├─ variant-2-1080x1350.png
  ├─ ... 5 variants
  └─ batch-metadata.json
```

---

## Using the Design System (Figma Reference)

All colors use the Anthropic Design System from Figma. Reference via design_system.py:

```python
from design_system import DESIGN_COLORS, DESIGN_RULES

# Access colors
colors = DESIGN_COLORS
# {
#   'orange_light': '#BE4628',      # Light backgrounds
#   'orange_dark': '#C84623',       # Dark backgrounds
#   'orange_warm': '#D26446',       # Carousels
#   'black': '#111111',             # Hero, footer, headers
#   'white_cream': '#F5ECE3',       # Primary background
#   'white_beige': '#EFEBE0',       # Alternative background
#   'white': '#FFFFFF'              # Cards
# }

# Access rules
rules = DESIGN_RULES
# {
#   'font_primary': 'Anthropic Sans',
#   'font_mono': 'JetBrains Mono',
#   'spacing_unit': '8px',
#   'max_border_radius': '4px',
#   'min_subtitle': '15px'
# }

# Validate colors in HTML
violations = validate_colors(html_artifact)
if violations:
    print(f"⚠️  Color violations found: {violations}")
```

**Key Points:**
- All colors are pixel-sampled from Figma
- No gradients, shadows, or forbidden colors (green, blue, purple, yellow, pink)
- Typography: Anthropic Sans (headers) + JetBrains Mono (code)
- Spacing: 8px grid system
- Footer banner required on every artifact
- Max rounded corners: 4px

---

## Scoring Breakdown (360Brew)

### Dimension 1: VIRALITY (25 pts) — Scroll-stop potential

- **ScrollStop** (25%) — Does line 1 stop the scroll?
- **Clarity3s** (20%) — Can someone understand it in 3 seconds?
- **Novelty** (20%) — New angle or just another take?
- **EmotionalTrigger** (20%) — Fear/FOMO/relief/pride?
- **FormatFit** (15%) — Right format for content type?

**Scoring guide:**
- 0-30: Weak, common, no emotional hook
- 30-60: Average, familiar angle
- 60-80: Strong, novel, clear hook
- 80-100: Exceptional, viral potential, immediate clarity

### Dimension 2: SAVE-WORTHY (25 pts) — Algorithm gold

- **UtilityDensity** (25%) — Actionable per cm²?
- **Reusability** (25%) — Will they return to this?
- **Compression** (20%) — Max value, min words?
- **StructureClarity** (15%) — Skimmable without reading all?
- **Actionability** (15%) — Can use today?

**Scoring guide:**
- 0-30: Generic, low reusability, vague advice
- 30-60: Some value, reference material
- 60-80: Practical, referenceable, actionable
- 80-100: High-value, frameworks, templates, checklists

### Dimension 3: VISUAL EFFICIENCY (25 pts) — Design quality

- **HierarchyStrength** (25%) — Eye path obvious?
- **ContrastControl** (20%) — Dark/light alternation works?
- **SpacingBalance** (20%) — Breathing room?
- **Consistency** (20%) — Colors, fonts, spacing systematic?
- **NoiseLevel** (15%) — Nothing competes for attention?

**Scoring guide:**
- 0-30: Cluttered, poor hierarchy, hard to read
- 30-60: Acceptable, some hierarchy
- 60-80: Clean, professional, hierarchy clear
- 80-100: Premium, effortless hierarchy, breathing room

### Dimension 4: SYSTEM THINKING (25 pts) — Authority signal

- **FrameworkClarity** (30%) — Teachable in one image?
- **Modularity** (25%) — Components work independently?
- **Transferability** (25%) — Reader can apply it?
- **DepthVsSimplicity** (20%) — Deep without complex?

**Scoring guide:**
- 0-30: Ad-hoc, no system, hard to apply
- 30-60: Some structure, basic framework
- 60-80: Clear framework, transferable, modular
- 80-100: Elegant framework, deep+simple, teachable

### Overall Score

- **70+**: GO — Build and post
- **60-70**: CAUTION — Consider redesign
- **Below 60**: REBUILD — Redesign needed

---

## Modules Reference

### `batch_generator.py`

Generate 5 design variants in parallel.

```python
from batch_generator import generate_and_save

result = await generate_and_save(
    concept="Your concept",
    num_variants=5,
    save_to_db=True,  # Optional: save to Supabase
    design_direction="dark_hero"  # Optional: force specific layout
)

# Returns:
# {
#   'success': True,
#   'batch_id': 'batch-123abc',
#   'total_variants': 5,
#   'variants': [
#     {
#       'id': 'variant-1',
#       'layout': 'dark_hero',
#       'score_overall': 87,
#       'png_filename': 'variant-1-1080x1350.png'
#     },
#     ...
#   ],
#   'average_score': 84.2,
#   'output_dir': '/mnt/user-data/outputs/'
# }
```

**5 Layout Patterns:**
1. **Dark Hero + Stats** — Bold headline, key metrics below
2. **Light Editorial** — Clean, text-focused, Substack-style
3. **Acrostic Framework** — Vertical list with icons/symbols
4. **Numbered Steps** — How-to format, numbered progression
5. **Asymmetric Mosaic** — Mixed sizes, visual rhythm

### `export_playwright.py`

Export HTML to PNG @ 1080×1350 @ 144dpi.

```python
from export_playwright import PlaywrightExporter

exporter = PlaywrightExporter()
result = await exporter.capture_html(
    html="<html>...</html>",
    filename="artifact",
    format="png"  # or "pdf"
)

# Returns:
# {
#   'success': True,
#   'png_path': '/mnt/user-data/outputs/artifact-1080x1350.png',
#   'file_size_kb': 245,
#   'width': 1080,
#   'height': 1350,
#   'dpi': 144
# }
```

**Features:**
- Captures at 2x scale (2160×2700px)
- Downsamples using LANCZOS (sharp, no aliasing)
- Produces 144dpi output (ready for LinkedIn)
- PDF export also available
- Auto-installs Playwright chromium if needed

### `scoring.py`

Score concepts before building.

```python
from scoring import BrewAlgorithm, format_score_report

brew = BrewAlgorithm()

# Score each dimension
score = brew.full_score(
    # Virality
    scroll_stop=85,          # 0-100
    clarity_3s=90,           # 0-100
    novelty=80,              # 0-100
    emotional_trigger=75,    # 0-100
    format_fit=85,           # 0-100
    
    # Save-Worthy
    utility_density=88,      # 0-100
    reusability=92,          # 0-100
    compression=85,          # 0-100
    structure_clarity=90,    # 0-100
    actionability=88,        # 0-100
    
    # Visual
    hierarchy_strength=85,   # 0-100
    contrast_control=80,     # 0-100
    spacing_balance=82,      # 0-100
    consistency=86,          # 0-100
    noise_level=88,          # 0-100
    
    # System Thinking
    framework_clarity=90,    # 0-100
    modularity=85,           # 0-100
    transferability=88,      # 0-100
    depth_vs_simplicity=86   # 0-100
)

# Print formatted report
print(format_score_report(score))
```

**Output Format:**
```
╔══════════════════════════════════════╗
║   360BREW SCORE REPORT               ║
╠══════════════════════════════════════╣
║ VIRALITY:       87/100 ✓             ║
║ SAVE-WORTHY:    92/100 ✓             ║
║ VISUAL:         85/100 ✓             ║
║ SYSTEM THINK:   88/100 ✓             ║
╠══════════════════════════════════════╣
║ OVERALL:        88/100 → GO ✓        ║
╚══════════════════════════════════════╝

Strengths: Clarity, Utility, Framework
Weak Points: None significant
Recommendation: GO — High virality + utility + authority
```

### `design_system.py`

Colors, rules, patterns, and validators.

```python
from design_system import (
    DESIGN_COLORS,
    DESIGN_RULES,
    DESIGN_PATTERNS,
    validate_colors,
    validate_typography
)

# Access design tokens
colors = DESIGN_COLORS
rules = DESIGN_RULES
patterns = DESIGN_PATTERNS  # 10 layout patterns

# Validate HTML artifact
color_violations = validate_colors(html)
typography_violations = validate_typography(html)

if color_violations:
    print(f"⚠️  Found {len(color_violations)} color violations")
    for v in color_violations:
        print(f"  - {v}")
```

**Color Palette (Figma Reference):**
- `#BE4628` — Orange Light (light backgrounds)
- `#C84623` — Orange Dark (dark backgrounds)
- `#D26446` — Orange Warm (carousels)
- `#111111` — Black (hero, footer, headers)
- `#F5ECE3` — Cream (primary background)
- `#EFEBE0` — Beige (alternative background)
- `#FFFFFF` — White (cards)

**Forbidden:**
- ❌ Gradients
- ❌ Shadows (box-shadow, text-shadow)
- ❌ Green, blue, purple, yellow, pink
- ❌ Emoji
- ❌ Rounded pill borders (max 4px)
- ❌ Lorem ipsum

**Required:**
- ✅ Footer banner on every artifact
- ✅ Section label above title
- ✅ Subtitle min 15px
- ✅ Max 3 ideas per card
- ✅ One dominant element per section

### `db_sync.py`

Save variants to Supabase database.

```python
from db_sync import SupabaseSync

sync = SupabaseSync()

# Save a single variant
variant_id = sync.save_variant(
    concept="Claude vs ChatGPT vs Gemini",
    html_artifact="<html>...</html>",
    png_filename="variant-1-1080x1350.png",
    score_overall=87,
    score_virality=85,
    score_save_worthy=92,
    score_visual=85,
    score_system_thinking=88,
    design_direction="dark_hero"
)
print(f"✓ Saved variant: {variant_id}")

# Get all variants for a concept
variants = sync.get_variants(concept="Claude vs ChatGPT")
for v in variants:
    print(f"{v['concept']} — Score: {v['score_overall']}/100")

# Update variant status
sync.update_variant_status(variant_id, "posted")
```

**Database Schema:**

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
  status VARCHAR DEFAULT 'generated',  -- generated, reviewed, posted
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
  format VARCHAR,  -- png, pdf
  file_path VARCHAR,
  file_size INT,
  exported_at TIMESTAMP DEFAULT now()
);
```

---

## Common Tasks

### Generate content about a topic

```python
import asyncio
from batch_generator import generate_and_save

# Generate 5 variants
result = await generate_and_save(
    concept="5 AI agents every founder should know about",
    num_variants=5,
    save_to_db=True
)

# View results
for variant in result['variants']:
    print(f"✓ {variant['layout']}: {variant['score_overall']}/100")
```

### Pre-score a concept before building

```python
from scoring import BrewAlgorithm, format_score_report

brew = BrewAlgorithm()

# Score your concept idea
score = brew.full_score(
    scroll_stop=88,
    clarity_3s=92,
    novelty=85,
    emotional_trigger=80,
    format_fit=85,
    utility_density=90,
    reusability=95,
    compression=88,
    structure_clarity=92,
    actionability=90,
    hierarchy_strength=88,
    contrast_control=85,
    spacing_balance=85,
    consistency=87,
    noise_level=90,
    framework_clarity=92,
    modularity=88,
    transferability=90,
    depth_vs_simplicity=88
)

print(format_score_report(score))
# If overall > 70, concept is GO → generate variants
# If overall < 70, concept needs REBUILD → brainstorm new angle
```

### Download PNG for a variant

```python
from db_sync import SupabaseSync
import os

sync = SupabaseSync()

# Get variants
variants = sync.get_variants(concept="Claude vs ChatGPT")
best = max(variants, key=lambda x: x['score_overall'])

# File is in /mnt/user-data/outputs/
png_path = f"/mnt/user-data/outputs/{best['png_filename']}"
print(f"✓ Ready to download: {png_path}")
```

### Score a generated variant

```python
from scoring import BrewAlgorithm

brew = BrewAlgorithm()

# After generating HTML artifact, score it
score = brew.full_score(
    # Your scoring inputs here
)

if score.overall >= 70:
    print(f"✓ GO: {score.overall}/100")
else:
    print(f"⚠️  REBUILD: {score.overall}/100")
    print(f"Weak points: {', '.join(score.weak_points)}")
```

---

## Setup Requirements

### Python Dependencies

```bash
pip install anthropic playwright pillow supabase python-dotenv
playwright install chromium
```

### Environment Variables

Add to `.env.local` (never commit):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
ANTHROPIC_API_KEY=sk-...  # Auto-loaded in Claude Code
```

Claude Code reads from `os.environ`, which picks up `.env.local` automatically.

### Supabase Setup

1. Create Supabase project
2. Run SQL schema (see `db_sync.py` section above)
3. Get `SUPABASE_URL` and service role key
4. Add to `.env.local`

---

## Performance

- **Single variant generation**: ~30-45 seconds (Claude API + Playwright)
- **5-variant batch**: ~60-90 seconds (parallel processing)
- **PNG export per variant**: ~8-12 seconds (Playwright capture + PIL downsample)
- **Database sync**: <1 second per variant
- **Total end-to-end**: ~2-3 minutes for 5 variants

---

## Troubleshooting

### "Module not found: batch_generator"
```bash
# Make sure you're in /home/user/linkedin-content-engine/
cd /home/user/linkedin-content-engine/
python scripts/main.py --test
```

### "Playwright not found"
```bash
playwright install chromium
```

### "Supabase connection failed"
- Check `SUPABASE_URL` and `SUPABASE_KEY` in `.env.local`
- Verify Supabase project is active
- Test connection: `python scripts/db_sync.py`

### "PNG export is blurry"
- Playwright exporter uses 2x scale + LANCZOS downsampling
- Should be sharp at 144dpi
- Check system fonts match reference

### "Colors don't match design system"
- All colors are pixel-sampled from Figma
- Verify hex codes in `design_system.py`
- Check sRGB color profile on your device

---

## Next Steps

1. **Setup environment** — Add `.env.local` with Supabase keys
2. **Create Supabase tables** — Use schema from `db_sync.py`
3. **Generate first batch** — `await generate_and_save("Your concept")`
4. **Review scores** — Check all 5 variants
5. **Download PNGs** — Export to `/mnt/user-data/outputs/`
6. **Post on LinkedIn** — Track reach in database

---

## Integration with Vercel Dashboard

Your dashboard should:

1. **Fetch variants** from Supabase `variants` table
2. **Display previews** of PNG files from `/mnt/user-data/outputs/`
3. **Show scores** (overall, virality, save-worthy, visual, system thinking)
4. **Copy buttons** for post copy + first comment
5. **Download buttons** for PNG/PDF exports
6. **Post tracking** — save linkedin_post_id, reach, engagement
7. **Analytics** — show average score, posting frequency, reach trends

---

**Ready? Start generating:**

```python
import asyncio
from batch_generator import generate_and_save

# Generate 5 variants of your concept
result = await generate_and_save(
    concept="Your topic here",
    num_variants=5,
    save_to_db=True
)

print(f"✓ Generated {result['total_variants']} variants")
print(f"Average score: {result['average_score']}/100")
```
