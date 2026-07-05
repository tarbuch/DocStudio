import { useEditorContext } from '../../providers/EditorProvider'

export const useTableState = () => {
  const { editor, commands } = useEditorContext()

  // Track if we are inside a table using the commands layer
  // We don't use React state for every selection update to avoid re-rendering
  // instead we rely on Tiptap's React integration to re-render the BubbleMenu
  const isActive = commands.canModifyTable()

  return {
    isActive,
    editor,
    commands,
  }
}
