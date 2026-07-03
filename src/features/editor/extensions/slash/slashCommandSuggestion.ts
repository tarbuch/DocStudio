import { ReactRenderer } from '@tiptap/react'
import { Editor } from '@tiptap/core'
import type { Range } from '@tiptap/core'
import tippy from 'tippy.js'
import type { Instance as TippyInstance } from 'tippy.js'
import type { SuggestionOptions } from '@tiptap/suggestion'
import { createEditorCommands } from '../../commands/editorCommands'
import { SlashMenuList } from '../../components/toolbar/slashMenu/SlashMenuList'
import { 
  Heading1, Heading2, Heading3, 
  Type, List, ListOrdered, 
  Table, ImageIcon 
} from 'lucide-react'

export interface SlashCommandItem {
  title: string
  description: string
  icon: React.ElementType
  command: (props: { editor: Editor; range: Range }) => void
}

export const slashCommandSuggestion: Omit<SuggestionOptions, 'editor'> = {
  items: ({ query }): SlashCommandItem[] => {
    return [
      {
        title: 'Text',
        description: 'Just start writing with plain text.',
        icon: Type,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const commands = createEditorCommands(editor)
          editor.chain().focus().deleteRange(range).run()
          commands.setParagraph()
        },
      },
      {
        title: 'Heading 1',
        description: 'Big section heading.',
        icon: Heading1,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const commands = createEditorCommands(editor)
          editor.chain().focus().deleteRange(range).run()
          commands.toggleHeading(1)
        },
      },
      {
        title: 'Heading 2',
        description: 'Medium section heading.',
        icon: Heading2,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const commands = createEditorCommands(editor)
          editor.chain().focus().deleteRange(range).run()
          commands.toggleHeading(2)
        },
      },
      {
        title: 'Heading 3',
        description: 'Small section heading.',
        icon: Heading3,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const commands = createEditorCommands(editor)
          editor.chain().focus().deleteRange(range).run()
          commands.toggleHeading(3)
        },
      },
      {
        title: 'Bullet List',
        description: 'Create a simple bulleted list.',
        icon: List,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const commands = createEditorCommands(editor)
          editor.chain().focus().deleteRange(range).run()
          commands.toggleBulletList()
        },
      },
      {
        title: 'Numbered List',
        description: 'Create a list with numbering.',
        icon: ListOrdered,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const commands = createEditorCommands(editor)
          editor.chain().focus().deleteRange(range).run()
          commands.toggleOrderedList()
        },
      },
      {
        title: 'Table',
        description: 'Add a table to your document.',
        icon: Table,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          const commands = createEditorCommands(editor)
          editor.chain().focus().deleteRange(range).run()
          commands.insertTable()
        },
      },
      {
        title: 'Image',
        description: 'Upload an image from your computer.',
        icon: ImageIcon,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run()
          // Trigger a hidden file input click
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = 'image/*'
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
              const commands = createEditorCommands(editor)
              await commands.insertImage(file)
            }
          }
          input.click()
        },
      },
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10)
  },

  render: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let component: ReactRenderer<any>
    let popup: TippyInstance[]

    return {
      onStart: (props) => {
        component = new ReactRenderer(SlashMenuList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },
      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        })
      },
      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup[0].hide()
          return true
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (component.ref as any)?.onKeyDown(props)
      },
      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}
