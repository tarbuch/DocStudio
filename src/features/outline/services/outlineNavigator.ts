import type { Editor } from '@tiptap/core'

/**
 * Pure service for navigating the document to a specific outline position.
 * Independent of React components.
 */
export function navigateToHeading(editor: Editor, position: number): void {
  // 1. Set text selection first so focus works correctly
  editor.commands.setTextSelection(position)
  
  // 2. Locate DOM element and scroll into view smoothly
  try {
    const resolvedPos = editor.view.domAtPos(position)
    const domNode = resolvedPos.node

    if (domNode instanceof Element) {
      domNode.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else if (domNode.parentElement) {
      domNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // Fallback
      editor.commands.scrollIntoView()
    }
  } catch (e) {
    console.warn('Failed to find DOM node for heading navigation', e)
    // Fallback
    editor.commands.scrollIntoView()
  }

  // 3. Ensure editor is focused
  editor.commands.focus()
}
