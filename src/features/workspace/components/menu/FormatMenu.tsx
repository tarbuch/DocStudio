import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bold, Italic, Underline, Strikethrough, Heading1, Heading2, List, ListOrdered } from 'lucide-react'
import { useEditorContext } from '../../../editor/providers/EditorProvider'

export const FormatMenu: React.FC = () => {
  const { editor, commands } = useEditorContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-2 py-0.5 text-xs font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
        Format
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => commands?.toggleBold()} disabled={!editor}>
          <Bold className="mr-2 h-4 w-4" />
          <span>Bold</span>
          <DropdownMenuShortcut>Ctrl+B</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => commands?.toggleItalic()} disabled={!editor}>
          <Italic className="mr-2 h-4 w-4" />
          <span>Italic</span>
          <DropdownMenuShortcut>Ctrl+I</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => commands?.toggleUnderline()} disabled={!editor}>
          <Underline className="mr-2 h-4 w-4" />
          <span>Underline</span>
          <DropdownMenuShortcut>Ctrl+U</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => commands?.toggleStrike()} disabled={!editor}>
          <Strikethrough className="mr-2 h-4 w-4" />
          <span>Strike</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => commands?.toggleHeading(1)} disabled={!editor}>
          <Heading1 className="mr-2 h-4 w-4" />
          <span>Heading 1</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => commands?.toggleHeading(2)} disabled={!editor}>
          <Heading2 className="mr-2 h-4 w-4" />
          <span>Heading 2</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => commands?.toggleBulletList()} disabled={!editor}>
          <List className="mr-2 h-4 w-4" />
          <span>Bullet List</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => commands?.toggleOrderedList()} disabled={!editor}>
          <ListOrdered className="mr-2 h-4 w-4" />
          <span>Numbered List</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
