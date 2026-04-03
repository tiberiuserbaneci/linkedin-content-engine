"""
Playwright PNG Export Utility
Server-side capture for LinkedIn content (1080x1350px at 144dpi)

Usage:
    python export_playwright.py --html /path/to/artifact.html --output /path/to/output.png
    
Features:
    - Captures at 1080x1350px (LinkedIn standard portrait)
    - 2x device scale factor (retina quality)
    - PIL LANCZOS downsampling to exact dimensions
    - 144dpi export for web
    - Removes export UI elements before capture
    - Error handling and logging
"""

import asyncio
import argparse
import logging
from pathlib import Path
from PIL import Image
import io

try:
    from playwright.async_api import async_playwright
except ImportError:
    print("ERROR: Playwright not installed. Run: pip install playwright pillow")
    print("Then: playwright install chromium")
    exit(1)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Export dimensions (LinkedIn standard)
EXPORT_W_PX = 1080
EXPORT_H_PX = 1350
DEVICE_SCALE_FACTOR = 2  # Retina (2x)
CAPTURE_W_PX = EXPORT_W_PX * DEVICE_SCALE_FACTOR  # 2160px capture
CAPTURE_H_PX = EXPORT_H_PX * DEVICE_SCALE_FACTOR  # 2700px capture
DPI = 144  # Web standard


async def capture_html_to_png(
    html_path: str,
    output_path: str,
    remove_export_bar: bool = True,
    viewport_width: int = 1080,
    viewport_height: int = 1350,
    timeout: int = 30000
) -> bool:
    """
    Capture HTML artifact to PNG at LinkedIn dimensions using Playwright.
    
    Args:
        html_path: Path to HTML file
        output_path: Path to save PNG
        remove_export_bar: Hide #export-bar before capture
        viewport_width: Viewport width in px (default: 1080)
        viewport_height: Viewport height in px (default: 1350)
        timeout: Navigation timeout in ms (default: 30000)
        
    Returns:
        bool: True if successful, False otherwise
    """
    
    html_file = Path(html_path)
    output_file = Path(output_path)
    
    # Validation
    if not html_file.exists():
        logger.error(f"HTML file not found: {html_path}")
        return False
    
    if not output_file.parent.exists():
        logger.error(f"Output directory not found: {output_file.parent}")
        return False
    
    try:
        async with async_playwright() as p:
            logger.info("Launching Chromium browser...")
            browser = await p.chromium.launch()
            
            # Create context with exact viewport
            context = await browser.new_context(
                viewport={'width': viewport_width, 'height': viewport_height},
                device_scale_factor=DEVICE_SCALE_FACTOR
            )
            
            page = await context.new_page()
            
            # Load HTML file
            html_url = html_file.as_uri()
            logger.info(f"Loading HTML from: {html_url}")
            await page.goto(html_url, wait_until='networkidle', timeout=timeout)
            
            # Wait for images/fonts to load
            await page.wait_for_load_state('networkidle')
            logger.info("Page loaded successfully")
            
            # Remove export bar if requested (prevents it from appearing in PNG)
            if remove_export_bar:
                logger.info("Hiding export bar...")
                await page.evaluate("""
                    const bar = document.getElementById('export-bar');
                    if (bar) {
                        bar.style.display = 'none';
                    }
                """)
            
            # Get actual page height to handle variable content
            actual_height = await page.evaluate("""
                () => {
                    const target = document.getElementById('artifact') || document.body;
                    return Math.max(
                        target.scrollHeight,
                        target.offsetHeight
                    );
                }
            """)
            
            logger.info(f"Actual page height: {actual_height}px")
            
            # Capture at 2x scale
            logger.info(f"Capturing at {CAPTURE_W_PX}x{CAPTURE_H_PX}px (2x scale)...")
            screenshot_bytes = await page.screenshot(
                path=None,  # Return bytes, don't save
                type='png',
                scale='device',  # Use device scale factor
                full_page=False  # Use viewport size
            )
            
            logger.info("Screenshot captured, processing with PIL...")
            
            # Load screenshot into PIL
            screenshot_img = Image.open(io.BytesIO(screenshot_bytes))
            logger.info(f"Screenshot size: {screenshot_img.size}")
            
            # Downsample from 2x to 1x using LANCZOS (high-quality)
            final_img = screenshot_img.resize(
                (EXPORT_W_PX, EXPORT_H_PX),
                Image.Resampling.LANCZOS
            )
            
            # Save with DPI metadata
            final_img.save(
                output_file,
                'PNG',
                dpi=(DPI, DPI)
            )
            
            logger.info(f"✓ PNG saved: {output_file}")
            logger.info(f"  Dimensions: {final_img.size}")
            logger.info(f"  DPI: {DPI}")
            logger.info(f"  File size: {output_file.stat().st_size / 1024:.1f} KB")
            
            await context.close()
            await browser.close()
            
            return True
            
    except Exception as e:
        logger.error(f"✗ Capture failed: {str(e)}", exc_info=True)
        return False


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description='Capture LinkedIn artifact to PNG using Playwright',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python export_playwright.py --html artifact.html --output artifact.png
  python export_playwright.py --html artifact.html --output artifact.png --width 1080 --height 1350
  python export_playwright.py --html artifact.html --output artifact.png --keep-export-bar
        """
    )
    
    parser.add_argument(
        '--html',
        required=True,
        help='Path to HTML artifact file'
    )
    parser.add_argument(
        '--output',
        required=True,
        help='Path to save PNG output'
    )
    parser.add_argument(
        '--width',
        type=int,
        default=1080,
        help='Viewport width in pixels (default: 1080)'
    )
    parser.add_argument(
        '--height',
        type=int,
        default=1350,
        help='Viewport height in pixels (default: 1350)'
    )
    parser.add_argument(
        '--keep-export-bar',
        action='store_true',
        help='Keep export bar in screenshot (default: remove it)'
    )
    parser.add_argument(
        '--timeout',
        type=int,
        default=30,
        help='Page load timeout in seconds (default: 30)'
    )
    
    args = parser.parse_args()
    
    logger.info("=" * 60)
    logger.info("PLAYWRIGHT PNG EXPORT - LINKEDIN STANDARD")
    logger.info("=" * 60)
    logger.info(f"HTML Input:      {args.html}")
    logger.info(f"PNG Output:      {args.output}")
    logger.info(f"Dimensions:      {args.width}x{args.height}px")
    logger.info(f"Export Scale:    2x retina (→ {args.width}x{args.height}px final)")
    logger.info(f"DPI:             {DPI}")
    logger.info(f"Remove Export:   {not args.keep_export_bar}")
    logger.info("=" * 60)
    
    success = asyncio.run(capture_html_to_png(
        html_path=args.html,
        output_path=args.output,
        remove_export_bar=not args.keep_export_bar,
        viewport_width=args.width,
        viewport_height=args.height,
        timeout=args.timeout * 1000
    ))
    
    if success:
        logger.info("\n✓ Export completed successfully")
        exit(0)
    else:
        logger.error("\n✗ Export failed")
        exit(1)


if __name__ == '__main__':
    main()
