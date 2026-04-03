# EXPORT WORKFLOW GUIDE

Complete guide for exporting LinkedIn materials as PNG/PDF files.

---

## Overview

Your LinkedIn Materials Library supports **two export approaches**:

### **1. Browser-Based (Interactive)**
Click "Download" button in materials gallery → PNG or PDF downloads instantly
- ✅ Works in Claude.ai artifacts
- ✅ No backend needed
- ✅ User-friendly
- ✅ Instant preview

### **2. Server-Side (Automated)**
Python script with Playwright → batch export, CI/CD pipelines
- ✅ High-quality LANCZOS downsampling
- ✅ Automated in GitHub Actions
- ✅ Batch processing
- ✅ Quality control

---

## Browser-Based Export (Quick Start)

### Files in `github/scripts/`
- `export-bar.js` — Export UI component
- `EXPORT_EXAMPLE.html` — Working example
- `EXPORT_QUICK_REFERENCE.md` — 1-page guide

### Setup (Already Done)
The `ExportBar` component is integrated in:
- `components/ExportBar.tsx`
- Add to any preview page

### Usage
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<ExportBar 
  materialId="claude-connectors-2025"
  materialTitle="Claude Interactive Connectors"
  elementId="preview-container"
/>
```

### Export Options
- **Format:** PNG or PDF
- **Scale:** 1x or 2x (Retina)
- **Resolution:** 1080×1350px (LinkedIn standard)
- **Quality:** 144 DPI

---

## Server-Side Export (Advanced)

### Files in `github/scripts/`
- `export_playwright.py` — Headless Chromium capture
- `EXPORT_IMPLEMENTATION_GUIDE.md` — Full technical docs
- `EXPORT_CLAUDE_MD.txt` — Integration instructions

### Setup

```bash
# Install dependencies
pip install playwright pillow

# Install Chromium
playwright install chromium
```

### Usage

```bash
# Single export
python export_playwright.py \
  --html /path/to/artifact.html \
  --output /path/to/artifact.png

# Batch export
python export_playwright.py \
  --html drafts/material-*.html \
  --output exports/ \
  --scale 2x \
  --format png,pdf
```

### Options
```
--html FILE             Input HTML file or glob pattern
--output DIR|FILE       Output directory or file path
--scale {1x,2x}         1x or 2x resolution (default: 2x)
--dpi {72,144}          DPI setting (default: 144)
--format {png,pdf}      Output formats (comma-separated)
--quality {95}          JPEG quality if converting (default: 95)
--log-level {DEBUG}     Logging verbosity
```

### Output
- **PNG:** 1080×1350px, 2x retina capture, optimized file size
- **PDF:** A5 format (half-page), embeddable metadata

---

## Integration with Materials Library

### Add Export to Drafts Page
```tsx
import { ExportBar } from '@/components/ExportBar'

export default function DraftsPage() {
  return (
    <>
      <ExportBar 
        materialId={selectedDraft.id}
        materialTitle={selectedDraft.title}
        elementId="preview-container"
      />
      <div id="preview-container">
        {/* Material preview */}
      </div>
    </>
  )
}
```

### Add Export to Live Gallery
```tsx
<ExportBar 
  materialId={material.id}
  materialTitle={material.title}
  elementId={`material-${material.id}`}
/>
```

### Tracking Exports (Optional)
Add to `lib/materials.json`:
```json
{
  "id": "claude-connectors-2025",
  "exports": {
    "total": 24,
    "last_exported": "2025-01-29",
    "formats": ["png", "pdf"],
    "scales": ["1x", "2x"]
  }
}
```

---

## GitHub Actions Integration

### Automated Export on Material Deployment
Add to `.github/workflows/export-materials.yml`:

```yaml
name: Export LinkedIn Materials

