# LinkedIn Content Creator Skill — Quick Reference

## 30-Second Overview

Generate 5 LinkedIn infographic variants (1080×1350px), auto-score them (360Brew algorithm), export as PNG @ 144dpi, save to Supabase.

**Time to output:** ~2-3 minutes per concept

---

## Command: Generate 5 Variants

```python
import asyncio
from batch_generator import generate_and_save

result = await generate_and_save(
    concept="Your idea here",
    num_variants=5,
    save_to_db=True
)
```

**Output:**
- 5 PNG files in `/mnt/user-data/outputs/`
- Scores for each variant (Virality, Save-Worthy, Visual, System Thinking)
- Metadata in Supabase `variants` table

---

## Command: Score Concept First

```python
from scoring import BrewAlgorithm

brew = BrewAlgorithm()
score = brew.full_score(
    scroll_stop=85, clarity_3s=90, novelty=80, 
    emotional_trigger=75, format_fit=85,
    utility_density=88, reusability=92, compression=85,
    structure_clarity=90, actionability=88,
    hierarchy_strength=85, contrast_control=80, spacing_balance=82,
    consistency=86, noise_level=88,
    framework_clarity=90, modularity=85, transferability=88,
    depth_vs_simplicity=86
)

print(f"{score.overall}/100 → {score.go_rebuild}")
# 70+: GO (generate variants)
# <70: REBUILD (new concept)
```

---

## Command: Export Variant to PNG

```python
from export_playwright import PlaywrightExporter

exporter = PlaywrightExporter()
result = await exporter.capture_html(
    html="<html>...</html>",
    filename="my-variant"
)
```

**Output:** PNG @ 1080×1350 @ 144dpi, ready to post

---

## Command: Get Variants from Database

```python
from db_sync import SupabaseSync

sync = SupabaseSync()

# All variants for a concept
variants = sync.get_variants(concept="Claude vs ChatGPT")

# Find best
best = max(variants, key=lambda x: x['score_overall'])
print(f"Best: {best['design_direction']} ({best['score_overall']}/100)")
```

---

## Design Colors (Anthropic System)

| Color | Hex | Use |
|-------|-----|-----|
| Orange Light | `#BE4628` | Light backgrounds |
| Orange Dark | `#C84623` | Dark backgrounds |
| Orange Warm | `#D26446` | Accents, carousels |
| Black | `#111111` | Hero, headers, footer |
| Cream | `#F5ECE3` | Primary background |
| Beige | `#EFEBE0` | Alt background |
| White | `#FFFFFF` | Cards |

**Forbidden:** Gradients, shadows, emoji, green/blue/purple/yellow/pink, Lorem ipsum, pill borders

---

## 360Brew Scoring (4 Dimensions, 25pts each)

| Dimension | What It Measures | Example Signal |
|-----------|------------------|-----------------|
| **VIRALITY** | Scroll-stop, clarity, novelty | Strong headline stops scroll? |
| **SAVE-WORTHY** | Actionable, reusable, useful | Will they bookmark this? |
| **VISUAL** | Hierarchy, contrast, spacing | Can you scan in 3 seconds? |
| **SYSTEM THINKING** | Framework, modularity, depth | Can they teach this concept? |

**Score Guide:**
- 70+: **GO** — Build and post
- 60-70: **CAUTION** — Consider redesign
- <60: **REBUILD** — New concept needed

---

## 5 Layout Variants

1. **Dark Hero + Stats** — Bold headline, metrics below
2. **Light Editorial** — Clean, text-focused, Substack-style
3. **Acrostic Framework** — Vertical list, icons/symbols
4. **Numbered Steps** — How-to, numbered progression
5. **Asymmetric Mosaic** — Mixed sizes, visual rhythm

---

## Workflow

```
You: "Generate variants about X"
    ↓
Claude Code:
  • Calls Claude API 5 times
  • Generates 5 HTML artifacts (different layouts)
  • Exports each to PNG @ 1080×1350 @ 144dpi
  • Scores each variant (360Brew)
  • Saves to Supabase
    ↓
Output:
  • 5 PNGs in /mnt/user-data/outputs/
  • Scores (Virality, Save-Worthy, Visual, System)
  • Metadata in Supabase
    ↓
You: Download PNG, post on LinkedIn, track reach
```

---

## Setup Checklist

- [ ] Supabase account created
- [ ] Supabase tables created (SQL schema)
- [ ] `.env.local` with SUPABASE_URL and SUPABASE_KEY
- [ ] Python dependencies installed (`pip install -r scripts/requirements.txt`)
- [ ] Playwright installed (`playwright install chromium`)
- [ ] Test connection (`python scripts/db_sync.py` → "✓ Connected")
- [ ] Test skill (`await generate_and_save("Test", num_variants=1)`)

---

## File Locations

**Skill Files:**
```
.claude/CLAUDE.md
.claude/skills/linkedin-content-creator/
  ├── SKILL.md (full documentation)
  ├── INSTALL.md (installation guide)
  └── QUICK_REFERENCE.md (this file)
```

**Python Modules:**
```
/scripts/
  ├── batch_generator.py
  ├── export_playwright.py
  ├── scoring.py
  ├── design_system.py
  ├── db_sync.py
  └── main.py
```

---

## Common Tasks

| Task | Code |
|------|------|
| Generate 5 variants | `await generate_and_save("concept", 5, save_to_db=True)` |
| Score concept | `brew.full_score(scroll_stop=85, clarity_3s=90, ...)` |
| Export to PNG | `await exporter.capture_html(html, filename)` |
| Get variants | `sync.get_variants(concept="X")` |
| Find best variant | `max(variants, key=lambda x: x['score_overall'])` |
| Update status | `sync.update_variant_status(variant_id, "posted")` |
| Validate colors | `validate_colors(html)` |

---

## Performance

| Operation | Time |
|-----------|------|
| Single variant | 30-45 sec |
| 5-variant batch | 60-90 sec |
| PNG export per variant | 8-12 sec |
| Database sync | <1 sec |
| **Total (5 variants)** | **~2-3 min** |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "ModuleNotFoundError" | `cd scripts && python main.py --test` |
| "Playwright not found" | `playwright install chromium` |
| "Supabase failed" | Check `.env.local` keys |
| "PNG blurry" | Uses 2x scale + LANCZOS, should be sharp |
| "Colors wrong" | Verify hex codes in `design_system.py` |

---

## Next Steps

1. Create Supabase project
2. Run SQL schema (see INSTALL.md)
3. Add `.env.local` keys
4. Run: `python scripts/db_sync.py` (test connection)
5. Run: `await generate_and_save("Test concept", 1)`
6. Download PNG from `/mnt/user-data/outputs/`
7. Post on LinkedIn + track reach

---

**Full documentation:** `.claude/skills/linkedin-content-creator/SKILL.md`
