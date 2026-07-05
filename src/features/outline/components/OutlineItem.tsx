import React from 'react'
import type { OutlineNode } from '../types/outline'

interface OutlineItemProps {
  node: OutlineNode
  isActive: boolean
  onClick: (position: number) => void
  onToggleCollapse: (id: string) => void
}

export const OutlineItem: React.FC<OutlineItemProps> = React.memo(({
  node,
  isActive,
  onClick,
  onToggleCollapse
}) => {
  const paddingLeft = (node.level - 1) * 12
  const hasChildren = node.children.length > 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onClick(node.position)
    } else if (e.key === 'ArrowRight' && hasChildren && node.collapsed) {
      e.preventDefault()
      onToggleCollapse(node.id)
    } else if (e.key === 'ArrowLeft' && hasChildren && !node.collapsed) {
      e.preventDefault()
      onToggleCollapse(node.id)
    }
  }

  return (
    <div 
      className="flex flex-col outline-none" 
      role="treeitem" 
      aria-expanded={hasChildren ? !node.collapsed : undefined}
      aria-current={isActive ? 'true' : undefined}
    >
      <div 
        className={`group flex items-center py-1.5 px-2 text-sm rounded-md cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-primary/50 outline-none ${
          isActive 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        }`}
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
        tabIndex={0}
        onClick={() => onClick(node.position)}
        onKeyDown={handleKeyDown}
      >
        <div 
          className="w-4 h-4 mr-1 flex items-center justify-center shrink-0 text-muted-foreground/50 hover:text-foreground"
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation()
              onToggleCollapse(node.id)
            }
          }}
          tabIndex={-1}
        >
          {hasChildren && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className={`w-3.5 h-3.5 transition-transform ${node.collapsed ? '-rotate-90' : 'rotate-0'}`}
            >
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        <span 
          className="truncate flex-1 select-none" 
          title={node.text}
        >
          {node.text}
        </span>
      </div>
    </div>
  )
})
OutlineItem.displayName = 'OutlineItem'
