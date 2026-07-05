import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Undo2, Redo2, Scissors, Copy, Clipboard, CheckSquare } from 'lucide-react'
import { useEditorContext } from '../../../editor/providers/EditorProvider'

export const EditMenu: React.FC = () => {
  const { editor, commands } = useEditorContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-2 py-0.5 text-xs font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
        Edit
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => commands?.undo()} disabled={!commands?.canUndo()}>
          <Undo2 className="mr-2 h-4 w-4" />
          <span>Undo</span>
          <DropdownMenuShortcut>Ctrl+Z</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => commands?.redo()} disabled={!commands?.canRedo()}>
          <Redo2 className="mr-2 h-4 w-4" />
          <span>Redo</span>
          <DropdownMenuShortcut>Ctrl+Y</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => document.execCommand('cut')} disabled={!editor}>
          <Scissors className="mr-2 h-4 w-4" />
          <span>Cut</span>
          <DropdownMenuShortcut>Ctrl+X</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => document.execCommand('copy')} disabled={!editor}>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy</span>
          <DropdownMenuShortcut>Ctrl+C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => document.execCommand('paste')} disabled={!editor}>
          <Clipboard className="mr-2 h-4 w-4" />
          <span>Paste</span>
          <DropdownMenuShortcut>Ctrl+V</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => commands?.selectAll()} disabled={!editor}>
          <CheckSquare className="mr-2 h-4 w-4" />
          <span>Select All</span>
          <DropdownMenuShortcut>Ctrl+A</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
