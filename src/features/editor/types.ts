import type { Editor, JSONContent } from '@tiptap/core'


export interface EditorConfigProps {
  initialContent?: string
  onUpdate?: (json: JSONContent, html: string) => void
}

export interface EditorContextType {
  editor: Editor | null
  isLoading: boolean
  isError: boolean
  commands: ReturnType<typeof import('./commands/editorCommands').createEditorCommands>
}
