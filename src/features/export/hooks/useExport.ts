import { useState, useCallback, useMemo } from 'react'
import { useEditorContext } from '../../editor/providers/EditorProvider'
import { useDocumentContext } from '../../documents/providers/DocumentProvider'

import { BrowserAssetResolver } from '../utils/assetResolver'
import type { ExportState, ExportResult } from '../types'

export const useExport = () => {
  const { editor } = useEditorContext()
  const { activeDocumentMeta } = useDocumentContext()
  const documentTitle = activeDocumentMeta?.title || 'Untitled Document'
  const [exportState, setExportState] = useState<ExportState>('idle')
  const [lastResult, setLastResult] = useState<ExportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Memoize BrowserAssetResolver to avoid recreating it
  const assetResolver = useMemo(() => new BrowserAssetResolver(), [])

  const reset = useCallback(() => {
    setExportState('idle')
    setError(null)
    setLastResult(null)
  }, [])

  const handleExportDocx = useCallback(async () => {
    if (!editor) return

    try {
      setExportState('exporting')
      setError(null)
      const { executeExport } = await import('../services/exportEngine')
      
      const content = editor.getJSON()
      
      // Temporary stub configuration until Phase 11.6
      const configuration = {
        version: 1 as const,
        format: 'docx' as const,
        pageSetup: {
          size: 'A4' as const,
          orientation: 'portrait' as const,
          margins: { top: 72, right: 72, bottom: 72, left: 72 }
        },
        features: {
          header: {},
          footer: {},
          watermark: { enabled: false, text: '', opacity: 0.2, rotation: -45, color: '#000000' },
          pageNumbers: { enabled: true, position: 'bottom-right' as const }
        }
      }
      
      const result = await executeExport(
        activeDocumentMeta?.id || 'temp',
        documentTitle,
        configuration,
        content,
        { assetResolver }
      )
      
      setLastResult(result)

      if (result.success) {
        setExportState('success')
        setTimeout(() => reset(), 2000)
      } else {
        setExportState('error')
        setError(result.error || 'Export failed validation or pipeline error')
      }
    } catch (err) {
      console.error('Export failed:', err)
      setExportState('error')
      setError(err instanceof Error ? err.message : 'Unknown export error')
    }
  }, [editor, activeDocumentMeta, documentTitle, assetResolver, reset])

  return {
    exportState,
    exportToDocx: handleExportDocx,
    isExporting: exportState === 'exporting',
    error,
    lastResult,
    reset,
  }
}
