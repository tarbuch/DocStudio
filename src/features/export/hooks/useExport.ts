import { useState, useCallback } from 'react'
import { useEditorContext } from '../../editor/providers/EditorProvider'
import { executeExport } from '../services/exportEngine'
import { SupportedExportFormats } from '../constants/export'
import type { ExportState, ExportResult } from '../types'

export const useExport = () => {
  const { editor, documentTitle } = useEditorContext()
  const [exportState, setExportState] = useState<ExportState>('idle')
  const [lastResult, setLastResult] = useState<ExportResult | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      
      const content = editor.getJSON()
      const result = await executeExport(SupportedExportFormats.DOCX, content, documentTitle)
      
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
  }, [editor, documentTitle, reset])

  return {
    exportState,
    exportToDocx: handleExportDocx,
    isExporting: exportState === 'exporting',
    error,
    lastResult,
    reset,
  }
}
