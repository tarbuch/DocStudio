import { memo, useState, useRef, useEffect, type DragEvent } from 'react'
import type { FolderTreeNode } from '../services/folderManager'
import type { DocumentMetadata } from '../types/document'
import { DocumentCard } from './DocumentCard'
import { DOCUMENT_CONSTANTS } from '../constants/documents'

interface FolderTreeItemProps {
  node: FolderTreeNode
  documentsByFolder: Record<string, DocumentMetadata[]>
  activeDocumentId: string | null
  expandedFolders: Set<string>
  onToggleExpand: (id: string, force?: boolean) => void
  onDocumentClick: (id: string) => void | Promise<void>
  onDocumentDelete: (id: string) => void | Promise<void>
  onDocumentDuplicate: (id: string) => void | Promise<void>
  onDocumentToggleFavorite: (id: string, favorite: boolean) => void | Promise<void>
  onFolderRename: (id: string, currentName: string) => void
  onFolderDelete: (id: string) => void
  onFolderMove: (folder: FolderTreeNode) => void
  onDocumentMove: (doc: DocumentMetadata) => void
  onFolderContextMenu: (e: React.MouseEvent, folder: FolderTreeNode) => void
  onDocumentContextMenu: (e: React.MouseEvent, doc: DocumentMetadata) => void
  onDragStart: (e: DragEvent, type: 'folder' | 'document', id: string) => void
  onDrop: (e: DragEvent, targetFolderId: string | null) => void
  depth?: number
}

export const FolderTreeItem = memo(function FolderTreeItem({
  node,
  documentsByFolder,
  activeDocumentId,
  expandedFolders,
  onToggleExpand,
  onDocumentClick,
  onDocumentDelete,
  onDocumentDuplicate,
  onDocumentToggleFavorite,
  onFolderRename,
  onFolderDelete,
  onFolderMove,
  onDocumentMove,
  onFolderContextMenu,
  onDocumentContextMenu,
  onDragStart,
  onDrop,
  depth = 0
}: FolderTreeItemProps) {
  const isExpanded = expandedFolders.has(node.id)
  const docs = documentsByFolder[node.id] || []

  const [dragState, setDragState] = useState<'none' | 'valid' | 'invalid'>('none')
  const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Auto expand logic
    if (!isExpanded) {
      if (!expandTimeoutRef.current) {
        expandTimeoutRef.current = setTimeout(() => {
          onToggleExpand(node.id, true)
        }, 600)
      }
    }

    const types = e.dataTransfer.types
    if (types.includes('application/x-docstudio-folder') || types.includes('application/x-docstudio-document')) {
      // In a real app we'd decode the dragged ID from a global drag state or try to parse
      // However dataTransfer.getData is often restricted in dragOver.
      // We will assume valid unless we can prove invalid.
      setDragState('valid')
    } else {
      setDragState('invalid')
    }
  }

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragState('none')
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current)
      expandTimeoutRef.current = null
    }
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragState('none')
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current)
      expandTimeoutRef.current = null
    }
    
    if (dragState === 'valid') {
      onDrop(e, node.id)
    }
  }

  useEffect(() => {
    return () => {
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current)
      }
    }
  }, [])

  // Resolve color and icon
  const iconStr = node.icon ? DOCUMENT_CONSTANTS.FOLDER_ICONS[node.icon] : DOCUMENT_CONSTANTS.FOLDER_ICONS.default
  const colorClass = node.color ? DOCUMENT_CONSTANTS.FOLDER_COLORS[node.color] : 'text-muted-foreground'

  return (
    <div className="w-full">
      <div 
        className={`group flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer transition-colors outline-none focus:ring-1 focus:ring-primary
          ${dragState === 'valid' ? 'bg-primary/20 ring-1 ring-primary' : ''}
          ${dragState === 'invalid' ? 'bg-destructive/20 ring-1 ring-destructive' : ''}
          ${dragState === 'none' ? 'hover:bg-muted/50 focus:bg-muted/50' : ''}
        `}
        tabIndex={0}
        style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
        onClick={() => onToggleExpand(node.id)}
        onContextMenu={(e) => onFolderContextMenu(e, node)}
        draggable
        onDragStart={(e) => onDragStart(e, 'folder', node.id)}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-folder-id={node.id}
      >
        <div className="flex items-center space-x-1 overflow-hidden pointer-events-none">
          <button 
            className="w-4 h-4 flex items-center justify-center shrink-0 text-muted-foreground hover:text-foreground pointer-events-auto"
            onClick={(e) => { e.stopPropagation(); onToggleExpand(node.id) }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            >
              <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
          
          <span className={`w-4 h-4 flex items-center justify-center shrink-0 text-sm ${colorClass}`}>
            {iconStr}
          </span>
          
          <span className={`text-sm font-medium truncate select-none ${colorClass === 'text-muted-foreground' ? 'text-foreground' : colorClass}`}>{node.name}</span>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onFolderMove(node) }}
            className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground"
            title="Move Folder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onFolderRename(node.id, node.name) }}
            className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground"
            title="Rename Folder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex flex-col">
          {node.children.map(child => (
            <FolderTreeItem
              key={child.id}
              node={child}
              documentsByFolder={documentsByFolder}
              activeDocumentId={activeDocumentId}
              expandedFolders={expandedFolders}
              onToggleExpand={onToggleExpand}
              onDocumentClick={onDocumentClick}
              onDocumentDelete={onDocumentDelete}
              onDocumentDuplicate={onDocumentDuplicate}
              onDocumentToggleFavorite={onDocumentToggleFavorite}
              onFolderRename={onFolderRename}
              onFolderDelete={onFolderDelete}
              onFolderMove={onFolderMove}
              onDocumentMove={onDocumentMove}
              onFolderContextMenu={onFolderContextMenu}
              onDocumentContextMenu={onDocumentContextMenu}
              onDragStart={onDragStart}
              onDrop={onDrop}
              depth={depth + 1}
            />
          ))}
          
          {docs.length > 0 && (
            <div className="space-y-1 mt-1 mb-2">
              {docs.map(doc => (
                <div 
                  key={doc.id} 
                  className="relative group outline-none focus-within:ring-1 focus-within:ring-primary rounded-md" 
                  style={{ paddingLeft: `${(depth + 1) * 1 + 0.5}rem` }}
                  draggable
                  tabIndex={0}
                  data-document-id={doc.id}
                  onDragStart={(e) => onDragStart(e, 'document', doc.id)}
                  onContextMenu={(e) => onDocumentContextMenu(e, doc)}
                >
                  <DocumentCard
                    document={doc}
                    isActive={doc.id === activeDocumentId}
                    onClick={onDocumentClick}
                    onDelete={onDocumentDelete}
                    onDuplicate={onDocumentDuplicate}
                    onToggleFavorite={onDocumentToggleFavorite}
                  />
                  <button
                    onClick={() => onDocumentMove(doc)}
                    className="absolute right-12 top-2 p-1.5 bg-background border shadow-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 text-muted-foreground hover:text-foreground"
                    title="Move to Folder"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {node.children.length === 0 && docs.length === 0 && (
            <div 
              className="py-1 text-xs text-muted-foreground italic"
              style={{ paddingLeft: `${(depth + 1) * 1 + 1.5}rem` }}
            >
              Empty folder
            </div>
          )}
        </div>
      )}
    </div>
  )
})
