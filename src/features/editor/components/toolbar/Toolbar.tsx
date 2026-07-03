import React from 'react'
import { Separator } from '@/components/ui/separator'
import { ToolbarGroup } from './ToolbarGroup'
import { ToolbarButton } from './ToolbarButton'
import { BlockFormatDropdown } from './BlockFormatDropdown'
import { useEditorContext } from '../../providers/EditorProvider'
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered
} from 'lucide-react'

export const Toolbar: React.FC = () => {
  const { commands, isLoading } = useEditorContext()

  if (isLoading) {
    return (
      <div className="sticky top-4 z-50 flex h-12 w-full max-w-4xl mx-auto items-center gap-2 rounded-lg border border-border/50 bg-background/95 backdrop-blur shadow-sm px-2 animate-pulse">
        <div className="h-8 w-24 bg-muted rounded"></div>
        <Separator orientation="vertical" className="h-6" />
        <div className="h-8 w-32 bg-muted rounded"></div>
      </div>
    )
  }

  return (
    <div className="sticky top-4 z-50 flex w-full max-w-4xl mx-auto items-center gap-2 rounded-lg border border-border bg-background/95 backdrop-blur shadow-sm px-2 py-1.5 transition-all">
      <ToolbarGroup>
        <ToolbarButton
          icon={Undo}
          label="Undo"
          shortcut="Ctrl+Z"
          onClick={commands.undo}
          isDisabled={!commands.canUndo()}
        />
        <ToolbarButton
          icon={Redo}
          label="Redo"
          shortcut="Ctrl+Y"
          onClick={commands.redo}
          isDisabled={!commands.canRedo()}
        />
      </ToolbarGroup>

      <Separator orientation="vertical" className="h-6" />

      <ToolbarGroup>
        <BlockFormatDropdown />
      </ToolbarGroup>

      <Separator orientation="vertical" className="h-6" />

      <ToolbarGroup>
        <ToolbarButton
          icon={Bold}
          label="Bold"
          shortcut="Ctrl+B"
          onClick={commands.toggleBold}
          isActive={commands.isBold()}
        />
        <ToolbarButton
          icon={Italic}
          label="Italic"
          shortcut="Ctrl+I"
          onClick={commands.toggleItalic}
          isActive={commands.isItalic()}
        />
        <ToolbarButton
          icon={Underline}
          label="Underline"
          shortcut="Ctrl+U"
          onClick={commands.toggleUnderline}
          isActive={commands.isUnderline()}
        />
        <ToolbarButton
          icon={Strikethrough}
          label="Strikethrough"
          shortcut="Ctrl+Shift+X"
          onClick={commands.toggleStrike}
          isActive={commands.isStrike()}
        />
      </ToolbarGroup>

      <Separator orientation="vertical" className="h-6" />

      <ToolbarGroup>
        <ToolbarButton
          icon={List}
          label="Bullet List"
          shortcut="Ctrl+Shift+8"
          onClick={commands.toggleBulletList}
          isActive={commands.isBulletList()}
        />
        <ToolbarButton
          icon={ListOrdered}
          label="Numbered List"
          shortcut="Ctrl+Shift+7"
          onClick={commands.toggleOrderedList}
          isActive={commands.isOrderedList()}
        />
      </ToolbarGroup>
    </div>
  )
}
