import StarterKit from '@tiptap/starter-kit'

/**
 * Extension Registry centralizes all Tiptap extensions.
 * This prevents the useEditorConfig hook from bloating when we add more extensions.
 */
export const getExtensions = () => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
]
