import React, { useState, useEffect } from 'react'
import { UploadCloud } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useEditorContext } from '../../providers/EditorProvider'
import { useImageUpload } from './useImageUpload'

export const ImageDropzone: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false)
  const { editor } = useEditorContext()
  const { uploadImage } = useImageUpload()

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragging(true)
      }
    }

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault()
      if (e.clientX === 0 || e.clientY === 0) {
        setIsDragging(false)
      }
    }

    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      if (!editor || !e.dataTransfer?.files) return

      const file = Array.from(e.dataTransfer.files).find(f => f.type.startsWith('image/'))
      if (file) {
        const url = await uploadImage(file)
        
        // Find coordinates of drop to insert image accurately
        const coordinates = editor.view.posAtCoords({ left: e.clientX, top: e.clientY })
        if (coordinates) {
          editor.chain().focus().insertContentAt(coordinates.pos, { type: 'image', attrs: { src: url } }).run()
        } else {
          // Fallback to end of doc
          editor.chain().focus().insertContent({ type: 'image', attrs: { src: url } }).run()
        }
      }
    }

    window.addEventListener('dragover', handleDragOver)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('drop', handleDrop)

    return () => {
      window.removeEventListener('dragover', handleDragOver)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('drop', handleDrop)
    }
  }, [editor, uploadImage])

  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-primary bg-background p-12 shadow-xl">
            <UploadCloud className="h-12 w-12 text-primary" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">Drop image to upload</h3>
              <p className="text-sm text-muted-foreground">Supports PNG, JPG, WEBP or GIF</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
