import React from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import type { Editor } from '@tiptap/core'
import { motion } from 'framer-motion'
import { useTableState } from './useTableState'
import { TableMenuItem } from './TableMenuItem'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowUpToLine, ArrowDownToLine, 
  ArrowLeftToLine, ArrowRightToLine, 
  Trash2, Type, LayoutGrid
} from 'lucide-react'

export const TableContextMenu: React.FC = () => {
  const { editor, commands } = useTableState()

  if (!editor) return null

  return (
    <BubbleMenu 
      editor={editor} 
      pluginKey="tableContextMenu"
      shouldShow={({ editor }: { editor: Editor }) => editor.isActive('table')}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 5 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="flex flex-col gap-1 rounded-md border border-border/60 bg-background/95 backdrop-blur shadow-lg p-1 min-w-48"
      >
        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Row Operations
        </div>
        <TableMenuItem icon={ArrowUpToLine} label="Insert Row Above" onClick={commands.insertRowBefore} />
        <TableMenuItem icon={ArrowDownToLine} label="Insert Row Below" onClick={commands.insertRowAfter} />
        <TableMenuItem icon={Trash2} label="Delete Row" onClick={commands.deleteRow} destructive />

        <Separator className="my-1" />

        <div className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Column Operations
        </div>
        <TableMenuItem icon={ArrowLeftToLine} label="Insert Col Left" onClick={commands.insertColumnBefore} />
        <TableMenuItem icon={ArrowRightToLine} label="Insert Col Right" onClick={commands.insertColumnAfter} />
        <TableMenuItem icon={Trash2} label="Delete Col" onClick={commands.deleteColumn} destructive />

        <Separator className="my-1" />

        <TableMenuItem icon={Type} label="Toggle Header Row" onClick={commands.toggleHeaderRow} />
        <TableMenuItem icon={LayoutGrid} label="Delete Table" onClick={commands.deleteTable} destructive />
      </motion.div>
    </BubbleMenu>
  )
}
