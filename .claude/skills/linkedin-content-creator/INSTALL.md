# Installation Guide: LinkedIn Content Creator Skill

## Quick Start (5 Minutes)

This skill is already installed in Claude Code! It's located at:
```
.claude/skills/linkedin-content-creator/SKILL.md
```

### Step 1: Verify Installation

The skill is automatically available. Test it:

```python
import sys
sys.path.insert(0, '/home/user/linkedin-content-engine/scripts')

from batch_generator import generate_and_save
print("✓ Skill installed correctly")
```

### Step 2: Setup Environment

Create `.env.local` in the project root:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
```

(ANTHROPIC_API_KEY is auto-loaded in Claude Code)

### Step 3: Create Supabase Tables

In your Supabase project, run this SQL:

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

### Step 4: Test Connection

```bash
cd /home/user/linkedin-content-engine
python scripts/db_sync.py
```

You should see "✓ Connection successful"

### Step 5: Generate First Batch

In Claude Code:

```python
import asyncio
from batch_generator import generate_and_save

result = await generate_and_save(
    concept="Claude vs ChatGPT for founders",
    num_variants=5,
    save_to_db=True
)

print(f"✓ Generated {result['total_variants']} variants")
print(f"Average score: {result['average_score']}/100")
```

**That's it!** Your skill is ready.

---

## What You Get

✅ **5 Design Variants** — Different layouts (dark hero, light editorial, acrostic, steps, mosaic)  
✅ **Automatic Scoring** — 360Brew algorithm (Virality, Save-Worthy, Visual, System)  
✅ **PNG Export** — 1080×1350px @ 144dpi, ready to post  
✅ **Database Tracking** — Supabase integration for variant history  
✅ **Design System** — Anthropic brand colors & rules  
✅ **Post Copy** — Suggested post copy + first comment  

---

## How It Works

**In Chat:**
```
"Generate 5 variants about AI agents for founders"
```

**Claude Code runs:**
1. Calls Claude API 5 times (different prompts)
2. Generates 5 HTML artifacts
3. Exports each to PNG @ 1080×1350 @ 144dpi
4. Scores each variant (360Brew)
5. Saves to Supabase
6. Returns metadata

**Output:**
```
✓ Variant 1: Dark Hero (Score: 87/100) → variant-1-1080x1350.png
✓ Variant 2: Light Editorial (Score: 84/100) → variant-2-1080x1350.png
✓ Variant 3: Acrostic Framework (Score: 82/100) → variant-3-1080x1350.png
✓ Variant 4: Numbered Steps (Score: 79/100) → variant-4-1080x1350.png
✓ Variant 5: Mosaic (Score: 81/100) → variant-5-1080x1350.png

Average: 82.6/100
Output: /mnt/user-data/outputs/
```

---

## Design System (from Figma)

All colors and rules use the Anthropic Design System:

**7 Core Colors:**
- `#BE4628` — Orange Light
- `#C84623` — Orange Dark  
- `#D26446` — Orange Warm
- `#111111` — Black
- `#F5ECE3` — Cream
- `#EFEBE0` — Beige
- `#FFFFFF` — White

**Rules:**
- ✅ Footer banner on every artifact
- ✅ Section labels, min 15px subtitles
- ❌ NO gradients, shadows, emoji, forbidden colors
- ❌ NO pill borders (max 4px), Lorem ipsum

---

## Common Tasks

### Score a concept before building

```python
from scoring import BrewAlgorithm

brew = BrewAlgorithm()
score = brew.full_score(
    scroll_stop=85,          # Line 1 stops scroll?
    clarity_3s=90,           # Understood in 3s?
    novelty=80,              # New angle?
    emotional_trigger=75,    # Emotional hook?
    format_fit=85,           # Right format?
    utility_density=88,
    reusability=92,
    compression=85,
    structure_clarity=90,
    actionability=88,
    hierarchy_strength=85,
    contrast_control=80,
    spacing_balance=82,
    consistency=86,
    noise_level=88,
    framework_clarity=90,
    modularity=85,
    transferability=88,
    depth_vs_simplicity=86
)

print(f"Overall: {score.overall}/100 → {score.go_rebuild}")
# If 70+: GO (build it)
# If <70: REBUILD (redesign concept)
```

### Get all variants for a concept

```python
from db_sync import SupabaseSync

sync = SupabaseSync()
variants = sync.get_variants(concept="Claude vs ChatGPT")

for v in variants:
    print(f"{v['design_direction']}: {v['score_overall']}/100")
```

### Download best variant

```python
variants = sync.get_variants(concept="Your topic")
best = max(variants, key=lambda x: x['score_overall'])
print(f"Best variant: {best['png_filename']}")
# File is in: /mnt/user-data/outputs/{filename}
```

---

## Troubleshooting

### "ModuleNotFoundError: No module named 'batch_generator'"

**Solution:**
```bash
cd /home/user/linkedin-content-engine
python scripts/main.py --test
```

This verifies all imports are working.

### "playwright: command not found"

**Solution:**
```bash
pip install playwright
playwright install chromium
```

### "Supabase connection failed"

**Check:**
1. `.env.local` has `SUPABASE_URL` and `SUPABASE_KEY`
2. Supabase project is active
3. Tables are created (run SQL schema above)

**Test:**
```bash
python scripts/db_sync.py
```

### "PNG export is blurry"

**Expected:** Uses 2x scale + LANCZOS downsampling. Should be sharp at 144dpi.

**If still blurry:**
- Check system fonts match reference
- Verify sRGB color profile
- Test with `exporter.capture_html()` directly

### "Colors don't match design system"

**Check:**
1. Hex codes match `design_system.py`
2. Compare against Figma reference
3. Verify sRGB color profile on your device

---

## Performance

- **Single variant:** ~30-45 seconds (Claude API + Playwright)
- **5-variant batch:** ~60-90 seconds (parallel)
- **PNG export per variant:** ~8-12 seconds
- **Database sync:** <1 second per variant
- **Total:** ~2-3 minutes for complete batch

---

## Next Steps

1. ✅ **Install** — Already done!
2. ✅ **Setup Supabase** — Run SQL schema
3. ✅ **Add .env.local** — Add keys
4. ⏭️  **Test connection** — `python scripts/db_sync.py`
5. ⏭️  **Generate first batch** — `await generate_and_save("Your concept")`
6. ⏭️  **Download PNGs** — From `/mnt/user-data/outputs/`
7. ⏭️  **Post on LinkedIn** — Track reach in database

---

## Files

**Skill Files:**
- `.claude/CLAUDE.md` — Main configuration
- `.claude/skills/linkedin-content-creator/SKILL.md` — Full skill documentation
- `.claude/skills/linkedin-content-creator/INSTALL.md` — This file

**Python Modules (in `/scripts/`):**
- `batch_generator.py` — Generate 5 variants
- `export_playwright.py` — PNG/PDF export
- `scoring.py` — 360Brew algorithm
- `design_system.py` — Colors, rules, validators
- `db_sync.py` — Supabase integration
- `main.py` — Entry point, tests

---

**Questions?** Check the full skill documentation:
```
.claude/skills/linkedin-content-creator/SKILL.md
```
