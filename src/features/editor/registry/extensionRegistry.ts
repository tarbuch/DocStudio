import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
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
  Table.configure({
    resizable: false, // Phase 4.1 Milestone 1: No resizing
    HTMLAttributes: {
      class: 'my-4 w-full border-collapse border border-border',
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
  SlashCommand,
]

