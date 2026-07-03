import React, { useEffect, useState } from 'react'
import { useEditorContext } from '../editor/providers/EditorProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { Command } from 'lucide-react'

export const EmptyState: React.FC = () => {
  const { editor } = useEditorContext()
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      // Check if the editor is completely empty
      // A truly empty document in ProseMirror has a size of 4 (empty paragraph)
      const text = editor.getText().trim()
      const isDocumentEmpty = text === '' && editor.state.doc.content.size <= 4
      setIsEmpty(isDocumentEmpty)
    }

    // Initial check
    handleUpdate()

    editor.on('update', handleUpdate)
    editor.on('selectionUpdate', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
      editor.off('selectionUpdate', handleUpdate)
    }
  }, [editor])

  return (
    <AnimatePresence>
      {isEmpty && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-0 left-0 mt-[1.125rem] ml-[0.1rem] pointer-events-none select-none"
        >
          <div className="flex flex-col gap-2 text-muted-foreground/50">
            <p className="text-base text-muted-foreground/70">Start writing...</p>
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center justify-center w-5 h-5 rounded bg-muted/50 text-xs font-medium border border-border/50 shadow-sm">
                  /
                </span>
                <span>Type <strong className="font-medium text-muted-foreground/70">"/"</strong> for commands</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center justify-center h-5 px-1.5 rounded bg-muted/50 text-xs font-medium border border-border/50 shadow-sm gap-0.5">
                  <Command className="w-3 h-3" /> /
                </span>
                <span>Press <strong className="font-medium text-muted-foreground/70">Ctrl+/</strong> for shortcuts</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
