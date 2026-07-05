import React from 'react'
import { FileMenu } from './FileMenu'
import { EditMenu } from './EditMenu'
import { ViewMenu } from './ViewMenu'
import { InsertMenu } from './InsertMenu'
import { FormatMenu } from './FormatMenu'
import { ToolsMenu } from './ToolsMenu'
import { HelpMenu } from './HelpMenu'

interface MenuBarProps {
  onOpenHistory?: () => void
}

export const MenuBar: React.FC<MenuBarProps> = ({ onOpenHistory }) => {
  return (
    <nav className="flex items-center gap-1 -ml-2 mt-0.5">
      <FileMenu />
      <EditMenu />
      <ViewMenu />
      <InsertMenu />
      <FormatMenu />
      <ToolsMenu onOpenHistory={onOpenHistory || (() => {})} />
      <HelpMenu />
    </nav>
  )
}
