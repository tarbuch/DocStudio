import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Keyboard, Info } from 'lucide-react'

export const HelpMenu: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-2 py-0.5 text-xs font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
        Help
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem disabled>
          <Keyboard className="mr-2 h-4 w-4" />
          <span>Keyboard Shortcuts</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Info className="mr-2 h-4 w-4" />
          <span>About</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
