# LinkedIn Content Export Implementation Guide

**For Ultron:** Complete setup for Playwright server-side PNG export + browser-based PDF/PNG download.

---

## PART 1: PLAYWRIGHT SERVER-SIDE PNG EXPORT

### Installation

```bash
# Install dependencies
pip install playwright pillow

# Install Chromium browser
playwright install chromium
```

### Basic Usage

```bash
# Simple capture
python export_playwright.py \
  --html artifact.html \
  --output artifact.png

# With custom dimensions
python export_playwright.py \
  --html artifact.html \
  --output artifact.png \
  --width 1080 \
  --height 1350

# Keep export bar in output (default removes it)
python export_playwright.py \
  --html artifact.html \
  --output artifact.png \
  --keep-export-bar
```

### Python Script Details

**File:** `export_playwright.py`

Key features:
- **Viewport:** 1080x1350px (LinkedIn standard)
- **Scale:** 2x device factor (2160x2700px capture)
- **Downsampling:** PIL LANCZOS (high-quality reduction)
- **DPI:** 144dpi (web standard)
- **Auto-hide:** Removes #export-bar before capture
- **Logging:** Detailed progress + file size output

```python
# Key function signature
async def capture_html_to_png(
    html_path: str,
    output_path: str,
    remove_export_bar: bool = True,
    viewport_width: int = 1080,
    viewport_height: int = 1350,
    timeout: int = 30000
) -> bool:
    """Returns True on success, False on failure"""
```

### For Claude Code Integration

Use in your CLAUDE.md workflow:

```markdown
## Export Workflow

1. Save artifact HTML to project directory
2. Run Playwright capture:
   ```bash
   python export_playwright.py --html artifact.html --output artifact.png
   ```
3. Check output in same directory
```

Or add as a Bash skill:

```markdown
## Skills/.claude/skills/export-linkedin/SKILL.md

---
name: export-linkedin
description: Capture LinkedIn artifacts to PNG at 1080x1350px using Playwright
allowed_tools: Bash, Read, Write
---

# LinkedIn PNG Export

Use Playwright for high-quality server-side capture:

```bash
python export_playwright.py --html <file.html> --output <file.png>
```

Removes export bar automatically. Outputs exact 1080x1350px at 144dpi.
```

---

## PART 2: BROWSER-BASED DOWNLOAD IMPLEMENTATION

### Quick Start (No Setup)

For your HTML artifact, add before `</body>`:

```html
<!-- Export Bar + Download Buttons -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<div id="export-bar" style="position:fixed;bottom:0;left:0;right:0;background:rgba(17,17,17,0.95);padding:12px 20px;display:flex;align-items:center;gap:10px;z-index:9999;backdrop-filter:blur(8px);">
  <span style="font-size:11px;color:#888;margin-right:auto;">1080 x 1350px • LinkedIn standard</span>
  <button id="export-png-btn" onclick="exportPNG()" style="padding:8px 18px;background:#F8F6F1;color:#111;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">Download PNG</button>
  <button id="export-pdf-btn" onclick="exportPDF()" style="padding:8px 18px;background:#C94A22;color:#fff;border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;">Download PDF</button>
</div>

<script>
const ARTIFACT = document.getElementById('artifact');
const W = 1080, H = 1350;
const W_MM = 285.75, H_MM = 357.19;

async function exportPNG() {
  const btn = document.getElementById('export-png-btn');
  btn.disabled = true; btn.textContent = 'Capturing...';
  const canvas = await html2canvas(ARTIFACT, {
    width: W, height: H, scale: 2, useCORS: true, backgroundColor: null
  });
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'artifact-1080x1350.png';
  link.click();
  btn.disabled = false; btn.textContent = 'Download PNG';
}

async function exportPDF() {
  const btn = document.getElementById('export-pdf-btn');
  btn.disabled = true; btn.textContent = 'Generating...';
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [W_MM, H_MM] });
  const canvas = await html2canvas(ARTIFACT, {
    width: W, height: H, scale: 2, useCORS: true, backgroundColor: null
  });
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, W_MM, H_MM);
  pdf.save('artifact-1080x1350.pdf');
  btn.disabled = false; btn.textContent = 'Download PDF';
}
</script>
```

### Full Module Version (Recommended)

Use the included `export-bar.js`:

```html
<!-- In your HTML artifact -->
<div id="artifact">
  <!-- Your content here -->
</div>

<!-- Load scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="export-bar.js"></script>

<!-- Initialize -->
<script>
window.EXPORT_CONFIG = {
  target: document.getElementById('artifact'),
  filename: 'ultron-linkedin',
  format: 'single'  // or 'carousel'
};
</script>
```

