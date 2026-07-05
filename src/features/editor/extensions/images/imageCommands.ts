import type { Editor } from '@tiptap/core'

export const insertImageCommand = (editor: Editor, url: string) => {
  editor.chain().focus().insertContent({ type: 'image', attrs: { src: url } }).run()
}

export const removeImageCommand = (editor: Editor) => {
  editor.chain().focus().deleteSelection().run()
}

export const alignImageCommand = (editor: Editor, align: 'left' | 'center' | 'right') => {
  editor.chain().focus().updateAttributes('image', { align }).run()
}
