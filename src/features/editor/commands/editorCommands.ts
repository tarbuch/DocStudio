import type { Editor } from '@tiptap/react'

/**
 * Editor Commands layer.
 * Encapsulates Tiptap's imperative API so that the UI components
 * do not need to be tightly coupled to Tiptap internals.
 */
export const createEditorCommands = (editor: Editor | null) => ({
  toggleBold: () => {
    if (editor) {
      editor.chain().focus().toggleBold().run()
    }
  },
  toggleItalic: () => {
    if (editor) {
      editor.chain().focus().toggleItalic().run()
    }
  },
  toggleHeading: (level: 1 | 2 | 3) => {
    if (editor) {
      editor.chain().focus().toggleHeading({ level }).run()
    }
  },
  isBold: () => editor?.isActive('bold') ?? false,
  isItalic: () => editor?.isActive('italic') ?? false,
  isHeading: (level: 1 | 2 | 3) => editor?.isActive('heading', { level }) ?? false,
})
