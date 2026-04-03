'use client'

import dynamic from 'next/dynamic'
import { colors } from '@/lib/design-system/theme'
import { deployMaterialToLive } from '@/app/actions/deployMaterial'
import materialsData from '@/lib/materials.json'
import { useState } from 'react'

const ExportBar = dynamic(() => import('@/components/ExportBar').then((mod) => mod.ExportBar), {
  ssr: false,
})

export default function MaterialsDrafts() {
  const drafts = materialsData.drafts || []

  const [selectedDraft, setSelectedDraft] = useState<(typeof drafts)[0] | null>(
    drafts.length > 0 ? drafts[0] : null
  )
  const [isDeploying, setIsDeploying] = useState(false)
  const [deployMessage, setDeployMessage] = useState<string | null>(null)

  const handleDeploy = async () => {
    if (!selectedDraft) return

    try {
      setIsDeploying(true)
      setDeployMessage('Deploying...')
      const result = await deployMaterialToLive(selectedDraft.id)

      if (result.success) {
        setDeployMessage(`✓ ${result.message}`)
        // Refresh the page after 2 seconds
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setDeployMessage(`✗ ${result.message}`)
      }
    } catch (error) {
      setDeployMessage(`✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div style={{ background: colors.ivory.light, minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar: Draft List */}
      <div
        style={{
          width: '320px',
          background: colors.base.white,
          borderRight: `1px solid ${colors.cloud.light}`,
          overflowY: 'auto',
          padding: '24px 0',
        }}
      >
        <div style={{ padding: '0 24px', marginBottom: '24px' }}>
          <h2
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: colors.slate.dark,
              margin: '0 0 8px 0',
            }}
          >
            Preview Drafts
          </h2>
          <p
            style={{
              fontSize: '12px',
              color: colors.cloud.dark,
              margin: 0,
            }}
          >
            {drafts.length} draft{drafts.length !== 1 ? 's' : ''} ready
          </p>
        </div>

        {drafts.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: colors.cloud.dark,
              fontSize: '13px',
            }}
          >
            <p style={{ margin: '0 0 8px 0' }}>No drafts yet.</p>
            <p style={{ margin: 0, fontSize: '12px', color: colors.cloud.medium }}>
              Create a new material in the staging area.
            </p>
          </div>
        ) : (
          drafts.map((draft) => (
            <button
              key={draft.id}
              onClick={() => setSelectedDraft(draft)}
              style={{
                width: '100%',
                padding: '16px 24px',
                border: 'none',
                background:
                  selectedDraft?.id === draft.id ? colors.ivory.light : 'transparent',
                borderLeft:
                  selectedDraft?.id === draft.id
                    ? `3px solid ${colors.accent.bookCloth}`
                    : '3px solid transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 200ms ease-out',
              }}
              onMouseEnter={(e) => {
                if (selectedDraft?.id !== draft.id) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = colors.ivory.light
                }
              }}
              onMouseLeave={(e) => {
                if (selectedDraft?.id !== draft.id) {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background = 'transparent'
                }
              }}
            >
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: colors.slate.dark,
                  marginBottom: '4px',
                }}
              >
                {draft.title}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: colors.cloud.dark,
                }}
              >
                {draft.type} · {new Date(draft.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
              {draft.status && (
                <div
                  style={{
                    fontSize: '10px',
                    color: colors.semantic.focus,
                    marginTop: '6px',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {draft.status}
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {/* Main: Preview Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedDraft ? (
          <>
            {/* Preview Header */}
            <header
              style={{
                background: colors.slate.dark,
                color: colors.ivory.light,
                padding: '32px 48px',
                borderBottom: `1px solid ${colors.cloud.light}`,
              }}
            >
              <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: colors.accent.bookCloth,
                        marginBottom: '12px',
                      }}
                    >
                      Material Preview
                    </div>
                    <h1
                      style={{
                        fontSize: '32px',
                        fontWeight: 700,
                        margin: '0 0 8px 0',
                      }}
                    >
                      {selectedDraft.title}
                    </h1>
                    <p style={{ fontSize: '14px', color: colors.cloud.medium, margin: 0 }}>
                      {selectedDraft.description}
                    </p>
                  </div>
                  <div
                    style={{
                      textAlign: 'right',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: colors.cloud.light,
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ marginBottom: '4px' }}>
                        <strong>{selectedDraft.type}</strong>
                      </div>
                      <div>{selectedDraft.format}</div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Export Bar */}
            <ExportBar
              materialId={selectedDraft.id}
              materialTitle={selectedDraft.title}
              elementId="material-preview"
            />

            {/* Preview Content */}
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                padding: '48px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  maxWidth: '1200px',
                  width: '100%',
                }}
              >
                {/* Material Preview Container */}
                <div id="material-preview">
                  {/* Embed the actual preview */}
                {selectedDraft.path && (
                  <div
                    style={{
                      background: colors.base.white,
                      border: `1px solid ${colors.cloud.light}`,
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '32px',
                    }}
                  >
                    <iframe
                      src={selectedDraft.path}
                      style={{
                        width: '100%',
                        height: '600px',
                        border: 'none',
                        display: 'block',
                      }}
                      title={selectedDraft.title}
                    />
                  </div>
                )}
                </div>

                {/* Validation Checklist */}
                <div
                  style={{
                    background: colors.slate.dark,
                    color: colors.ivory.light,
                    padding: '32px',
                    borderRadius: '12px',
                    marginBottom: '32px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      marginBottom: '20px',
                      margin: '0 0 20px 0',
                    }}
                  >
                    Pre-Deploy Validation Checklist
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '16px',
                    }}
                  >
                    {[
                      'Hook stops scroll (emotionally)',
                      'Reframe is clear',
                      'Proof is visual',
                      'Ecosystem shows credibility',
                      'Actions are scannable',
                      'Why It Matters is saveable',
                      'Reposition challenges assumptions',
                      'Quote is memorable',
                      'All colors from system',
                      'Contrast meets WCAG AA',
                      'Spacing is 8px grid',
                      'No default/templated effects',
                      'Feels premium (emotionally)',
                      'No spelling/grammar errors',
                      'All CTAs work',
                      'Mobile readable',
                    ].map((item) => (
                      <label
                        key={item}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          color: colors.cloud.light,
                        }}
                      >
                        <input
                          type="checkbox"
                          style={{
                            cursor: 'pointer',
                            width: '16px',
                            height: '16px',
                          }}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Meta Info */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      background: colors.base.white,
                      border: `1px solid ${colors.cloud.light}`,
                      padding: '20px',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: colors.cloud.dark,
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}
                    >
                      Created
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: colors.slate.dark,
                      }}
                    >
                      {new Date(selectedDraft.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div
                    style={{
                      background: colors.base.white,
                      border: `1px solid ${colors.cloud.light}`,
                      padding: '20px',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: colors.cloud.dark,
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}
                    >
                      Target Dwell Time
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: colors.slate.dark,
                      }}
                    >
                      {(selectedDraft as any).dwell_time_target || '8-12 sec'}
                    </div>
                  </div>

                  <div
                    style={{
                      background: colors.base.white,
                      border: `1px solid ${colors.cloud.light}`,
                      padding: '20px',
                      borderRadius: '8px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: colors.cloud.dark,
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                      }}
                    >
                      Save Rate Target
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: colors.slate.dark,
                      }}
                    >
                      {(selectedDraft as any).save_rate_target || '2-4%'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <button
                    style={{
                      padding: '12px 24px',
                      background: colors.base.white,
                      color: colors.cloud.dark,
                      border: `1px solid ${colors.cloud.light}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Back to Draft
                  </button>
                  <button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    style={{
                      padding: '12px 24px',
                      background: isDeploying ? colors.cloud.dark : colors.semantic.focus,
                      color: colors.base.white,
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: isDeploying ? 'not-allowed' : 'pointer',
                      opacity: isDeploying ? 0.7 : 1,
                      transition: 'all 200ms ease-out',
                    }}
                  >
                    {isDeploying ? 'Deploying...' : 'Deploy to Live'}
                  </button>
                  {deployMessage && (
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: deployMessage.includes('✓') ? colors.semantic.focus : colors.semantic.error,
                      }}
                    >
                      {deployMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: colors.cloud.dark,
            }}
          >
            <div>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                No drafts to preview
              </div>
              <p>Create a new material to see it here before deploying.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
