import React from 'react'
import { BubbleMenu } from '@tiptap/react/menus'
import type { Editor } from '@tiptap/core'
import { motion } from 'framer-motion'
import { AlignLeft, AlignCenter, AlignRight, Trash2 } from 'lucide-react'
import { cn } from '@/utils'
import { Separator } from '@/components/ui/separator'

interface ImageToolbarProps {
  editor: Editor | null
}

export const ImageToolbar: React.FC<ImageToolbarProps> = ({ editor }) => {
  if (!editor) return null

  const getAlign = () => editor.getAttributes('image').align || 'center'

  const setAlign = (align: 'left' | 'center' | 'right') => {
    editor.chain().focus().updateAttributes('image', { align }).run()
  }

  const deleteImage = () => {
    editor.chain().focus().deleteSelection().run()
  }

  return (
    <BubbleMenu 
      editor={editor} 
      pluginKey="imageToolbar"
      shouldShow={({ editor }) => editor.isActive('image')}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 5 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="flex items-center gap-1 rounded-md border border-border/60 bg-background/95 backdrop-blur shadow-lg p-1"
      >
        <button
          onClick={() => setAlign('left')}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-sm transition-colors hover:bg-accent',
            getAlign() === 'left' && 'bg-accent text-accent-foreground'
          )}
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => setAlign('center')}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-sm transition-colors hover:bg-accent',
            getAlign() === 'center' && 'bg-accent text-accent-foreground'
          )}
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          onClick={() => setAlign('right')}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-sm transition-colors hover:bg-accent',
            getAlign() === 'right' && 'bg-accent text-accent-foreground'
          )}
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <button
          onClick={deleteImage}
          className="flex h-8 w-8 items-center justify-center rounded-sm transition-colors text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </motion.div>
    </BubbleMenu>
  )
}
