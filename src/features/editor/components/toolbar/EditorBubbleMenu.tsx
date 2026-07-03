import React from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import { motion } from 'framer-motion'
import { useEditorContext } from '../../providers/EditorProvider'
import { ToolbarButton } from './ToolbarButton'
import { ToolbarGroup } from './ToolbarGroup'
import { Separator } from '@/components/ui/separator'
import { Bold, Italic, Underline, Strikethrough, Link } from 'lucide-react'

export const EditorBubbleMenu: React.FC = () => {
  const { editor, commands } = useEditorContext()

  if (!editor) return null

  return (
    <BubbleMenu editor={editor}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 5 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="flex items-center gap-1 rounded-md border border-border/60 bg-background/95 backdrop-blur shadow-md px-2 py-1.5"
      >
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
        
        <Separator orientation="vertical" className="h-5 mx-1" />
        
        <ToolbarGroup>
          <ToolbarButton
            icon={Link}
            label="Add Link"
            shortcut="Ctrl+K"
            onClick={commands.toggleLink}
            isActive={false} // Placeholder until link logic exists
          />
        </ToolbarGroup>
      </motion.div>
    </BubbleMenu>
  )
}
