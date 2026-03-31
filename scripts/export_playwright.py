"""
Export Pipeline - Playwright + PIL
Captures HTML artifacts to PNG at retina quality (1080×1350px @ 144dpi)
"""

import asyncio
import os
from pathlib import Path
from PIL import Image
import io
import json
from datetime import datetime

class PlaywrightExporter:
    def __init__(self, output_dir: str = "/mnt/user-data/outputs"):
        self.output_dir = output_dir
        self.dimensions = {
            'width_px': 1080,
            'height_px': 1350,
            'scale_factor': 2,  # 2x for retina
            'dpi': 144
        }
        
        # Ensure output dir exists
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)
    
    async def capture_html(
        self,
        html_content: str,
        filename: str = "artifact",
        hide_export_bar: bool = True
    ) -> dict:
        """
        Capture HTML to PNG at 1080×1350 @ 144dpi retina
        
        Args:
            html_content: Full HTML string
            filename: Output filename (without extension)
            hide_export_bar: Remove #export-bar before capture
            
        Returns:
            dict with png_path, png_filename, file_size, dimensions, dpi
        """
        try:
            from playwright.async_api import async_playwright
        except ImportError:
            print("Installing Playwright...")
            os.system("pip install playwright --break-system-packages")
            from playwright.async_api import async_playwright

        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=['--no-sandbox']
                )

                page = await browser.new_page(
                    viewport={
                        'width': self.dimensions['width_px'],
                        'height': self.dimensions['height_px']
                    },
                    device_scale_factor=self.dimensions['scale_factor']
                )

                # Set content
                await page.set_content(html_content, wait_until='networkidle')

                # Hide export bar if present
                if hide_export_bar:
                    try:
                        await page.locator('#export-bar').evaluate('el => el.style.display = "none"')
                    except:
                        pass  # Export bar not present, continue

                # Capture screenshot (2160×2700 at 2x scale)
                screenshot = await page.screenshot(full_page=True, type='png')

                await browser.close()

                # Downsample via PIL LANCZOS
                img = Image.open(io.BytesIO(screenshot))

                # Current: 2160×2700 (2x scale)
                # Target: 1080×1350 (1x at 144dpi)
                img_downsampled = img.resize(
                    (self.dimensions['width_px'], self.dimensions['height_px']),
                    Image.Resampling.LANCZOS
                )

                # Save @ 144 DPI
                png_filename = f"{filename}-1080x1350.png"
                png_path = os.path.join(self.output_dir, png_filename)

                img_downsampled.save(
                    png_path,
                    'PNG',
                    dpi=(self.dimensions['dpi'], self.dimensions['dpi']),
                    optimize=True
                )

                # Get file stats
                file_size = os.path.getsize(png_path)

                return {
                    'success': True,
                    'png_path': png_path,
                    'png_filename': png_filename,
                    'file_size': file_size,
                    'file_size_kb': round(file_size / 1024, 2),
                    'dimensions': {
                        'width': self.dimensions['width_px'],
                        'height': self.dimensions['height_px']
                    },
                    'dpi': self.dimensions['dpi'],
                    'scale_factor': self.dimensions['scale_factor'],
                    'captured_at': datetime.now().isoformat()
                }

        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'error_type': type(e).__name__
            }
    
    async def batch_export(
        self,
        html_variants: list,
        batch_name: str = "batch",
        on_progress = None
    ) -> dict:
        """
        Export multiple HTML variants in parallel
        
        Args:
            html_variants: List of {'html': str, 'filename': str}
            batch_name: Batch identifier for logging
            on_progress: Callback function(current, total)
            
        Returns:
            dict with all exports, batch stats
        """
        total = len(html_variants)
        exports = []
        
        for idx, variant in enumerate(html_variants):
            if on_progress:
                on_progress(idx + 1, total)
            
            result = await self.capture_html(
                html_content=variant['html'],
                filename=variant.get('filename', f"{batch_name}-{idx+1}")
            )
            
            exports.append(result)
        
        return {
            'batch_name': batch_name,
            'total_variants': total,
            'successful_exports': sum(1 for e in exports if e.get('success', False)),
            'failed_exports': sum(1 for e in exports if not e.get('success', False)),
            'exports': exports,
            'batch_completed_at': datetime.now().isoformat()
        }
    
    def export_sync(self, html_content: str, filename: str = "artifact") -> dict:
        """
        Synchronous wrapper for capture_html (for use in non-async contexts)
        """
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(self.capture_html(html_content, filename))
        loop.close()
        return result


class PDFExporter:
    """Export HTML to PDF at LinkedIn dimensions"""
    
    def __init__(self, output_dir: str = "/mnt/user-data/outputs"):
        self.output_dir = output_dir
        # mm at 96dpi: px / 96 * 25.4
        self.w_mm = 285.75  # 1080px
        self.h_mm = 357.19  # 1350px
    
    async def export_single(self, html_content: str, filename: str = "artifact") -> dict:
        """Export single HTML to PDF"""
        try:
            from playwright.async_api import async_playwright
        except ImportError:
            os.system("pip install playwright --break-system-packages")
            from playwright.async_api import async_playwright
        
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True, args=['--no-sandbox'])
                page = await browser.new_page(viewport={'width': 1080, 'height': 1350})
                await page.set_content(html_content, wait_until='networkidle')
                
                pdf_filename = f"{filename}-1080x1350.pdf"
                pdf_path = os.path.join(self.output_dir, pdf_filename)
                
                await page.pdf(
                    path=pdf_path,
                    format='A4',
                    margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'}
                )
                
                await browser.close()
                
                file_size = os.path.getsize(pdf_path)
                
                return {
                    'success': True,
                    'pdf_path': pdf_path,
                    'pdf_filename': pdf_filename,
                    'file_size': file_size,
                    'file_size_kb': round(file_size / 1024, 2)
                }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }


def log_export_result(result: dict, variant_num: int = 1):
    """Pretty print export result"""
    if result.get('success'):
        print(f"✓ Variant {variant_num}: {result['png_filename']} ({result['file_size_kb']}KB)")
    else:
        print(f"✗ Variant {variant_num}: ERROR - {result.get('error')}")


async def test_exporter():
    """Test the exporter with a simple HTML"""
    html = """<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; }
        body {
            width: 1080px;
            height: 1350px;
            background: #F8F6F1;
            font-family: Arial, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        h1 { color: #111; font-size: 48px; }
    </style>
</head>
<body>
    <h1>Test Export</h1>
</body>
</html>"""
    
    exporter = PlaywrightExporter()
    result = await exporter.capture_html(html, filename="test")
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    print("Playwright Exporter Module Loaded")
    print("Run: asyncio.run(test_exporter()) to test")
