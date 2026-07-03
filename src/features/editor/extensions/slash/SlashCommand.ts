import { Extension, Editor } from '@tiptap/core'
import type { Range } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'
import { slashCommandSuggestion } from './slashCommandSuggestion'

export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: any }) => {
          props.command({ editor, range })
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        ...slashCommandSuggestion,
      }),
    ]
  },
})
