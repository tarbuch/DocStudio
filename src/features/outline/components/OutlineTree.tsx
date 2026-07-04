import React from 'react'
import type { OutlineNode } from '../types/outline'
import { OutlineItem } from './OutlineItem'

interface OutlineTreeProps {
  nodes: OutlineNode[]
  activeHeadingId: string | null
  onNavigate: (position: number) => void
  onToggleCollapse: (id: string) => void
}

export const OutlineTree: React.FC<OutlineTreeProps> = ({
  nodes,
  activeHeadingId,
  onNavigate,
  onToggleCollapse
}) => {
  return (
    <div className="flex flex-col w-full" role="tree">
      {nodes.map((node) => (
        <React.Fragment key={node.id}>
          <OutlineItem 
            node={node}
            isActive={activeHeadingId === node.id}
            onClick={onNavigate}
            onToggleCollapse={onToggleCollapse}
          />
          {!node.collapsed && node.children.length > 0 && (
            <OutlineTree 
              nodes={node.children}
              activeHeadingId={activeHeadingId}
              onNavigate={onNavigate}
              onToggleCollapse={onToggleCollapse}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
