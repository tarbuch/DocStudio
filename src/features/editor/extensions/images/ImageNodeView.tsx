import React, { useRef } from 'react'
import { NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { cn } from '@/utils'

export const ImageNodeView: React.FC<NodeViewProps> = ({ node, updateAttributes, selected }) => {
  const { src, alt, align, caption } = node.attrs
  const captionRef = useRef<HTMLInputElement>(null)

  const alignmentClass = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }[align as string] || 'mx-auto'

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAttributes({ caption: e.target.value })
  }

  // Prevent Tiptap from stealing focus when editing caption
  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  return (
    <NodeViewWrapper 
      className={cn(
        'group flex flex-col gap-2 my-8 w-fit max-w-full relative',
        alignmentClass
      )}
    >
      <div 
        className={cn(
          'relative rounded-lg overflow-hidden border border-transparent transition-all shadow-sm',
          selected && 'ring-2 ring-primary border-primary/50 shadow-md'
        )}
      >
        <img 
          src={src} 
          alt={alt || 'Image'} 
          className="max-w-full h-auto object-contain bg-muted/10 rounded-lg"
          style={{ maxHeight: '600px' }}
        />
      </div>
      
      <input
        ref={captionRef}
        type="text"
        placeholder="Write a caption..."
        value={caption}
        onChange={handleCaptionChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'text-sm text-center text-muted-foreground bg-transparent border-none outline-none placeholder:text-muted-foreground/50 transition-opacity',
          !caption && !selected ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
        )}
      />
    </NodeViewWrapper>
  )
}
