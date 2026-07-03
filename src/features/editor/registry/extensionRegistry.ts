import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'
import { SlashCommand } from '../extensions/slash/SlashCommand'

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
  Underline,
  CharacterCount,
  SlashCommand,
]

