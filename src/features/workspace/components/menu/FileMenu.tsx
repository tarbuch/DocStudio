import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FilePlus, Copy, Save, FileText, Printer, FileDown } from 'lucide-react'
import { useDocumentContext } from '../../../documents/providers/DocumentProvider'
import { createDocument, duplicateDocument, saveSnapshot } from '../../../documents/services/documentManager'
import { useExport } from '../../../export/hooks/useExport'
import { useEditorContext } from '../../../editor/providers/EditorProvider'

export const FileMenu: React.FC = () => {
  const { activeDocumentId, activeDocumentMeta, switchDocument } = useDocumentContext()
  const { editor } = useEditorContext()
  const { exportToDocx, exportToPdf, isExporting } = useExport()

  const handleNewDocument = async () => {
    const doc = await createDocument('Untitled Document', activeDocumentMeta?.folderId || null)
    await switchDocument(doc.id)
  }

  const handleDuplicate = async () => {
    if (!activeDocumentId) return
    const doc = await duplicateDocument(activeDocumentId)
    if (doc) {
      await switchDocument(doc.id)
    }
  }

  const handleSaveSnapshot = async () => {
    if (!activeDocumentId || !editor) return
    await saveSnapshot(activeDocumentId, { content: editor.getJSON() })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-2 py-0.5 text-xs font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
        File
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={handleNewDocument}>
          <FilePlus className="mr-2 h-4 w-4" />
          <span>New Document</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate} disabled={!activeDocumentId}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSaveSnapshot} disabled={!activeDocumentId || !editor}>
          <Save className="mr-2 h-4 w-4" />
          <span>Save Snapshot</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToPdf} disabled={!editor || isExporting}>
          <FileDown className="mr-2 h-4 w-4" />
          <span>Export PDF</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToDocx} disabled={!editor || isExporting}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Export DOCX</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          <span>Print</span>
          <DropdownMenuShortcut>Ctrl+P</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
