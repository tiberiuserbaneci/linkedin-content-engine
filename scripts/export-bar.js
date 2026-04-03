/**
 * LinkedIn Content Export Bar
 * Drop-in solution for HTML artifacts - PNG + PDF download at 1080x1350px
 * 
 * Usage:
 *   1. Include in artifact HTML before </body>
 *   2. Load CDN scripts: html2canvas + jsPDF
 *   3. Call injectExportBar() after artifact renders
 * 
 * Example:
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
 *   <script src="export-bar.js"></script>
 *   <script>
 *     injectExportBar({
 *       target: document.getElementById('artifact'),
 *       filename: 'ultron-linkedin',
 *       format: 'single'
 *     });
 *   </script>
 */

// Export configuration
const LINKEDIN_EXPORT = {
  W_PX: 1080,
  H_PX: 1350,
  W_MM: 285.75,      // 1080px at 96dpi in mm
  H_MM: 357.19,      // 1350px at 96dpi in mm
  SCALE: 2,          // Retina quality
  DPI: 144,          // Web standard
};

/**
 * Inject floating export bar into page
 * @param {Object} config
 *   @param {HTMLElement} config.target - Element to capture (default: #artifact or body)
 *   @param {string} config.filename - Base filename (default: 'ultron-linkedin')
 *   @param {string} config.format - 'single' or 'carousel' (default: 'single')
 *   @param {string} config.slideSelector - CSS selector for carousel slides (default: '.slide')
 */
