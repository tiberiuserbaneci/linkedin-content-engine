# EXPORT WORKFLOW - COMPLETE PACKAGE FOR ULTRON

**All files ready to give to Claude Code. Copy directly to your project.**

---

## FILES INCLUDED

### 1. **export_playwright.py** (7.9 KB)
**Purpose:** Server-side PNG export using Playwright + PIL  
**Use:** Automated pipelines, CI/CD, batch processing  
**Command:** `python export_playwright.py --html in.html --output out.png`  
**Output:** 1080x1350px PNG, 2x retina, 144dpi, export-bar hidden

**Why this?**
- Headless browser (no window needed)
- Consistent results every time
- High-quality LANCZOS downsampling
- Perfect for Vercel/GitHub Actions
- Fast (~5 seconds per artifact)

---

### 2. **export-bar.js** (8.0 KB)
**Purpose:** Browser-based PNG/PDF export module  
**Use:** Interactive downloads in Claude.ai or any HTML page  
**Setup:** Include before `</body>` in your artifact  
**Output:** PNG or PDF, both 1080x1350px, 2x scale

**How it works:**
- Floats at bottom of page
- User clicks PNG/PDF button
- html2canvas captures → download
- jsPDF generates PDF → download
- Works in any modern browser

---

### 3. **EXPORT_IMPLEMENTATION_GUIDE.md** (9.3 KB)
**Purpose:** Complete technical documentation  
**Contains:**
- Installation instructions (pip, playwright)
- Usage examples (Python CLI)
- Integration with Claude Code
- Carousel multi-slide support
- Troubleshooting guide
- All technical details

**Read this if:** You need to understand how it all works.

---

### 4. **EXPORT_QUICK_REFERENCE.md** (4.2 KB)
**Purpose:** One-page cheat sheet  
**Contains:**
- Two-approach comparison
- Specifications table
- CLI command reference
- Common fixes
- TL;DR summary

**Read this if:** You just need the quick version.

---

### 5. **EXPORT_CLAUDE_MD.txt** (2.1 KB)
**Purpose:** Drop-in snippet for your `.claude/CLAUDE.md`  
**Contains:**
- Copy-paste workflow section
- Why Playwright is recommended
- Common commands
- LinkedIn standards
- Next steps

**Use this:** Paste directly into your CLAUDE.md file.

---

### 6. **EXPORT_EXAMPLE.html** (7.3 KB)
**Purpose:** Minimal working example  
**Contains:**
- Complete HTML artifact structure
- Both export methods (Python + Browser)
- Styled example with boxes
- CDN links included
- Ready to test

**Use this:** Copy as template for your artifacts.

---

## QUICK START (3 STEPS)

### Step 1: Install (Python only, one-time)
```bash
pip install playwright pillow
playwright install chromium
```

### Step 2: Copy files to project
```bash
cp export_playwright.py export-bar.js /path/to/your/project/
```

### Step 3: Use in your workflow

**For server-side (Vercel/CI):**
```bash
python export_playwright.py --html artifact.html --output artifact.png
```

**For browser (Claude.ai):**
Add to HTML before `</body>`:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="export-bar.js"></script>
```

Done. Export buttons appear at bottom.

---

## USE CASES

### Use `export_playwright.py` if:
✓ Building CI/CD pipeline (GitHub Actions, Vercel)  
✓ Batch processing multiple artifacts  
✓ Need consistent results every time  
✓ Automated content generation  
✓ Server-side rendering  

### Use `export-bar.js` if:
✓ Interactive manual downloads  
✓ Testing in Claude.ai directly  
✓ User controls export timing  
✓ Browser-based workflow  
✓ Need both PNG and PDF downloads  

### Use both if:
✓ Development (test locally with export-bar.js)  
✓ Production (automate with export_playwright.py)  
✓ Maximum flexibility  

---

## INTEGRATION WITH CLAUDE CODE

Add to `.claude/CLAUDE.md`:

```markdown
## Export Workflow

### Server-Side PNG
```bash
pip install playwright pillow && playwright install chromium
python export_playwright.py --html artifact.html --output artifact.png
```

### Browser Export
1. Include export-bar.js in HTML
2. Click PNG/PDF buttons at bottom
3. File downloads to device

### Standards
- Dimensions: 1080x1350px (LinkedIn)
- Quality: 2x retina capture
- DPI: 144 (web standard)
- Format: PNG or PDF
```

Or add as a skill:

```markdown
## .claude/skills/export-linkedin/SKILL.md

---
name: export-linkedin
description: Export LinkedIn artifacts to PNG/PDF
allowed_tools: Bash, Read, Write
---

# Export LinkedIn Content

Server-side PNG (Playwright):
```bash
python export_playwright.py --html artifact.html --output artifact.png
```

Browser PNG/PDF (HTML2Canvas + jsPDF):
Include export-bar.js before </body>
```

---

## SPECIFICATIONS (All Methods)

| Spec | Value |
|------|-------|
| Dimensions | 1080 x 1350px (LinkedIn portrait standard) |
| Capture Scale | 2x (1080×1350 → 2160×2700 → 1080×1350) |
| Downsampling | LANCZOS (Playwright) / Canvas (Browser) |
| DPI | 144 (web standard) |
| Format | PNG or PDF |
| Export Bar | Hidden in PNG / Included in PDF |
| Quality | Retina-ready, LinkedIn compliant |

---

## COMMAND REFERENCE

```bash
# Server-side (Python)
python export_playwright.py --html in.html --output out.png

# With export bar visible (debug)
python export_playwright.py --html in.html --output out.png --keep-export-bar

# Custom timeout
python export_playwright.py --html in.html --output out.png --timeout 60

# Custom dimensions
python export_playwright.py --html in.html --output out.png --width 1080 --height 1350
```

```javascript
// Browser (JavaScript)
injectExportBar({
  target: document.getElementById('artifact'),
  filename: 'my-post',
  format: 'single'  // or 'carousel'
});

// User clicks buttons, downloads automatically
```

---

## TROUBLESHOOTING

**"playwright not found"**  
→ `pip install playwright && playwright install chromium`

**PNG is blurry**  
→ Already 2x scale. Check browser zoom is 100%.

**Export bar visible in PNG**  
→ Expected. Use `--keep-export-bar` if you want it.

**PDF is blank**  
→ Ensure content in `<div id="artifact">` and visible before export.

**HTML2Canvas failing CORS**  
→ Use `useCORS: true` (already set in export-bar.js).

---

## NEXT STEPS

1. ✓ Read **EXPORT_QUICK_REFERENCE.md** (2 min)
2. ✓ Copy `export_playwright.py` and `export-bar.js` to project
3. ✓ Test with **EXPORT_EXAMPLE.html** (open in browser)
4. ✓ Integrate into your workflow
5. ✓ Add to `.claude/CLAUDE.md` for team reference

---

## SUPPORT

All files are:
- ✓ Production-ready
- ✓ Fully commented
- ✓ Error handling included
- ✓ Logging built-in
- ✓ Standards-compliant

No external dependencies beyond:
- Python: `playwright`, `pillow`
- Browser: `html2canvas`, `jspdf` (loaded from CDN)

---

**Created for Ultron / 51ultron.com**  
**LinkedIn Content Export Standard: 1080×1350px @ 144dpi**
