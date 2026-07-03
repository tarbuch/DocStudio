import type { Editor } from '@tiptap/react'

/**
 * Editor Commands layer.
 * Encapsulates Tiptap's imperative API so that the UI components
 * do not need to be tightly coupled to Tiptap internals.
 */
export const createEditorCommands = (editor: Editor | null) => {
  const run = (fn: (chain: ReturnType<Editor['chain']>) => void) => {
    if (editor) {
      const chain = editor.chain().focus()
      fn(chain)
      chain.run()
    }
  }

  return {
    undo: () => run((c) => c.undo()),
    redo: () => run((c) => c.redo()),
    canUndo: () => editor?.can().undo() ?? false,
    canRedo: () => editor?.can().redo() ?? false,

    toggleBold: () => run((c) => c.toggleBold()),
    toggleItalic: () => run((c) => c.toggleItalic()),
    toggleUnderline: () => run((c) => c.toggleUnderline()),
    toggleStrike: () => run((c) => c.toggleStrike()),
    toggleLink: () => {
      // Placeholder for Phase 3C requirement
      console.log('Link UI coming soon')
    },
    
    setParagraph: () => run((c) => c.setParagraph()),
    toggleHeading: (level: 1 | 2 | 3) => run((c) => c.toggleHeading({ level })),
    toggleBulletList: () => run((c) => c.toggleBulletList()),
    toggleOrderedList: () => run((c) => c.toggleOrderedList()),

    isBold: () => editor?.isActive('bold') ?? false,
    isItalic: () => editor?.isActive('italic') ?? false,
    isUnderline: () => editor?.isActive('underline') ?? false,
    isStrike: () => editor?.isActive('strike') ?? false,
    isParagraph: () => editor?.isActive('paragraph') ?? false,
    isHeading: (level: 1 | 2 | 3) => editor?.isActive('heading', { level }) ?? false,
    isBulletList: () => editor?.isActive('bulletList') ?? false,
    isOrderedList: () => editor?.isActive('orderedList') ?? false,

    insertTable: () => editor?.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: true }).run(),
    canInsertTable: () => editor?.can().insertTable({ rows: 2, cols: 2, withHeaderRow: true }) ?? false,

    insertRowBefore: () => editor?.chain().focus().addRowBefore().run(),
    insertRowAfter: () => editor?.chain().focus().addRowAfter().run(),
    deleteRow: () => editor?.chain().focus().deleteRow().run(),

    insertColumnBefore: () => editor?.chain().focus().addColumnBefore().run(),
    insertColumnAfter: () => editor?.chain().focus().addColumnAfter().run(),
    deleteColumn: () => editor?.chain().focus().deleteColumn().run(),

    toggleHeaderRow: () => editor?.chain().focus().toggleHeaderRow().run(),
    deleteTable: () => editor?.chain().focus().deleteTable().run(),

    canModifyTable: () => editor?.isActive('table') ?? false,

    getWordCount: () => editor?.storage.characterCount?.words() ?? 0,
    getCharacterCount: () => editor?.storage.characterCount?.characters() ?? 0,
  }
}
