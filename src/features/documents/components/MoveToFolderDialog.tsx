import React, { useState } from 'react'
import type { FolderTreeNode } from '../services/folderManager'
import type { DocumentMetadata, FolderMetadata } from '../types/document'

interface MoveToFolderDialogProps {
  isOpen: boolean
  onClose: () => void
  onMove: (folderId: string | null) => Promise<void>
  folderTree: FolderTreeNode[]
  itemToMove: DocumentMetadata | FolderMetadata | null
}

export const MoveToFolderDialog: React.FC<MoveToFolderDialogProps> = ({
  isOpen,
  onClose,
  onMove,
  folderTree,
  itemToMove
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [isMoving, setIsMoving] = useState(false)

  if (!isOpen || !itemToMove) return null

  const handleMove = async () => {
    setIsMoving(true)
    try {
      await onMove(selectedFolderId)
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setIsMoving(false)
    }
  }

  const renderTree = (nodes: FolderTreeNode[], depth = 0) => {
    return nodes.map(node => {
      // Prevent moving a folder into itself or its descendants
      if ('parentId' in itemToMove && node.id === itemToMove.id) {
        return null
      }
      
      return (
        <React.Fragment key={node.id}>
          <button
            onClick={() => setSelectedFolderId(node.id)}
            className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 rounded-md hover:bg-muted ${
              selectedFolderId === node.id ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
            }`}
            style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-muted-foreground">
              <path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75Z" />
              <path d="M18 9.5H2v5.75A1.75 1.75 0 0 0 3.75 17h12.5A1.75 1.75 0 0 0 18 15.25V9.5Z" />
            </svg>
            <span className="truncate">{node.name}</span>
          </button>
          {node.children.length > 0 && renderTree(node.children, depth + 1)}
        </React.Fragment>
      )
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-xl border shadow-xl flex flex-col max-h-[80vh]">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Move "{'title' in itemToMove ? itemToMove.title : itemToMove.name}"</h2>
          <p className="text-sm text-muted-foreground">Select a destination folder</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <button
            onClick={() => setSelectedFolderId(null)}
            className={`w-full text-left px-3 py-2 text-sm flex items-center space-x-2 rounded-md hover:bg-muted ${
              selectedFolderId === null ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 text-muted-foreground">
              <path d="M2 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Zm15 13H3V5h14v11Z" />
            </svg>
            <span>Root (All Documents)</span>
          </button>
          
          <div className="my-2 border-t border-border/50" />
          
          {folderTree.length === 0 ? (
            <div className="px-3 py-4 text-center text-sm text-muted-foreground italic">
              No folders created yet.
            </div>
          ) : (
            renderTree(folderTree)
          )}
        </div>
        
        <div className="p-4 border-t bg-muted/30 flex justify-end space-x-2 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isMoving}
            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleMove()}
            disabled={isMoving || (('folderId' in itemToMove ? itemToMove.folderId : itemToMove.parentId) === selectedFolderId)}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50"
          >
            {isMoving ? 'Moving...' : 'Move'}
          </button>
        </div>
      </div>
    </div>
  )
}
