import { useState, useCallback } from 'react'
import { useEditorContext } from '../../editor/providers/EditorProvider'
import { exportToDocx } from '../exporters/docxExporter'
import type { ExportState } from '../types'

export const useExport = () => {
  const { editor, documentTitle } = useEditorContext()
  const [exportState, setExportState] = useState<ExportState>('idle')

  const handleExportDocx = useCallback(async () => {
    if (!editor) return

    try {
      setExportState('exporting')
      
      const content = editor.getJSON()
      await exportToDocx(content, documentTitle)
      
      setExportState('success')
      
      // Reset back to idle after a short delay for UI purposes
      setTimeout(() => setExportState('idle'), 2000)
    } catch (error) {
      console.error('Export failed:', error)
      setExportState('error')
      
      // Reset back to idle after a short delay
      setTimeout(() => setExportState('idle'), 3000)
    }
  }, [editor, documentTitle])

  return {
    exportState,
    exportToDocx: handleExportDocx,
    isExporting: exportState === 'exporting',
  }
}
