import { useEditor } from '@tiptap/react'
import { getExtensions } from '../registry/extensionRegistry'
import { EDITOR_CONSTANTS } from '../constants/editorConstants'
import type { EditorConfigProps } from '../types'

export const useEditorConfig = ({ initialContent, onUpdate }: EditorConfigProps = {}) => {
  const editor = useEditor({
    extensions: getExtensions(),
    content: initialContent || '',
    editorProps: {
      attributes: {
        class: EDITOR_CONSTANTS.DEFAULT_CLASS_NAMES,
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getJSON(), editor.getHTML())
      }
    },
    immediatelyRender: false,
  })

  return editor
}
