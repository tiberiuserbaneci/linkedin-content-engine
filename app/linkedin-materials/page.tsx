'use client'

import { colors } from '@/lib/design-system/theme'
import materialsData from '@/lib/materials.json'
import { useState } from 'react'

export default function LinkedInMaterials() {
  const [filter, setFilter] = useState<string>('all')

  const { materials, templates } = materialsData
  const allMaterials = materials.map((m) => ({ ...m, isTemplate: false }))

  const filteredMaterials =
    filter === 'all'
      ? allMaterials
      : allMaterials.filter((m) => m.type === filter || (m as any).tags?.includes(filter))

  const sortedMaterials = [...filteredMaterials].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div style={{ background: colors.ivory.light, minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          background: colors.slate.dark,
          color: colors.ivory.light,
          padding: '64px 80px',
          borderBottom: `1px solid ${colors.cloud.light}`,
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: colors.accent.bookCloth,
              }}
            >
              LinkedIn Materials Library
            </span>
          </div>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 700,
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}
          >
            Content Assets
          </h1>
          <p style={{ fontSize: '16px', color: colors.cloud.medium, maxWidth: '700px' }}>
            Premium, founder-facing LinkedIn assets. Organized by date, type, and strategic positioning.
            All materials built on the Anthropic design system.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '64px 80px' }}>
        {/* Filters & Stats */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '48px',
            gap: '40px',
          }}
        >
          {/* Filter Chips */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: colors.cloud.dark,
                marginBottom: '12px',
              }}
            >
              Filter by Type
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['all', 'infographic', 'announcement', 'case-study'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border:
                      filter === tag
                        ? `2px solid ${colors.accent.bookCloth}`
                        : `1px solid ${colors.cloud.light}`,
                    background: filter === tag ? colors.accent.manilla : colors.base.white,
                    color: filter === tag ? colors.slate.dark : colors.cloud.dark,
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              background: colors.slate.dark,
              color: colors.ivory.light,
              padding: '20px 28px',
              borderRadius: '8px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
              {sortedMaterials.length}
            </div>
            <div style={{ fontSize: '12px', color: colors.cloud.medium, textTransform: 'uppercase' }}>
              Materials Ready
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        {sortedMaterials.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '24px',
              marginBottom: '64px',
            }}
          >
            {sortedMaterials.map((material) => (
              <div
                key={material.id}
                style={{
                  background: colors.base.white,
                  border: `1px solid ${colors.cloud.light}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 200ms ease-out',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.boxShadow = `0 8px 24px rgba(25,25,25,0.12)`
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}
              >
                {/* Preview */}
                <div
                  style={{
                    background: colors.slate.dark,
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: `1px solid ${colors.cloud.light}`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      color: colors.cloud.medium,
                      textAlign: 'center',
                      padding: '24px',
                    }}
                  >
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                      {material.format.split('×')[0]}
                    </div>
                    <div>{material.format}</div>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: colors.cloud.dark }}>
                      {material.theme} theme • {material.zones} zones
                    </div>
                  </div>
                  {material.status === 'ready' && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: colors.semantic.focus,
                        color: colors.base.white,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '10px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      Ready
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                  <div
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: colors.accent.bookCloth,
                      marginBottom: '8px',
                    }}
                  >
                    {material.type}
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: colors.slate.dark,
                      marginBottom: '8px',
                      lineHeight: 1.3,
                    }}
                  >
                    {material.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '13px',
                      color: colors.cloud.dark,
                      marginBottom: '16px',
                      lineHeight: 1.5,
                    }}
                  >
                    {material.description}
                  </p>

                  {/* Hook Quote */}
                  {(material as any).hook && (
                    <div
                      style={{
                        background: colors.ivory.medium,
                        padding: '12px',
                        borderRadius: '6px',
                        borderLeft: `3px solid ${colors.accent.bookCloth}`,
                        marginBottom: '16px',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '12px',
                          fontStyle: 'italic',
                          color: colors.slate.light,
                          lineHeight: 1.4,
                        }}
                      >
                        "{(material as any).hook}"
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {(material as any).tags && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {(material as any).tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          style={{
                            fontSize: '10px',
                            color: colors.cloud.dark,
                            background: colors.ivory.light,
                            padding: '3px 8px',
                            borderRadius: '3px',
                            border: `1px solid ${colors.cloud.light}`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div
                    style={{
                      fontSize: '11px',
                      color: colors.cloud.medium,
                      paddingTop: '12px',
                      borderTop: `1px solid ${colors.cloud.light}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <span>{new Date(material.date).toLocaleDateString('en-US')}</span>
                    <span>{material.platform}</span>
                  </div>

                  {/* CTA */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={material.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        background: colors.semantic.focus,
                        color: colors.base.white,
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: 600,
                        textAlign: 'center',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Preview
                    </a>
                    {material.spec && (
                      <a
                        href={material.spec}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          background: colors.base.white,
                          color: colors.cloud.dark,
                          border: `1px solid ${colors.cloud.light}`,
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          textAlign: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        Spec
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 40px',
              color: colors.cloud.dark,
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
              No materials found
            </div>
            <p>Try a different filter or check back soon for new assets.</p>
          </div>
        )}

        {/* Templates Section */}
        <section>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 600,
              marginBottom: '32px',
              color: colors.slate.dark,
            }}
          >
            Asset Templates
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {templates.map((template) => (
              <div
                key={template.id}
                style={{
                  background: colors.base.white,
                  border: `1px solid ${colors.cloud.light}`,
                  borderRadius: '8px',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: colors.slate.dark,
                    marginBottom: '8px',
                  }}
                >
                  {template.name}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: colors.cloud.dark,
                    marginBottom: '12px',
                    lineHeight: 1.4,
                  }}
                >
                  {template.description}
                </p>
                <div style={{ fontSize: '12px', color: colors.cloud.medium }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>Format:</strong> {template.format}
                  </div>
                  <div>
                    <strong>Zones:</strong> {template.zones}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          background: colors.slate.dark,
          color: colors.cloud.medium,
          padding: '40px 80px',
          borderTop: `1px solid ${colors.slate.light}`,
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '80px',
        }}
      >
        <p>
          LinkedIn Materials Library · Built with Anthropic Design System · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
