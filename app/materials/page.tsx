'use client'

import { colors, typography, spacing } from '@/lib/design-system/theme'

export default function Materials() {
  return (
    <div style={{ background: colors.ivory.light, color: colors.slate.light, minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          background: colors.slate.dark,
          color: colors.ivory.light,
          padding: '64px 80px',
          borderBottom: `1px solid ${colors.cloud.light}`,
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 700,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            Design System & Materials
          </h1>
          <p style={{ fontSize: '18px', color: colors.cloud.medium, maxWidth: '600px' }}>
            Complete design system, playbook, and marketing assets built on the Anthropic design language.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 80px' }}>
        {/* Design System Section */}
        <section style={{ marginBottom: '80px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 600,
              marginBottom: '32px',
              color: colors.slate.dark,
            }}
          >
            🎨 Design System
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            {/* Design Tokens */}
            <div
              style={{
                background: colors.base.white,
                border: `1px solid ${colors.cloud.light}`,
                borderRadius: '8px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                Design Tokens
              </h3>
              <p style={{ fontSize: '14px', color: colors.cloud.dark, marginBottom: '16px' }}>
                Master token definitions in JSON format. Includes colors, typography, spacing, and motion.
              </p>
              <a
                href="/design-tokens/tokens.json"
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  background: colors.semantic.focus,
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                View tokens.json
              </a>
            </div>

            {/* Theme TypeScript */}
            <div
              style={{
                background: colors.base.white,
                border: `1px solid ${colors.cloud.light}`,
                borderRadius: '8px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                TypeScript Theme
              </h3>
              <p style={{ fontSize: '14px', color: colors.cloud.dark, marginBottom: '16px' }}>
                Type-safe theme utilities and color/typography/spacing exports for React components.
              </p>
              <code
                style={{
                  fontSize: '12px',
                  color: colors.slate.light,
                  background: colors.ivory.medium,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                import {'{colors, spacing}'} from '@/lib/design-system/theme'
              </code>
            </div>

            {/* Tailwind Config */}
            <div
              style={{
                background: colors.base.white,
                border: `1px solid ${colors.cloud.light}`,
                borderRadius: '8px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                Tailwind CSS Config
              </h3>
              <p style={{ fontSize: '14px', color: colors.cloud.dark, marginBottom: '16px' }}>
                Tailwind configuration with all design tokens. Use Anthropic colors and spacing directly.
              </p>
              <code
                style={{
                  fontSize: '12px',
                  color: colors.slate.light,
                  background: colors.ivory.medium,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                className="bg-slate-dark text-ivory-light"
              </code>
            </div>

            {/* Global Styles */}
            <div
              style={{
                background: colors.base.white,
                border: `1px solid ${colors.cloud.light}`,
                borderRadius: '8px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                Global Styles & CSS
              </h3>
              <p style={{ fontSize: '14px', color: colors.cloud.dark, marginBottom: '16px' }}>
                Base styles, CSS variables, and component utilities. Includes dark mode support.
              </p>
              <code
                style={{
                  fontSize: '12px',
                  color: colors.slate.light,
                  background: colors.ivory.medium,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                var(--color-slate-dark) /* #191919 */
              </code>
            </div>
          </div>
        </section>

        {/* Design Guides Section */}
        <section style={{ marginBottom: '80px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 600,
              marginBottom: '32px',
              color: colors.slate.dark,
            }}
          >
            📚 Design Guides & Skills
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '24px',
            }}
          >
            {/* Design Skill */}
            <div
              style={{
                background: colors.base.white,
                border: `1px solid ${colors.cloud.light}`,
                borderRadius: '8px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                Design Skill (6000+ words)
              </h3>
              <p style={{ fontSize: '14px', color: colors.cloud.dark, marginBottom: '16px' }}>
                Comprehensive rulebook: palette rules, typography, spacing, components, dark mode, what to preserve/avoid, and application guidelines.
              </p>
              <a
                href="/design-tokens/DESIGN_SKILL.md"
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  background: colors.accent.bookCloth,
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Read Full Guide
              </a>
            </div>

            {/* Design Playbook */}
            <div
              style={{
                background: colors.base.white,
                border: `1px solid ${colors.cloud.light}`,
                borderRadius: '8px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                Design Playbook (2000+ words)
              </h3>
              <p style={{ fontSize: '14px', color: colors.cloud.dark, marginBottom: '16px' }}>
                Quick reference playbook: decision trees, color combos, typography templates, component code, common mistakes & fixes.
              </p>
              <a
                href="/design-tokens/DESIGN_PLAYBOOK.md"
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  background: colors.accent.bookCloth,
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                Read Playbook
              </a>
            </div>

            {/* Quick Reference */}
            <div
              style={{
                background: colors.base.white,
                border: `1px solid ${colors.cloud.light}`,
                borderRadius: '8px',
                padding: '32px',
              }}
            >
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>
                Quick Reference JSON
              </h3>
              <p style={{ fontSize: '14px', color: colors.cloud.dark, marginBottom: '16px' }}>
                Machine-readable design definitions. Colors, typography, components, focus rings, philosophy. For validation and lookup.
              </p>
              <a
                href="/design-tokens/QUICK_REFERENCE.json"
                style={{
                  display: 'inline-block',
                  padding: '10px 16px',
                  background: colors.accent.bookCloth,
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                View Reference
              </a>
            </div>
          </div>
        </section>

        {/* Marketing Assets Section */}
        <section style={{ marginBottom: '80px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 600,
              marginBottom: '32px',
              color: colors.slate.dark,
            }}
          >
            🎬 Marketing Assets
          </h2>

          <div
            style={{
              background: colors.slate.medium,
              border: `1px solid ${colors.slate.light}`,
              borderRadius: '12px',
              padding: '32px',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 600,
                marginBottom: '12px',
                color: colors.ivory.light,
              }}
            >
              Claude Interactive Connectors — LinkedIn Infographic
            </h3>
            <p
              style={{
                fontSize: '14px',
                color: colors.cloud.light,
                marginBottom: '20px',
                lineHeight: 1.6,
              }}
            >
              Premium 1080×1350px founder-facing asset. Strategic positioning: Claude moves from
              text-only to interface-backed execution. 8 information zones. Dark Anthropic theme.
              Saveable, controversy-driven, operator-grade.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <a
                href="/claude-connectors-infographic.html"
                target="_blank"
                style={{
                  display: 'inline-block',
                  padding: '12px 20px',
                  background: colors.semantic.focus,
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Open Interactive Preview
              </a>
              <a
                href="/INFOGRAPHIC_SPEC.md"
                style={{
                  display: 'inline-block',
                  padding: '12px 20px',
                  background: colors.slate.light,
                  color: colors.cloud.light,
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                View Specification
              </a>
            </div>

            <details style={{ cursor: 'pointer' }}>
              <summary
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: colors.cloud.medium,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  padding: '8px 0',
                }}
              >
                ▼ Asset Details
              </summary>
              <div
                style={{
                  marginTop: '16px',
                  fontSize: '13px',
                  color: colors.cloud.light,
                  lineHeight: 1.6,
                }}
              >
                <p style={{ marginBottom: '12px' }}>
                  <strong>Format:</strong> 1080×1350px portrait (4:5 LinkedIn ratio)
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Theme:</strong> Dark (Slate Dark bg, premium stop-scroll)
                </p>
                <p style={{ marginBottom: '12px' }}>
                  <strong>8 Information Zones:</strong>
                </p>
                <ul style={{ marginLeft: '20px', marginBottom: '12px' }}>
                  <li>Hook: "Most teams still think AI should respond."</li>
                  <li>Reframe: What changed (live interfaces in conversation)</li>
                  <li>UI Modes: Inline cards vs. fullscreen views</li>
                  <li>Ecosystem: 8 live connectors</li>
                  <li>Actions: 8 capability verbs</li>
                  <li>Why It Matters: 4 saveable bullets</li>
                  <li>Founders Wrong: Reframe positioning</li>
                  <li>Quote: Bottom-line memorable statement</li>
                </ul>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Design System:</strong> Anthropic native (Slate/Cloud/Ivory/BookCloth)
                </p>
                <p>
                  <strong>Export:</strong> Open in browser, take screenshot, upload to LinkedIn.
                </p>
              </div>
            </details>
          </div>
        </section>

        {/* Color Palette */}
        <section style={{ marginBottom: '80px' }}>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 600,
              marginBottom: '32px',
              color: colors.slate.dark,
            }}
          >
            🎨 Color Palette Reference
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              { name: 'Slate Dark', hex: '#191919', color: colors.slate.dark },
              { name: 'Slate Medium', hex: '#262625', color: colors.slate.medium },
              { name: 'Slate Light', hex: '#40403E', color: colors.slate.light },
              { name: 'Cloud Dark', hex: '#666663', color: colors.cloud.dark },
              { name: 'Cloud Medium', hex: '#91918D', color: colors.cloud.medium },
              { name: 'Cloud Light', hex: '#BFBFBA', color: colors.cloud.light },
              { name: 'Ivory Dark', hex: '#E5E4DF', color: colors.ivory.dark },
              { name: 'Ivory Medium', hex: '#F0F0EB', color: colors.ivory.medium },
              { name: 'Ivory Light', hex: '#FAFAF7', color: colors.ivory.light },
              { name: 'Book Cloth', hex: '#CC785C', color: colors.accent.bookCloth },
              { name: 'Kraft', hex: '#D4A27F', color: colors.accent.kraft },
              { name: 'Manilla', hex: '#EBDBBC', color: colors.accent.manilla },
              { name: 'Focus', hex: '#2D8AF7', color: colors.semantic.focus },
              { name: 'Error', hex: '#EF343B', color: colors.semantic.error },
            ].map((color) => (
              <div
                key={color.hex}
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: `1px solid ${colors.cloud.light}`,
                }}
              >
                <div
                  style={{
                    background: color.color,
                    height: '80px',
                  }}
                />
                <div style={{ padding: '12px', background: colors.base.white }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                    {color.name}
                  </div>
                  <code
                    style={{
                      fontSize: '11px',
                      color: colors.cloud.dark,
                      fontFamily: 'monospace',
                    }}
                  >
                    {color.hex}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <div
            style={{
              background: colors.slate.dark,
              color: colors.ivory.light,
              padding: '48px',
              borderRadius: '12px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>
              Ready to Use the Design System?
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: colors.cloud.light,
                marginBottom: '24px',
                maxWidth: '600px',
                margin: '0 auto 24px',
              }}
            >
              Start with the Design Playbook for quick decisions, then reference the comprehensive
              Skill guide. All materials use the Anthropic design language.
            </p>
            <a
              href="/design-tokens/DESIGN_PLAYBOOK.md"
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                background: colors.accent.bookCloth,
                color: 'white',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Get Started with Playbook
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: colors.slate.dark,
          color: colors.cloud.medium,
          padding: '32px 80px',
          borderTop: `1px solid ${colors.slate.light}`,
          fontSize: '13px',
          textAlign: 'center',
          marginTop: '80px',
        }}
      >
        <p>
          Anthropic Design System · Extracted from{' '}
          <a
            href="https://figma.com/design/LUTXTXfdytisPxDqAJmPFw"
            target="_blank"
            style={{ color: colors.semantic.focus, textDecoration: 'none' }}
          >
            Anthropic UI Kit Community
          </a>{' '}
          · 2025
        </p>
      </footer>
    </div>
  )
}
