import { useState, useCallback } from 'react'
import { useEditorContext } from '../../editor/providers/EditorProvider'
import { exportToDocx } from '../exporters/docxExporter'
import type { ExportState } from '../types'

export const useExport = () => {
  const { editor, documentTitle } = useEditorContext()
  const [exportState, setExportState] = useState<ExportState>('idle')
  const [error, setError] = useState<string | null>(null)

  const reset = useCallback(() => {
    setExportState('idle')
    setError(null)
  }, [])

  const handleExportDocx = useCallback(async () => {
    if (!editor) return

    try {
      setExportState('exporting')
      setError(null)
      
      const content = editor.getJSON()
      await exportToDocx(content, documentTitle)
      
      setExportState('success')
      
      // Reset back to idle after a short delay for UI purposes
      setTimeout(() => reset(), 2000)
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
    reset,
  }
}