on:
  push:
    paths:
      - 'lib/materials.json'
      - 'public/claude-*.html'

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: amannn/action-semantic-pull-request@v5
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install playwright pillow
          playwright install chromium
      
      - name: Export materials
        run: |
          python github/scripts/export_playwright.py \
            --html public/claude-*.html \
            --output exports/ \
            --format png,pdf \
            --scale 2x
      
      - name: Upload exports
        uses: actions/upload-artifact@v3
        with:
          name: linkedin-exports
          path: exports/
          retention-days: 30
```

---

## Quality Specifications

Both export methods produce:

```
Dimensions:     1080 × 1350px (4:5 LinkedIn ratio)
Capture:        2x retina scale (2160 × 2700px internally)
Downsampling:   LANCZOS (server) / Canvas (browser)
DPI:            144 (web standard)
Color Space:    sRGB
Compression:    Optimized for LinkedIn upload
File Size:      150-400KB (PNG)
Metadata:       Material ID, date, creator embedded
```

### Optimization Rules
- PNG: Use for LinkedIn (native format)
- PDF: Use for archives, internal sharing
- 2x scale: For high-DPI displays (phone, tablet)
- 1x scale: For web-only distribution

---

## Troubleshooting

### Browser Export Issues

**Error: "Element not found"**
- Verify `elementId` matches actual DOM element
- Check element is rendered before export
- Use browser dev tools to confirm element exists

**Error: "CORS error with images"**
- Images must be from same origin or have CORS headers
- Use `useCORS: true` in html2canvas options (already enabled)

**PNG is blurry**
- Select "2x (Retina)" scale option
- Download will be 2x larger file but higher quality

**PDF missing content**
- Some CSS effects don't render in PDF
- Test with PNG export first
- Use jsPDF without layers/blending for compatibility

### Server Export Issues

**Error: "Chromium not found"**
```bash
playwright install chromium
```

**Error: "Port already in use"**
- Playwright may have lingering browser process
```bash
pkill -f "chromium"
```

**Timeout errors**
- Increase timeout in script (default 30s)
- Check HTML file is valid
- Verify all external resources load

**Quality issues**
- Check DPI setting (144 = web standard)
- Verify LANCZOS downsampling is enabled
- Use PIL version 9.0+ for best results

---

## Performance

### Browser Export
- **Time:** 2-5 seconds per export
- **Memory:** 100-200MB
- **Network:** Minimal (all local)

### Server Export
- **Time:** 3-8 seconds per file
- **Memory:** 200-500MB
- **Batch:** 1-2 seconds per additional file
- **CPU:** ~50% single core

---

## Security & Privacy

- ✅ All exports run locally (no external upload)
- ✅ No analytics or tracking
- ✅ Metadata embedded but not shared
- ✅ PDF/PNG files are static (no tracking pixels)
- ✅ Suitable for internal use and LinkedIn posting

---

## Next Steps

1. **Quick Test:**
   - Open `github/scripts/EXPORT_EXAMPLE.html` in browser
   - Click "Download PNG" and "Download PDF"
   - Verify output files are correct

2. **Integrate to Drafts:**
   - Add `<ExportBar>` component to `/linkedin-materials/drafts`
   - Test export from staging area
   - Verify quality before deploying

3. **Setup GitHub Actions:**
   - Copy workflow to `.github/workflows/`
   - Test on next material deployment
   - Monitor artifact uploads

4. **Document in CLAUDE.md:**
   - Add export commands to project instructions
   - Include quick-reference for team
   - Link to this guide

---

## Quick Reference

### Export Browser (Instant)
```
1. Go to /linkedin-materials/drafts
2. Select material
3. Choose PNG or PDF, 1x or 2x
4. Click "Download"
5. File appears in Downloads folder
```

### Export Server (Automated)
```bash
python github/scripts/export_playwright.py \
  --html public/claude-connectors-2025.html \
  --output exports/claude-connectors-2025.png \
  --scale 2x
```

### Files You Have
- `export-bar.js` (browser module)
- `export_playwright.py` (server script)
- `EXPORT_*.md` (documentation)
- `EXPORT_EXAMPLE.html` (working example)
- `components/ExportBar.tsx` (React integration)