The bar auto-injects on DOMContentLoaded.

### Carousel (Multiple Slides)

For multi-slide artifacts:

```html
<script>
window.EXPORT_CONFIG = {
  filename: 'ultron-carousel',
  format: 'carousel',
  slideSelector: '.slide'  // CSS selector for each slide
};
</script>
```

PDF will generate one page per slide automatically.

---

## PART 3: IMPLEMENTATION CHECKLIST

### For Single HTML Artifacts

- [ ] Copy `export-bar.js` to project directory
- [ ] Add before `</body>` in artifact:
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="export-bar.js"></script>
  ```
- [ ] Wrap content in `<div id="artifact">...</div>`
- [ ] Test PNG download
- [ ] Test PDF download

### For Server-Side Pipeline (Vercel/Node.js)

- [ ] Install: `pip install playwright pillow`
- [ ] Copy `export_playwright.py` to project
- [ ] Add to build script:
  ```bash
  python export_playwright.py --html /path/to/artifact.html --output /path/to/output.png
  ```
- [ ] Integrate with CI/CD (GitHub Actions, etc.)

### For Claude Code Workflow

In `.claude/skills/export-linkedin/SKILL.md`:

```markdown
---
name: export-linkedin
description: Capture artifacts to PNG/PDF at 1080x1350px
allowed_tools: Bash, Read, Write
---

# Export LinkedIn Content

## Server-side (PNG):
```bash
python export_playwright.py --html artifact.html --output artifact.png
```

## Browser (PNG/PDF):
Include export-bar.js before </body> in your HTML.

## Dimensions:
- Final: 1080x1350px (LinkedIn standard)
- Capture: 2160x2700px (2x retina)
- DPI: 144dpi
```

---

## PART 4: TECHNICAL DETAILS

### Playwright Capture Flow

```
1. Load HTML in Chromium browser
2. Set viewport: 1080x1350px
3. Set device scale factor: 2x
4. Hide #export-bar element
5. Screenshot → 2160x2700px PNG
6. Load into PIL
7. Downsample LANCZOS → 1080x1350px
8. Save with 144dpi metadata
```

### Browser Export Flow

```
1. Render artifact in DOM
2. html2canvas captures visible viewport
3. Scale factor: 2x (retina quality)
4. Convert to PNG data URL
5. Create <a> element + trigger download
   OR
6. Convert to PDF via jsPDF
7. Add image to page (0,0)
8. Save as PDF file
```

### Why Playwright > html2canvas

For production use:

| Feature | Playwright | html2canvas |
|---------|-----------|------------|
| Server-side | ✓ | ✗ |
| Headless | ✓ | ✗ |
| Consistency | ✓ | ~ (browser-dependent) |
| Quality | ✓ | ✓ |
| Speed | ✓ | ✓ |
| Fonts/CSS | ✓ | ~ (CORS issues) |

---

## PART 5: COMMAND REFERENCE

### Playwright Python

```bash
# Basic
python export_playwright.py --html in.html --output out.png

# Custom size
python export_playwright.py --html in.html --output out.png --width 1080 --height 1350

# Keep export bar
python export_playwright.py --html in.html --output out.png --keep-export-bar

# Custom timeout
python export_playwright.py --html in.html --output out.png --timeout 60
```

### Browser JavaScript

```javascript
// Auto-inject with defaults
injectExportBar();

// Custom config
injectExportBar({
  target: document.getElementById('my-artifact'),
  filename: 'my-post',
  format: 'carousel',
  slideSelector: '.slide'
});

// PNG export
exportPNG();

// PDF export
exportPDF();
```

---

## TROUBLESHOOTING

### Playwright Issues

**"ModuleNotFoundError: No module named 'playwright'"**
```bash
pip install playwright
playwright install chromium
```

**"Timeout waiting for page to load"**
```bash
python export_playwright.py --html in.html --output out.png --timeout 60
```

**Export bar still appears in PNG**
```bash
python export_playwright.py --html in.html --output out.png --keep-export-bar
```

### Browser Issues

**"html2canvas is not defined"**
Check CDN link is loaded:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```

**PNG is blurry**
Ensure `scale: 2` in html2canvas options (already set in export-bar.js).

**PDF is empty**
Ensure artifact is in #artifact div and visible in DOM before export.

---

## FILES PROVIDED

1. **export_playwright.py** — Server-side PNG capture
2. **export-bar.js** — Browser export module
3. **This guide** — Implementation reference

All files are production-ready. Copy directly to Claude Code project.
