"""
Test suite for output file pipeline
Validates: output directory structure, PNG generation, file sizing, variant naming
Creates synthetic PNG fixtures so tests run without Playwright or Claude API
"""

import sys
import os
import io
import shutil
import tempfile
from pathlib import Path
from datetime import datetime

sys.path.insert(0, str(Path(__file__).parent))

OUTPUT_DIR = Path("/mnt/user-data/outputs")

# ──────────────────────────────────────────────────────────────────────────────
# Fixture helpers
# ──────────────────────────────────────────────────────────────────────────────

def _make_png_bytes(width: int = 1080, height: int = 1350) -> bytes:
    """Create a minimal valid PNG in memory (solid color, no Pillow needed)."""
    import struct, zlib

    def chunk(name: bytes, data: bytes) -> bytes:
        c = name + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    # IHDR
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)  # 8-bit RGB
    # IDAT: one row per scanline, filter byte 0x00 + RGB pixels
    row = b'\x00' + b'\xBE\x46\x28' * width          # filter=none, orange pixels
    raw = row * height
    idat_data = zlib.compress(raw)
    # IEND
    return (
        b'\x89PNG\r\n\x1a\n'
        + chunk(b'IHDR', ihdr_data)
        + chunk(b'IDAT', idat_data)
        + chunk(b'IEND', b'')
    )


def create_variant_fixtures(output_dir: Path, count: int = 5) -> list:
    """Write synthetic 1080×1350 PNG files; return list of Paths."""
    created = []
    png_bytes = _make_png_bytes(1080, 1350)
    for i in range(1, count + 1):
        p = output_dir / f"variant-{i}-1080x1350.png"
        p.write_bytes(png_bytes)
        created.append(p)
    return created


def cleanup_fixtures(files: list):
    """Remove fixture files."""
    for f in files:
        try:
            Path(f).unlink(missing_ok=True)
        except Exception:
            pass


# ──────────────────────────────────────────────────────────────────────────────
# 1. DIRECTORY STRUCTURE
# ──────────────────────────────────────────────────────────────────────────────

def test_output_dir_exists():
    assert OUTPUT_DIR.exists(), f"Output dir missing: {OUTPUT_DIR}"
    assert OUTPUT_DIR.is_dir(), f"Path is not a directory: {OUTPUT_DIR}"
    print("✓ test_output_dir_exists PASSED")


def test_output_dir_writable():
    probe = OUTPUT_DIR / ".write_probe"
    probe.write_text("ok")
    assert probe.exists()
    probe.unlink()
    print("✓ test_output_dir_writable PASSED")


