'use client'

import { colors } from '@/lib/design-system/theme'
import { useState } from 'react'

interface ExportOptions {
  format: 'png' | 'pdf'
  scale: '1x' | '2x'
  dpi: 144 | 72
}

export function ExportBar({
  materialId,
  materialTitle,
  elementId = 'material-preview',
}: {
  materialId: string
  materialTitle: string
  elementId?: string
}) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<string | null>(null)
  const [options, setOptions] = useState<ExportOptions>({
    format: 'png',
    scale: '2x',
    dpi: 144,
  })

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setExportStatus('Preparing export...')

      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`)
      }

      // Dynamically load html2canvas and jsPDF
      const [html2canvas, jsPDF] = await Promise.all([
        import('html2canvas').then((m) => m.default),
        import('jspdf').then((m) => m.jsPDF),
      ])

      const scale = options.scale === '2x' ? 2 : 1
      const width = 1080 * scale
      const height = 1350 * scale

      setExportStatus(`Capturing at ${scale}x resolution...`)

      const canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${materialId}-${timestamp}`

      if (options.format === 'png') {
        setExportStatus('Generating PNG...')
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `${filename}.png`
        link.click()
      } else {
        setExportStatus('Generating PDF...')
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [1080, 1350],
          compress: true,
        })
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, 1080, 1350)
        pdf.save(`${filename}.pdf`)
      }

      setExportStatus('Export complete!')
      setTimeout(() => setExportStatus(null), 3000)
    } catch (error) {
      setExportStatus(`Error: ${error instanceof Error ? error.message : 'Export failed'}`)
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div
      style={{
        background: colors.slate.dark,
        color: colors.ivory.light,
        padding: '16px 24px',
        borderBottom: `1px solid ${colors.slate.light}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      <div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: colors.accent.bookCloth,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '4px',
          }}
        >
          Export Material
        </div>
        <div style={{ fontSize: '13px' }}>{materialTitle}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Format Select */}
        <select
          value={options.format}
          onChange={(e) => setOptions({ ...options, format: e.target.value as 'png' | 'pdf' })}
          disabled={isExporting}
          style={{
            padding: '6px 12px',
            background: colors.slate.medium,
            color: colors.ivory.light,
            border: `1px solid ${colors.slate.light}`,
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: isExporting ? 'not-allowed' : 'pointer',
          }}
        >
          <option value="png">PNG</option>
          <option value="pdf">PDF</option>
        </select>

        {/* Scale Select */}
        <select
          value={options.scale}
          onChange={(e) => setOptions({ ...options, scale: e.target.value as '1x' | '2x' })}
          disabled={isExporting}
          style={{
            padding: '6px 12px',
            background: colors.slate.medium,
            color: colors.ivory.light,
            border: `1px solid ${colors.slate.light}`,
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 500,
            cursor: isExporting ? 'not-allowed' : 'pointer',
          }}
        >
          <option value="1x">1x</option>
          <option value="2x">2x (Retina)</option>
        </select>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          style={{
            padding: '8px 20px',
            background: isExporting ? colors.cloud.dark : colors.semantic.focus,
            color: colors.base.white,
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: isExporting ? 'not-allowed' : 'pointer',
            transition: 'all 200ms ease-out',
            opacity: isExporting ? 0.7 : 1,
          }}
        >
          {isExporting ? 'Exporting...' : 'Download'}
        </button>

        {/* Status */}
        {exportStatus && (
          <div
            style={{
              fontSize: '12px',
              color: exportStatus.includes('Error')
                ? colors.semantic.error
                : colors.accent.bookCloth,
              fontWeight: 500,
              minWidth: '200px',
            }}
          >
            {exportStatus}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExportBar
