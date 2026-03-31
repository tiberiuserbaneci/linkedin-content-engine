# Ultron LinkedIn Content Engine - Setup Guide

Complete Python pipeline for generating, scoring, and exporting LinkedIn infographics at retina quality (1080×1350px @ 144dpi).

## Architecture

```
Input (Concept in chat)
    ↓
Claude Code (Python)
    ├─ Batch Generator (5 variants via Claude API)
    ├─ Playwright Exporter (PNG capture @ 2x scale)
    ├─ PIL Downsampler (1080×1350 @ 144dpi)
    ├─ 360Brew Scorer (virality, save-worthy, visual, system thinking)
    └─ Supabase Sync (save to database)
    ↓
Output (/mnt/user-data/outputs/)
    ├─ variant-1-1080x1350.png
    ├─ variant-2-1080x1350.png
    ├─ ... 5 variants total
    └─ batch-metadata.json
    ↓
Your Dashboard (Vercel)
    └─ Preview, download, post
```

## Installation

### 1. Python Dependencies

```bash
cd /home/claude/scripts
pip install -r requirements.txt --break-system-packages
```

Or manually:
```bash
pip install anthropic playwright pillow supabase python-dotenv --break-system-packages
```

### 2. Playwright Browser

```bash
playwright install chromium
```

(Happens automatically on first export if not installed)

### 3. Environment Variables

Add to your `.env.local` (in your Git repo, not in Claude Code):

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
ANTHROPIC_API_KEY=sk-...  # Auto-loaded in Claude Code
```

Claude Code reads from `os.environ`, which picks up `.env.local` automatically.

## File Structure

```
/home/claude/scripts/
├── main.py                 # Entry point, tests, CLI
├── batch_generator.py      # Generate 5 variants in parallel
├── export_playwright.py    # Playwright + PIL export pipeline
├── scoring.py              # 360Brew algorithm (virality, save-worthy, etc.)
├── design_system.py        # Colors, typography, rules, validators
├── db_sync.py              # Supabase integration
└── requirements.txt        # Python dependencies
```

## Usage

### Option 1: From Claude Chat (recommended)

In Claude Code (embedded in chat):

```python
import asyncio
from batch_generator import generate_and_save

# Generate 5 variants
result = await generate_and_save(
    concept="Claude vs ChatGPT vs Gemini for founders",
    num_variants=5,
    save_to_db=True
)
```

Output: 5 PNGs in `/mnt/user-data/outputs/`, metadata in Supabase.

### Option 2: Command Line

```bash
cd /home/claude/scripts

# Run tests
python main.py

# Generate variants
python main.py --generate "Your concept here"

# Show help
python main.py --help
```

## Modules

### `design_system.py`
- **Colors**: 13 brand colors (orange, black, warm whites, grays)
- **Rules**: Typography, spacing, borders, forbidden styles
- **Patterns**: 10 layout patterns (hero_grid, timeline, comparison, etc.)
- **Templates**: 3 master templates (light editorial, dark hero+body, structured mixed)
- **Validators**: Check colors, fonts, forbidden CSS patterns

```python
from design_system import DESIGN_COLORS, validate_colors

colors = DESIGN_COLORS  # Dict of all brand colors
violations = validate_colors(html)  # Check for forbidden colors
```

### `export_playwright.py`
- **PlaywrightExporter**: Capture HTML → PNG at 1080×1350 @ 144dpi
- **PDFExporter**: Capture HTML → PDF
- **Batch export**: Multiple variants in parallel

```python
from export_playwright import PlaywrightExporter
import asyncio

exporter = PlaywrightExporter()
result = await exporter.capture_html(html, filename="artifact")
# Returns: {'success': True, 'png_path': '...', 'file_size_kb': 123}
```

### `scoring.py`
- **360Brew Algorithm**: Score concepts before building
- **4 dimensions**: Virality (25), Save-Worthy (25), Visual (25), System (25)
- **Scoring breakdown**: 5 signals per dimension
- **Recommendations**: GO (70+) or REBUILD (below 70)

```python
from scoring import BrewAlgorithm, format_score_report

brew = BrewAlgorithm()
result = brew.full_score(
    scroll_stop=85, clarity_3s=90, novelty=80, ...
)
print(format_score_report(result))
```

### `batch_generator.py`
- **VariantGenerator**: Create 5 design variants via Claude API
- **5 layouts**: Dark hero, light editorial, acrostic, steps, mosaic
- **Parallel generation**: All 5 variants at once
- **Scoring**: Auto-score each variant

```python
from batch_generator import generate_and_save

result = await generate_and_save(
    concept="Your concept",
    num_variants=5,
    save_to_db=True
)
```

### `db_sync.py`
- **SupabaseSync**: Save variants, posts, exports to database
- **BatchSync**: Batch operations on multiple variants
- **CRUD**: Read, write, update variant metadata

```python
from db_sync import SupabaseSync

sync = SupabaseSync()
variant_id = sync.save_variant(
    concept="...",
    html_artifact="...",
    png_filename="...",
    score_overall=85
)
```

## Design System Rules

### Colors (use ONLY these)

- `#BE4628` — Claude orange (light backgrounds)
- `#C84623` — Ultron orange (dark backgrounds)
- `#D26446` — Warm orange (carousels)
- `#111111` — Black (hero, footer, headers)
- `#F5ECE3` — Warm cream (primary background)
- `#EFEBE0` — Warm beige (alternative background)
- `#FFFFFF` — Pure white (cards)

### Forbidden

- ❌ Gradients
- ❌ Shadows (box-shadow, text-shadow)
- ❌ Green, blue, purple, yellow, pink
- ❌ Emoji
- ❌ Rounded pill borders (max 4px)
- ❌ Lorem ipsum