function injectExportBar(config = {}) {
  const {
    target = document.getElementById('artifact') || document.body,
    filename = 'ultron-linkedin',
    format = 'single',
    slideSelector = '.slide',
  } = config;

  // Remove existing bar if present
  const existing = document.getElementById('export-bar');
  if (existing) existing.remove();

  const isCarousel = format === 'carousel';
  const slideCount = isCarousel 
    ? target.querySelectorAll(slideSelector).length 
    : 1;
  const pdfLabel = isCarousel
    ? `Download PDF (${slideCount} slides)`
    : 'Download PDF';

  // Create export bar
  const bar = document.createElement('div');
  bar.id = 'export-bar';
  bar.style.cssText = [
    'position:fixed',
    'bottom:0',
    'left:0',
    'right:0',
    'background:rgba(17,17,17,0.95)',
    'padding:12px 20px',
    'display:flex',
    'align-items:center',
    'gap:10px',
    'z-index:9999',
    'backdrop-filter:blur(8px)',
    '-webkit-backdrop-filter:blur(8px)',
    'font-family:Arial,sans-serif',
  ].join(';');

  bar.innerHTML = `
    <span id="export-label" style="font-size:11px;color:#888;margin-right:auto;letter-spacing:0.05em;">
      ${LINKEDIN_EXPORT.W_PX} x ${LINKEDIN_EXPORT.H_PX}px • LinkedIn standard
    </span>
    <button id="export-png-btn" style="padding:8px 18px;background:#F8F6F1;color:#111;border:none;border-radius:6px;font-size:12px;font-family:Arial,sans-serif;font-weight:600;cursor:pointer;letter-spacing:0.03em;transition:opacity 0.15s;">
      Download PNG
    </button>
    <button id="export-pdf-btn" style="padding:8px 18px;background:#C94A22;color:#fff;border:none;border-radius:6px;font-size:12px;font-family:Arial,sans-serif;font-weight:600;cursor:pointer;letter-spacing:0.03em;transition:opacity 0.15s;">
      ${pdfLabel}
    </button>
  `;

  document.body.appendChild(bar);

  // PNG export handler
  document.getElementById('export-png-btn').addEventListener('click', async () => {
    const btn = document.getElementById('export-png-btn');
    const label = document.getElementById('export-label');
    const bar = document.getElementById('export-bar');
    
    btn.disabled = true;
    btn.textContent = 'Capturing...';
    btn.style.opacity = '0.5';
    label.textContent = 'Capturing PNG...';
    bar.style.display = 'none';

    try {
      const canvas = await html2canvas(target, {
        width: LINKEDIN_EXPORT.W_PX,
        height: LINKEDIN_EXPORT.H_PX,
        scale: LINKEDIN_EXPORT.SCALE,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        onclone: (doc) => {
          // Remove export bar from clone
          const cloneBar = doc.getElementById('export-bar');
          if (cloneBar) cloneBar.remove();
        }
      });

      const link = document.createElement('a');
      link.download = `${filename}-${LINKEDIN_EXPORT.W_PX}x${LINKEDIN_EXPORT.H_PX}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      label.textContent = `${LINKEDIN_EXPORT.W_PX} x ${LINKEDIN_EXPORT.H_PX}px • LinkedIn standard`;
      bar.style.display = 'flex';
    } catch (err) {
      console.error('PNG export failed:', err);
      label.textContent = 'Error: PNG capture failed';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Download PNG';
      btn.style.opacity = '1';
    }
  });

  // PDF export handler
  document.getElementById('export-pdf-btn').addEventListener('click', async () => {
    const btn = document.getElementById('export-pdf-btn');
    const label = document.getElementById('export-label');
    const bar = document.getElementById('export-bar');
    
    btn.disabled = true;
    btn.style.opacity = '0.5';
    bar.style.display = 'none';

    try {
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [LINKEDIN_EXPORT.W_MM, LINKEDIN_EXPORT.H_MM],
        compress: true,
      });

      if (isCarousel) {
        // Multi-page PDF for carousel
        const slides = target.querySelectorAll(slideSelector);
        for (let i = 0; i < slides.length; i++) {
          if (i > 0) pdf.addPage([LINKEDIN_EXPORT.W_MM, LINKEDIN_EXPORT.H_MM], 'portrait');

          btn.textContent = `Rendering ${i + 1}/${slides.length}...`;

          // Show only current slide during capture
          slides.forEach((s, idx) => {
            s.style.display = idx === i ? 'block' : 'none';
          });

          const canvas = await html2canvas(slides[i], {
            width: LINKEDIN_EXPORT.W_PX,
            height: LINKEDIN_EXPORT.H_PX,
            scale: LINKEDIN_EXPORT.SCALE,
            useCORS: true,
            backgroundColor: null,
            logging: false,
            onclone: (doc) => {
              const cloneBar = doc.getElementById('export-bar');
              if (cloneBar) cloneBar.remove();
            }
          });

          pdf.addImage(
            canvas.toDataURL('image/png'),
            'PNG',
            0, 0,
            LINKEDIN_EXPORT.W_MM,
            LINKEDIN_EXPORT.H_MM,
            undefined,
            'FAST'
          );
        }

        // Restore all slides
        slides.forEach(s => { s.style.display = ''; });

      } else {
        // Single-page PDF
        btn.textContent = 'Generating PDF...';
        const canvas = await html2canvas(target, {
          width: LINKEDIN_EXPORT.W_PX,
          height: LINKEDIN_EXPORT.H_PX,
          scale: LINKEDIN_EXPORT.SCALE,
          useCORS: true,
          backgroundColor: null,
          logging: false,
          onclone: (doc) => {
            const cloneBar = doc.getElementById('export-bar');
            if (cloneBar) cloneBar.remove();
          }
        });

        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0, 0,
          LINKEDIN_EXPORT.W_MM,
          LINKEDIN_EXPORT.H_MM,
          undefined,
          'FAST'
        );
      }

      pdf.save(`${filename}-${LINKEDIN_EXPORT.W_PX}x${LINKEDIN_EXPORT.H_PX}.pdf`);
      label.textContent = `${LINKEDIN_EXPORT.W_PX} x ${LINKEDIN_EXPORT.H_PX}px • LinkedIn standard`;
      bar.style.display = 'flex';

    } catch (err) {
      console.error('PDF export failed:', err);
      label.textContent = 'Error: PDF generation failed';
    } finally {
      btn.disabled = false;
      btn.textContent = pdfLabel;
      btn.style.opacity = '1';
    }
  });

  console.log('✓ Export bar injected. Ready for PNG/PDF download.');
}

// Auto-inject if config element exists
document.addEventListener('DOMContentLoaded', () => {
  const config = window.EXPORT_CONFIG || {};
  if (config.auto !== false) {
    injectExportBar(config);
  }
});
