#!/usr/bin/env python3
"""
Master test runner for all Ultron LinkedIn content engine systems
Validates: Design System, 360BREW Scoring Algorithm
"""

import sys
import subprocess
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent


def run_test_file(test_file: str, description: str) -> bool:
    """Run a test file and return success status"""
    print(f"\n{'='*80}")
    print(f"▶ {description}")
    print(f"{'='*80}")

    test_path = SCRIPTS_DIR / test_file
    result = subprocess.run([sys.executable, str(test_path)], cwd=SCRIPTS_DIR)

    return result.returncode == 0


def main():
    """Run all test suites"""
    print("\n" + "█"*80)
    print("█  LINKEDIN CONTENT ENGINE - COMPREHENSIVE TEST SUITE")
    print("█"*80)

    tests = [
        ("test_design_system.py", "DESIGN SYSTEM TESTS (18 tests)"),
        ("test_scoring.py", "360BREW SCORING TESTS (12 tests)"),
        ("test_db_sync.py", "SUPABASE DATABASE TESTS (14 tests)"),
    ]

    results = {}
    for test_file, description in tests:
        results[description] = run_test_file(test_file, description)

    # Summary
    print("\n" + "█"*80)
    print("█  TEST SUMMARY")
    print("█"*80)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for description, success in results.items():
        status = "✓ PASSED" if success else "✗ FAILED"
        print(f"\n{status}: {description}")

    print("\n" + "-"*80)
    print(f"Total: {passed}/{total} test suites PASSED")
    print("-"*80)

    if passed == total:
        print("\n✓ ALL TESTS PASSED - System ready for deployment")
        print("\nKey validations:")
        print("  ✓ Design System: 13 colors, 10 patterns, 6 rule sections")
        print("  ✓ 360BREW Scoring: Virality, Save-worthy, Visual, System Thinking")
        print("  ✓ Color validation, forbidden styles, typography checks")
        print("  ✓ GO/REBUILD recommendations for content quality")
        print("  ✓ Supabase Sync: Variant save/fetch, batch operations, status updates")
        return 0
    else:
        print(f"\n✗ {total - passed} test suite(s) FAILED")
        return 1


if __name__ == '__main__':
    sys.exit(main())