### Required

- ✅ Footer banner on every artifact
- ✅ Section label above title
- ✅ Subtitle min 15px
- ✅ Max 3 ideas per card
- ✅ One dominant element per section
- ✅ Real typography: • → — … ✓ ✗

## 360Brew Scoring

### Virality (scroll-stop potential)
- **ScrollStop** (25%) — Does line 1 stop the scroll?
- **Clarity3s** (20%) — Understood in 3 seconds?
- **Novelty** (20%) — New angle or rehashed?
- **EmotionalTrigger** (20%) — Fear/FOMO/relief/pride?
- **FormatFit** (15%) — Right format for content?

### Save-Worthy (algorithm gold)
- **UtilityDensity** (25%) — Actionable per cm²?
- **Reusability** (25%) — Will return to this?
- **Compression** (20%) — Max value, min words?
- **StructureClarity** (15%) — Skimmable?
- **Actionability** (15%) — Can use today?

### Visual Efficiency
- **HierarchyStrength** (25%) — Eye path obvious?
- **ContrastControl** (20%) — Dark/light works?
- **SpacingBalance** (20%) — Breathing room?
- **Consistency** (20%) — Colors, fonts systematic?
- **NoiseLevel** (15%) — Clean, uncluttered?

### System Thinking (authority)
- **FrameworkClarity** (30%) — Teachable in one image?
- **Modularity** (25%) — Components independent?
- **Transferability** (25%) — Applicable?
- **DepthVsSimplicity** (20%) — Deep but simple?

**Overall** = Average of 4 dimensions
- **GO**: 70+ (build)
- **REBUILD**: below 70 (redesign)

## Database Schema

Your Supabase should have these tables:

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
  variant_id UUID REFERENCES variants(id),
  post_copy TEXT,
  first_comment TEXT,
  linkedin_post_id VARCHAR,
  posted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- exports table
CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES variants(id),
  format VARCHAR,
  file_path VARCHAR,
  file_size INT,
  exported_at TIMESTAMP DEFAULT now()
);
```

## Example Workflow

### In Claude Chat

```
"Generate 5 variants of: 'Comparison: Claude vs ChatGPT vs Gemini for founders'"

[Claude Code runs]
- Generates 5 HTML artifacts (different layouts)
- Exports each to PNG @ 1080×1350 @ 144dpi
- Scores each variant (360Brew)
- Saves all 5 to Supabase
- Returns: batch result with variant IDs, scores, file paths

Output:
✓ Variant 1: Dark Hero + Stats (Score: 87/100) → variant-1-1080x1350.png
✓ Variant 2: Light Editorial (Score: 84/100) → variant-2-1080x1350.png
✓ Variant 3: Acrostic Framework (Score: 82/100) → variant-3-1080x1350.png
✓ Variant 4: Numbered Steps (Score: 79/100) → variant-4-1080x1350.png
✓ Variant 5: Asymmetric Mosaic (Score: 81/100) → variant-5-1080x1350.png

Batch saved: 5/5 variants to database
Average score: 82.6/100
```

### On Vercel Dashboard

```
- View all 5 variants with scores
- Click "Download PNG" → variant-1-1080x1350.png
- Click "Preview" → live HTML preview
- Copy post copy + first comment
- Post on LinkedIn
- Mark as "Posted"
```

### Database Tracking

```
variants table:
├─ variant-1: concept, html, score, png_filename, status
├─ variant-2: ...
└─ variant-5: ...

posts table:
└─ post for variant-1: post_copy, first_comment, linkedin_post_id

exports table:
├─ export for variant-1 (PNG)
├─ export for variant-2 (PNG)
└─ ...
```

## Troubleshooting

### "Playwright not found"
```bash
playwright install chromium
```

### "Supabase connection failed"
- Check `SUPABASE_URL` and `SUPABASE_KEY` in `.env.local`
- Confirm Supabase project is active
- Check network (Claude Code sandbox can access internet)

### "PNG export is blurry"
- Playwright exporter uses 2x scale + LANCZOS downsampling
- Should be sharp at 144dpi
- If not, check OS font rendering (system fonts may vary)

### "Colors don't match design reference"
- All colors pixel-sampled from production materials
- Verify hex codes against `design_system.py`
- Check if your device's color profile matches sRGB

## Performance

- **Single variant generation**: ~30-45 seconds (Claude API + Playwright)
- **5-variant batch**: ~60-90 seconds (parallel processing)
- **PNG export per variant**: ~8-12 seconds (Playwright capture + PIL downsample)
- **Database sync**: <1 second per variant
- **Total end-to-end**: ~2-3 minutes for 5 variants, start to finish

## Next Steps

1. **Setup Supabase tables** (use schema above)
2. **Add environment variables** to `.env.local`
3. **Test connection**: `python db_sync.py`
4. **Generate first batch**: `python main.py --generate "Your concept"`
5. **Download PNGs** from `/mnt/user-data/outputs/`
6. **Post on LinkedIn** and track reach in database

## Integration with Vercel App

Your Vercel dashboard should:

1. **Fetch variants** from Supabase `variants` table
2. **Display previews** of PNG files
3. **Show scores** (overall, virality, save-worthy, visual, system)
4. **Copy buttons** for post copy + first comment
5. **Download buttons** for PNG/PDF exports
6. **Post tracking** — save linkedin_post_id, reach, engagement
7. **Analytics** — show average score, posting frequency, reach trends

---

**Ready to generate?**

In Claude Code or chat:
```python
import asyncio
from batch_generator import generate_and_save

result = await generate_and_save("Your concept", num_variants=5, save_to_db=True)
```

Or command line:
```bash
python main.py --generate "Your concept"
```
