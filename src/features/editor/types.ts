import type { Editor, JSONContent } from '@tiptap/core'
import type { SaveState } from '../autosave/hooks/useAutosave'

export interface EditorConfigProps {
  initialContent?: string
  onUpdate?: (json: JSONContent, html: string) => void
}

export interface EditorContextType {
  editor: Editor | null
  isLoading: boolean
  isError: boolean
  commands: ReturnType<typeof import('./commands/editorCommands').createEditorCommands>
  saveState: SaveState
  documentTitle: string
  setDocumentTitle: (title: string) => void
}