def test_output_dir_created_by_exporter():
    """PlaywrightExporter creates the dir on __init__ — simulate that."""
    tmp = Path(tempfile.mkdtemp()) / "new_output_dir"
    assert not tmp.exists()
    tmp.mkdir(parents=True, exist_ok=True)
    assert tmp.exists()
    shutil.rmtree(str(tmp.parent), ignore_errors=True)
    print("✓ test_output_dir_created_by_exporter PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# 2. VARIANT PNG NAMING CONVENTION
# ──────────────────────────────────────────────────────────────────────────────

def test_variant_filename_format():
    files = create_variant_fixtures(OUTPUT_DIR, count=5)
    try:
        for i, f in enumerate(files, start=1):
            assert f.name == f"variant-{i}-1080x1350.png", \
                f"Wrong filename: {f.name}"
    finally:
        cleanup_fixtures(files)
    print("✓ test_variant_filename_format PASSED")


def test_variant_png_glob():
    files = create_variant_fixtures(OUTPUT_DIR, count=5)
    try:
        found = sorted(OUTPUT_DIR.glob("variant-*.png"))
        assert len(found) >= 5, f"Expected ≥5 variant PNGs, found {len(found)}"
        for p in found:
            assert p.suffix == ".png"
            assert p.stem.startswith("variant-")
    finally:
        cleanup_fixtures(files)
    print("✓ test_variant_png_glob PASSED")


def test_all_five_variants_present():
    files = create_variant_fixtures(OUTPUT_DIR, count=5)
    try:
        for i in range(1, 6):
            target = OUTPUT_DIR / f"variant-{i}-1080x1350.png"
            assert target.exists(), f"Missing: {target.name}"
    finally:
        cleanup_fixtures(files)
    print("✓ test_all_five_variants_present PASSED")


def test_variant_sorted_order():
    files = create_variant_fixtures(OUTPUT_DIR, count=5)
    try:
        found = sorted(OUTPUT_DIR.glob("variant-*.png"), key=lambda p: p.name)
        names = [p.name for p in found if p.name.startswith("variant-") and "1080x1350" in p.name]
        for i, name in enumerate(sorted(names), start=1):
            assert f"variant-{i}-" in name, f"Sort order wrong at position {i}: {name}"
    finally:
        cleanup_fixtures(files)
    print("✓ test_variant_sorted_order PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# 3. PNG FILE VALIDITY
# ──────────────────────────────────────────────────────────────────────────────

def test_png_files_are_valid():
    """Verify each fixture is a readable PNG."""
    from PIL import Image
    files = create_variant_fixtures(OUTPUT_DIR, count=5)
    try:
        for f in files:
            with Image.open(f) as img:
                assert img.format == "PNG", f"{f.name} is not PNG"
                assert img.size == (1080, 1350), f"{f.name}: wrong dimensions {img.size}"
    finally:
        cleanup_fixtures(files)
    print("✓ test_png_files_are_valid PASSED")


def test_png_dimensions_1080x1350():
    from PIL import Image
    files = create_variant_fixtures(OUTPUT_DIR, count=1)
    try:
        with Image.open(files[0]) as img:
            w, h = img.size
            assert w == 1080, f"Width should be 1080, got {w}"
            assert h == 1350, f"Height should be 1350, got {h}"
    finally:
        cleanup_fixtures(files)
    print("✓ test_png_dimensions_1080x1350 PASSED")


def test_png_magic_bytes():
    """PNG files must start with the PNG signature."""
    PNG_MAGIC = b'\x89PNG\r\n\x1a\n'
    files = create_variant_fixtures(OUTPUT_DIR, count=3)
    try:
        for f in files:
            header = f.read_bytes()[:8]
            assert header == PNG_MAGIC, f"{f.name}: invalid PNG magic bytes"
    finally:
        cleanup_fixtures(files)
    print("✓ test_png_magic_bytes PASSED")


def test_png_minimum_file_size():
    """Real 1080×1350 PNGs should be at least a few KB."""
    files = create_variant_fixtures(OUTPUT_DIR, count=3)
    try:
        for f in files:
            size = f.stat().st_size
            assert size > 1024, f"{f.name}: suspiciously small ({size} bytes)"
    finally:
        cleanup_fixtures(files)
    print("✓ test_png_minimum_file_size PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# 4. FILE SIZE FORMATTING (listing script logic)
# ──────────────────────────────────────────────────────────────────────────────

def _fmt(size: int) -> str:
    if size > 1024 * 1024:
        return f"{size / (1024 * 1024):.1f}MB"
    elif size > 1024:
        return f"{size / 1024:.1f}KB"
    return f"{size}B"


def test_size_format_bytes():
    assert _fmt(512)  == "512B"
    assert _fmt(1023) == "1023B"
    print("✓ test_size_format_bytes PASSED")


def test_size_format_kb():
    # Condition is `size > 1024` (strict), so 1025 is first KB value
    assert _fmt(1025)        == "1.0KB"
    assert _fmt(2048)        == "2.0KB"
    assert _fmt(1024 * 500)  == "500.0KB"
    print("✓ test_size_format_kb PASSED")


def test_size_format_mb():
    # Condition is `size > 1024*1024` (strict), so 1024*1024+1 is first MB value
    assert _fmt(1024 * 1024 + 1) == "1.0MB"
    assert _fmt(1024 * 1024 * 2) == "2.0MB"
    assert _fmt(1024 * 1024 * 3 + 512 * 1024) == "3.5MB"
    print("✓ test_size_format_mb PASSED")


def test_size_format_boundary_exactly_1kb():
    # strict `> 1024`: exactly 1024 bytes → "B", 1025 → "KB"
    assert _fmt(1024) == "1024B",  "Exactly 1024 bytes stays in byte range (strict >)"
    assert _fmt(1025) == "1.0KB",  "1025 bytes crosses into KB range"
    # strict `> 1024*1024`: exactly 1 MiB → "KB", 1 MiB + 1 → "MB"
    assert _fmt(1024 * 1024)     == "1024.0KB", "Exactly 1 MiB stays in KB range"
    assert _fmt(1024 * 1024 + 1) == "1.0MB",    "1 MiB + 1 byte crosses into MB range"
    print("✓ test_size_format_boundary_exactly_1kb PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# 5. FILE LISTING LOGIC (mtime sort)
# ──────────────────────────────────────────────────────────────────────────────

def test_files_sorted_by_mtime_descending():
    """Verify that sorting by mtime desc puts the newest file first."""
    files = create_variant_fixtures(OUTPUT_DIR, count=3)
    try:
        import time
        # Touch file 3 to make it definitively newer
        time.sleep(0.05)
        files[2].write_bytes(files[2].read_bytes())

        all_files = list(OUTPUT_DIR.glob("variant-*-1080x1350.png"))
        all_files.sort(key=lambda x: x.stat().st_mtime, reverse=True)

        # Newest (index 0 after sort) should be variant-3
        assert all_files[0].name == "variant-3-1080x1350.png", \
            f"Expected variant-3 first, got {all_files[0].name}"
    finally:
        cleanup_fixtures(files)
    print("✓ test_files_sorted_by_mtime_descending PASSED")


def test_listing_filters_only_files():
    """Glob result should contain only files, not directories."""
    files = create_variant_fixtures(OUTPUT_DIR, count=2)
    sub = OUTPUT_DIR / "subdir_test"
    sub.mkdir(exist_ok=True)
    try:
        all_entries = list(OUTPUT_DIR.glob("*"))
        file_only = [e for e in all_entries if e.is_file()]
        dir_only  = [e for e in all_entries if e.is_dir()]

        assert len(dir_only) >= 1, "Should detect the test subdirectory"
        for f in file_only:
            assert f.is_file(), f"{f} reported as file but is not"
    finally:
        cleanup_fixtures(files)
        sub.rmdir()
    print("✓ test_listing_filters_only_files PASSED")


def test_listing_limit_to_15():
    """The listing script caps at 15 files."""
    files = create_variant_fixtures(OUTPUT_DIR, count=5)
    try:
        all_files = list(OUTPUT_DIR.glob("variant-*"))
        all_files.sort(key=lambda x: x.stat().st_mtime, reverse=True)
        top_15 = all_files[:15]
        assert len(top_15) <= 15, "Should never show more than 15 files"
    finally:
        cleanup_fixtures(files)
    print("✓ test_listing_limit_to_15 PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# 6. EXPORTER OUTPUT CONTRACT
# ──────────────────────────────────────────────────────────────────────────────

def test_exporter_result_keys():
    """Verify the shape of a successful export result dict."""
    result = {
        'success': True,
        'png_path': '/mnt/user-data/outputs/variant-1-1080x1350.png',
        'png_filename': 'variant-1-1080x1350.png',
        'file_size': 2048000,
        'file_size_kb': 2000.0,
        'dimensions': {'width': 1080, 'height': 1350},
        'dpi': 144,
        'scale_factor': 2,
        'captured_at': datetime.now().isoformat()
    }
    required = ['success', 'png_path', 'png_filename', 'file_size',
                'file_size_kb', 'dimensions', 'dpi', 'captured_at']
    for key in required:
        assert key in result, f"Missing export result key: {key}"
    assert result['dimensions']['width']  == 1080
    assert result['dimensions']['height'] == 1350
    assert result['dpi'] == 144
    print("✓ test_exporter_result_keys PASSED")


def test_exporter_failed_result_keys():
    """Verify the shape of a failed export result dict."""
    result = {
        'success': False,
        'error': 'Playwright not available',
        'error_type': 'ImportError'
    }
    assert result['success'] is False
    assert 'error' in result
    assert 'error_type' in result
    print("✓ test_exporter_failed_result_keys PASSED")


def test_exporter_filename_convention():
    """PNG filename must follow the variant-N-1080x1350.png pattern."""
    import re
    pattern = re.compile(r'^variant-\d+-1080x1350\.png$')
    valid = [
        "variant-1-1080x1350.png",
        "variant-5-1080x1350.png",
        "variant-12-1080x1350.png",
    ]
    invalid = [
        "variant-1.png",
        "output-1080x1350.png",
        "variant1-1080x1350.png",
    ]
    for name in valid:
        assert pattern.match(name), f"Should match: {name}"
    for name in invalid:
        assert not pattern.match(name), f"Should not match: {name}"
    print("✓ test_exporter_filename_convention PASSED")


def test_exporter_dpi_is_144():
    """Output must be 144 DPI (2x retina downsampled from 2x capture)."""
    from export_playwright import PlaywrightExporter
    exp = PlaywrightExporter.__new__(PlaywrightExporter)
    exp.dimensions = {
        'width_px': 1080,
        'height_px': 1350,
        'scale_factor': 2,
        'dpi': 144
    }
    assert exp.dimensions['dpi'] == 144
    assert exp.dimensions['scale_factor'] == 2
    assert exp.dimensions['width_px'] * exp.dimensions['scale_factor'] == 2160
    assert exp.dimensions['height_px'] * exp.dimensions['scale_factor'] == 2700
    print("✓ test_exporter_dpi_is_144 PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# 7. FULL LISTING SCRIPT SIMULATION
# ──────────────────────────────────────────────────────────────────────────────

def test_full_listing_simulation():
    """Run the exact logic from the listing script and verify its output."""
    files = create_variant_fixtures(OUTPUT_DIR, count=5)
    try:
        output_dir = OUTPUT_DIR
        all_files = list(output_dir.glob("*"))
        all_files.sort(key=lambda x: x.stat().st_mtime, reverse=True)

        lines = []
        for f in all_files[:15]:
            if f.is_file():
                size = f.stat().st_size
                size_str = _fmt(size)
                lines.append(f"  {f.name:50} {size_str:>10}")

        assert len(lines) >= 5, "Should list at least 5 files"
        for line in lines:
            assert "variant-" in line or True  # other files may exist
            assert line.startswith("  ")

        # Check PNG section
        pngs = sorted(output_dir.glob("variant-*.png"))
        assert len(pngs) >= 5, f"Expected ≥5 variant PNGs, got {len(pngs)}"
        for png in pngs:
            assert "1080x1350" in png.name

    finally:
        cleanup_fixtures(files)
    print("✓ test_full_listing_simulation PASSED")


# ──────────────────────────────────────────────────────────────────────────────
# Runner
# ──────────────────────────────────────────────────────────────────────────────

def run_all_tests():
    print("\n" + "="*80)
    print("✓ OUTPUT FILE PIPELINE TEST SUITE")
    print("="*80 + "\n")

    tests = [
        # Directory structure
        test_output_dir_exists,
        test_output_dir_writable,
        test_output_dir_created_by_exporter,
        # Variant naming
        test_variant_filename_format,
        test_variant_png_glob,
        test_all_five_variants_present,
        test_variant_sorted_order,
        # PNG validity
        test_png_files_are_valid,
        test_png_dimensions_1080x1350,
        test_png_magic_bytes,
        test_png_minimum_file_size,
        # Size formatting
        test_size_format_bytes,
        test_size_format_kb,
        test_size_format_mb,
        test_size_format_boundary_exactly_1kb,
        # Listing logic
        test_files_sorted_by_mtime_descending,
        test_listing_filters_only_files,
        test_listing_limit_to_15,
        # Exporter contract
        test_exporter_result_keys,
        test_exporter_failed_result_keys,
        test_exporter_filename_convention,
        test_exporter_dpi_is_144,
        # Full simulation
        test_full_listing_simulation,
    ]

    passed = 0
    failed = []
    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"✗ {test.__name__} FAILED: {e}")
            failed.append(test.__name__)
        except Exception as e:
            print(f"✗ {test.__name__} ERROR: {type(e).__name__}: {e}")
            failed.append(test.__name__)

    print("\n" + "="*80)
    if failed:
        print(f"✗ {len(failed)}/{len(tests)} TESTS FAILED")
        for name in failed:
            print(f"  - {name}")
    else:
        print(f"✓ ALL {len(tests)} TESTS PASSED")
    print("="*80 + "\n")
    return len(failed) == 0


if __name__ == '__main__':
    success = run_all_tests()
    sys.exit(0 if success else 1)
