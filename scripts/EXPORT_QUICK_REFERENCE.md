# EXPORT WORKFLOW QUICK REFERENCE

## Two Approaches

### 1. SERVER-SIDE (Python / Playwright) ⭐ Recommended for pipelines

```bash
# Install (one-time)
pip install playwright pillow && playwright install chromium

# Use
python export_playwright.py --html artifact.html --output artifact.png

# Result: 1080x1350px PNG, 2x retina, 144dpi, export-bar hidden
```

**Best for:**
- Automated CI/CD pipelines
- Batch processing multiple artifacts
- Consistent output every time
- No browser dependency
- High-quality LANCZOS downsampling

---

### 2. BROWSER-BASED (JavaScript) ⭐ Best for interactive use

```html
<!-- Add to artifact HTML -->
<div id="artifact">Your content here</div>

<!-- Before </body> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="export-bar.js"></script>
```

**User clicks:**
- **Download PNG** → 1080x1350px, 2x scale
- **Download PDF** → Same dimensions, full-page PDF

**Best for:**
- Manual downloads in Claude.ai
- Quick exports during session
- Users control timing
- Real-time preview before export

---

## SPECIFICATIONS (Both Methods)

| Property | Value |
|----------|-------|
| **Dimensions** | 1080 x 1350px (LinkedIn portrait) |
| **Capture Scale** | 2x device (retina quality) |
| **Downsampling** | LANCZOS (Playwright) / Canvas (Browser) |
| **DPI** | 144 (web standard) |
| **Format** | PNG or PDF |
| **Export Bar** | Hidden in PNG, included in PDF |

---

## FILES YOU NEED

```
export_playwright.py       Python script for server-side capture
export-bar.js             JavaScript module for browser export
EXPORT_IMPLEMENTATION_GUIDE.md    Full documentation
```

---

## TYPICAL WORKFLOW

### For Production (Vercel/CI)

```
1. Generate HTML artifact
2. Run: python export_playwright.py --html artifact.html --output artifact.png
3. PNG appears in output directory
4. Upload to CDN / commit to Git
```

### For Development (Claude.ai)

```
1. Click "Download PNG" or "Download PDF"
2. Browser saves file
3. Test locally
4. Share / iterate
```

---

## COMMON ISSUES & FIXES

**"playwright not found"**
→ `pip install playwright && playwright install chromium`

**PNG is blurry**
→ Already set to 2x scale (retina), check browser zoom at 100%

**Export bar still visible in PNG**
→ Use `--keep-export-bar` flag if you want it, default is hidden

**PDF is blank/empty**
→ Ensure content is in `<div id="artifact">` and visible

**Slow capture**
→ Use `--timeout 60` for slower connections

---

## CLI COMMAND REFERENCE

```bash
# Standard (recommended)
python export_playwright.py --html in.html --output out.png

# Include export bar (for debugging)
python export_playwright.py --html in.html --output out.png --keep-export-bar

# Custom dimensions
python export_playwright.py --html in.html --output out.png --width 1080 --height 1350

# Longer timeout
python export_playwright.py --html in.html --output out.png --timeout 60
```

---

## INTEGRATION WITH CLAUDE CODE

Add to `.claude/CLAUDE.md`:

```markdown
## Export Commands

### PNG (Playwright)
python export_playwright.py --html <artifact> --output <output>

### Browser
Include export-bar.js in HTML artifact before </body>
```

Or create a Bash skill:

```markdown
## Skills/.claude/skills/export-linkedin/SKILL.md

---
name: export-linkedin
description: Capture LinkedIn artifacts to PNG/PDF
---

Use Playwright for high-quality PNG:
```bash
python export_playwright.py --html artifact.html --output artifact.png
```
```

---

## ADVANCED: CAROUSEL EXPORT

For multi-slide content:

```bash
# Python: Still works with standard command
python export_playwright.py --html carousel.html --output carousel.png

# Browser: Configure for carousel
window.EXPORT_CONFIG = {
  format: 'carousel',
  slideSelector: '.slide'  // One PDF page per slide
};
```

---

## QUALITY CHECKLIST

✓ 1080x1350px exact  
✓ 2x retina capture  
✓ LANCZOS downsampling  
✓ 144dpi metadata  
✓ No export bar visible  
✓ LinkedIn compliant  
✓ Ready to post  

---

**TL;DR:** Use Playwright for pipelines, use export-bar.js for manual downloads. Both produce identical 1080x1350px images ready for LinkedIn.
