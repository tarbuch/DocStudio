import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Clock, Search } from 'lucide-react'

interface ToolsMenuProps {
  onOpenHistory: () => void
}

export const ToolsMenu: React.FC<ToolsMenuProps> = ({ onOpenHistory }) => {
  const handleOpenSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-2 py-0.5 text-xs font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
        Tools
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={onOpenHistory}>
          <Clock className="mr-2 h-4 w-4" />
          <span>Version History</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleOpenSearch}>
          <Search className="mr-2 h-4 w-4" />
          <span>Global Search</span>
          <DropdownMenuShortcut>Ctrl+K</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
