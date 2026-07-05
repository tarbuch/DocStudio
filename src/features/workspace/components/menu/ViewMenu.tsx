import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LayoutList, Sidebar } from 'lucide-react'
import { useDocumentContext } from '../../../documents/providers/DocumentProvider'

export const ViewMenu: React.FC = () => {
  const { preferences, updatePreferences } = useDocumentContext()

  const handleToggleOutline = () => {
    updatePreferences({ outlineSidebarCollapsed: !preferences.outlineSidebarCollapsed })
  }

  const handleToggleSidebar = () => {
    updatePreferences({ documentsSidebarCollapsed: !preferences.documentsSidebarCollapsed })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-2 py-0.5 text-xs font-medium text-muted-foreground rounded-md hover:bg-accent hover:text-accent-foreground transition-colors outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={handleToggleOutline}>
          <LayoutList className="mr-2 h-4 w-4" />
          <span>{preferences?.outlineSidebarCollapsed ? 'Show' : 'Hide'} Outline</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleSidebar}>
          <Sidebar className="mr-2 h-4 w-4" />
          <span>{preferences?.documentsSidebarCollapsed ? 'Show' : 'Hide'} Document Sidebar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
