import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useDocuments } from '../hooks/useDocuments'
import { useDocumentContext } from '../providers/DocumentProvider'
import { DocumentCard } from './DocumentCard'
import { FolderTreeItem } from './FolderTreeItem'
import { MoveToFolderDialog } from './MoveToFolderDialog'
import { ContextMenu, type ContextMenuItem } from './ContextMenu'
import { DOCUMENT_CONSTANTS } from '../constants/documents'
import { createDocument, duplicateDocument, deleteDocument, toggleFavoriteDocument, moveDocument } from '../services/documentManager'
import { createFolder, deleteFolder, renameFolder, moveFolder, updateFolderMetadata, type FolderTreeNode } from '../services/folderManager'
import type { DocumentMetadata, FolderMetadata } from '../types/document'

interface ContextMenuState {
  x: number
  y: number
  items: ContextMenuItem[]
}

export const DocumentSidebar: React.FC = () => {
  const { 
    library,
    folderTree,
    folders,
    searchQuery, 
    setSearchQuery, 
    recentDocuments, 
    favoriteDocuments, 
    searchResults,
    refreshLibrary
  } = useDocuments()
  
  const { activeDocumentId, switchDocument, preferences, updatePreferences } = useDocumentContext()

  // Polling for library updates to keep sidebar fresh across actions
  useEffect(() => {
    refreshLibrary()
  }, [activeDocumentId, refreshLibrary])

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(preferences?.expandedFolders || [])
  )

  const [itemToMove, setItemToMove] = useState<DocumentMetadata | FolderMetadata | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  const documentsByFolder = useMemo(() => {
    const activeDocs = library.filter(doc => !doc.deleted)
    const map: Record<string, DocumentMetadata[]> = {}
    map['null'] = []

    activeDocs.forEach(doc => {
      const folderId = doc.folderId || 'null'
      if (!map[folderId]) map[folderId] = []
      map[folderId].push(doc)
    })
    return map
  }, [library])

  const handleToggleExpand = useCallback((id: string, force?: boolean) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (force !== undefined) {
        if (force) next.add(id)
        else next.delete(id)
      } else {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      }
      
      updatePreferences({ expandedFolders: Array.from(next) })
      return next
    })
  }, [updatePreferences])

  const handleCreateNewDocument = useCallback(async (folderId: string | null = null) => {
    const newDoc = await createDocument('Untitled Document', folderId)
    await refreshLibrary()
    await switchDocument(newDoc.id)
  }, [refreshLibrary, switchDocument])

  const handleCreateNewFolder = useCallback(async () => {
    const name = prompt('Folder Name:')
    if (name) {
      await createFolder(name)
      await refreshLibrary()
    }
  }, [refreshLibrary])

  const handleDuplicate = useCallback(async (id: string) => {
    const newDoc = await duplicateDocument(id)
    if (newDoc) {
      await refreshLibrary()
      await switchDocument(newDoc.id)
    }
  }, [refreshLibrary, switchDocument])

  const handleDelete = useCallback(async (id: string) => {
    await deleteDocument(id)
    await refreshLibrary()
    if (id === activeDocumentId) {
      const remainingDocs = recentDocuments.filter(d => d.id !== id && !d.deleted)
      if (remainingDocs.length > 0) {
        await switchDocument(remainingDocs[0].id)
      } else {
        await handleCreateNewDocument()
      }
    }
  }, [activeDocumentId, recentDocuments, refreshLibrary, switchDocument, handleCreateNewDocument])

  const handleToggleFavorite = useCallback(async (id: string, favorite: boolean) => {
    await toggleFavoriteDocument(id, favorite)
    await refreshLibrary()
  }, [refreshLibrary])

  const handleFolderRename = useCallback(async (id: string, currentName: string) => {
    const newName = prompt('Rename Folder:', currentName)
    if (newName && newName !== currentName) {
      await renameFolder(id, newName)
      await refreshLibrary()
    }
  }, [refreshLibrary])

  const handleFolderDelete = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this folder and all its contents?')) {
      await deleteFolder(id)
      await refreshLibrary()
    }
  }, [refreshLibrary])

  const handleMoveAction = useCallback(async (targetFolderId: string | null) => {
    if (!itemToMove) return
    
    if ('folderId' in itemToMove) {
      await moveDocument(itemToMove.id, targetFolderId)
    } else {
      await moveFolder(itemToMove.id, targetFolderId)
    }
    
    setItemToMove(null)
    await refreshLibrary()
  }, [itemToMove, refreshLibrary])

  // Context Menu Handlers
  const handleFolderContextMenu = useCallback((e: React.MouseEvent, folder: FolderTreeNode) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { id: 'rename', label: 'Rename', onClick: () => handleFolderRename(folder.id, folder.name) },
        { id: 'move', label: 'Move to...', onClick: () => setItemToMove(folder) },
        { divider: true, id: 'd1', label: '', onClick: () => {} },
        ...Object.keys(DOCUMENT_CONSTANTS.FOLDER_COLORS).map(color => ({
          id: `color-${color}`,
          label: `Color: ${color}`,
          onClick: async () => {
            await updateFolderMetadata(folder.id, { color })
            await refreshLibrary()
          }
        })),
        { divider: true, id: 'd2', label: '', onClick: () => {} },
        ...Object.keys(DOCUMENT_CONSTANTS.FOLDER_ICONS).map(icon => ({
          id: `icon-${icon}`,
          label: `Icon: ${DOCUMENT_CONSTANTS.FOLDER_ICONS[icon]}`,
          onClick: async () => {
            await updateFolderMetadata(folder.id, { icon })
            await refreshLibrary()
          }
        })),
        { divider: true, id: 'd3', label: '', onClick: () => {} },
        { id: 'delete', label: 'Delete', danger: true, onClick: () => handleFolderDelete(folder.id) }
      ]
    })
  }, [setItemToMove, handleFolderRename, handleFolderDelete, refreshLibrary])

  const handleDocumentContextMenu = useCallback((e: React.MouseEvent, doc: DocumentMetadata) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      items: [
        { id: 'duplicate', label: 'Duplicate', onClick: () => handleDuplicate(doc.id) },
        { id: 'move', label: 'Move to...', onClick: () => setItemToMove(doc) },
        { divider: true, id: 'd1', label: '', onClick: () => {} },
        { id: 'delete', label: 'Delete', danger: true, onClick: () => handleDelete(doc.id) }
      ]
    })
  }, [setItemToMove, handleDuplicate, handleDelete])

  // Drag and Drop Handlers
  const handleDragStart = useCallback((e: React.DragEvent, type: 'folder' | 'document', id: string) => {
    e.dataTransfer.setData(`application/x-docstudio-${type}`, id)
    e.dataTransfer.effectAllowed = 'move'
    
    // Create a lightweight drag preview
    const preview = document.createElement('div')
    preview.className = 'bg-primary text-primary-foreground px-3 py-1.5 rounded shadow text-sm font-medium absolute -top-10 -left-10 z-[-1]'
    preview.innerText = 'Moving...'
    document.body.appendChild(preview)
    e.dataTransfer.setDragImage(preview, 0, 0)
    
    setTimeout(() => {
      document.body.removeChild(preview)
    }, 0)
  }, [])

  const handleDropOnRoot = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const folderId = e.dataTransfer.getData('application/x-docstudio-folder')
    const docId = e.dataTransfer.getData('application/x-docstudio-document')
    
    if (folderId) {
      await moveFolder(folderId, null)
      await refreshLibrary()
    } else if (docId) {
      await moveDocument(docId, null)
      await refreshLibrary()
    }
  }, [refreshLibrary])

  const handleDropOnFolder = useCallback(async (e: React.DragEvent, targetFolderId: string | null) => {
    if (!targetFolderId) return
    const folderId = e.dataTransfer.getData('application/x-docstudio-folder')
    const docId = e.dataTransfer.getData('application/x-docstudio-document')
    
    if (folderId && folderId !== targetFolderId) {
      await moveFolder(folderId, targetFolderId)
      await refreshLibrary()
    } else if (docId) {
      await moveDocument(docId, targetFolderId)
      await refreshLibrary()
    }
  }, [refreshLibrary])

  // Keyboard Navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const activeEl = document.activeElement as HTMLElement
    if (!activeEl) return

    const folderId = activeEl.getAttribute('data-folder-id')
    const docId = activeEl.getAttribute('data-document-id')

    if (!folderId && !docId) return

    if (e.key === 'F2') {
      e.preventDefault()
      if (folderId) {
        const folder = folders.find(f => f.id === folderId)
        if (folder) handleFolderRename(folder.id, folder.name)
      }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      if (folderId) handleFolderDelete(folderId)
      else if (docId) handleDelete(docId)
    } else if (folderId) {
      if (e.key === ' ') {
        e.preventDefault()
        handleToggleExpand(folderId)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleToggleExpand(folderId, true)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handleToggleExpand(folderId, false)
      }
    }

    if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault()
      const focusable = Array.from(document.querySelectorAll('[data-folder-id], [data-document-id]')) as HTMLElement[]
      if (focusable.length > 0) {
        if (e.key === 'Home') focusable[0].focus()
        else focusable[focusable.length - 1].focus()
      }
    }
  }, [folders, handleFolderRename, handleFolderDelete, handleDelete, handleToggleExpand])

  if (!preferences || preferences.documentsSidebarCollapsed) {
    return null
  }

  const renderDocumentList = (title: string, docs: typeof recentDocuments) => {
    if (docs.length === 0) return null
    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
          {title}
        </h3>
        <div className="space-y-1">
          {docs.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              isActive={doc.id === activeDocumentId}
              onClick={switchDocument}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div 
      className="w-72 shrink-0 border-r border-border/40 bg-muted/10 flex flex-col h-full hidden md:flex outline-none"
      tabIndex={-1}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={handleDropOnRoot}
      onKeyDown={handleKeyDown}
    >
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Documents</h2>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => void handleCreateNewFolder()}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="New Folder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75Z" />
              <path d="M18 9.5H2v5.75A1.75 1.75 0 0 0 3.75 17h12.5A1.75 1.75 0 0 0 18 15.25V9.5Z" />
              <path fillRule="evenodd" d="M10 10.75a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => void handleCreateNewDocument()}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="New Document"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 absolute left-2.5 top-2 text-muted-foreground">
            <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
          </svg>
          <input 
            type="text" 
            placeholder="Search documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border/50 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-0">
        {searchQuery ? (
          renderDocumentList('Search Results', searchResults)
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                Library
              </h3>
              <div className="space-y-1">
                {folderTree.map(node => (
                  <FolderTreeItem
                    key={node.id}
                    node={node}
                    documentsByFolder={documentsByFolder}
                    activeDocumentId={activeDocumentId}
                    expandedFolders={expandedFolders}
                    onToggleExpand={handleToggleExpand}
                    onDocumentClick={switchDocument}
                    onDocumentDelete={handleDelete}
                    onDocumentDuplicate={handleDuplicate}
                    onDocumentToggleFavorite={handleToggleFavorite}
                    onFolderRename={handleFolderRename}
                    onFolderDelete={handleFolderDelete}
                    onFolderMove={(folder) => setItemToMove(folder)}
                    onDocumentMove={(doc) => setItemToMove(doc)}
                    onFolderContextMenu={handleFolderContextMenu}
                    onDocumentContextMenu={handleDocumentContextMenu}
                    onDragStart={handleDragStart}
                    onDrop={handleDropOnFolder}
                  />
                ))}
                
                {/* Root level documents */}
                {(documentsByFolder['null'] || []).map(doc => (
                  <div 
                    key={doc.id} 
                    className="relative group outline-none focus-within:ring-1 focus-within:ring-primary rounded-md"
                    draggable
                    tabIndex={0}
                    data-document-id={doc.id}
                    onDragStart={(e) => handleDragStart(e, 'document', doc.id)}
                    onContextMenu={(e) => handleDocumentContextMenu(e, doc)}
                  >
                    <DocumentCard
                      document={doc}
                      isActive={doc.id === activeDocumentId}
                      onClick={switchDocument}
                      onDelete={handleDelete}
                      onDuplicate={handleDuplicate}
                      onToggleFavorite={handleToggleFavorite}
                    />
                    <button
                      onClick={() => setItemToMove(doc)}
                      className="absolute right-12 top-2 p-1.5 bg-background border shadow-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 text-muted-foreground hover:text-foreground"
                      title="Move to Folder"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {folderTree.length === 0 && (documentsByFolder['null'] || []).length === 0 && (
                  <div className="px-1 py-2 text-sm text-muted-foreground italic">
                    Library is empty
                  </div>
                )}
              </div>
            </div>

            {renderDocumentList('Favorites', favoriteDocuments)}
            {renderDocumentList('Recent Documents', recentDocuments)}
          </>
        )}
      </div>

      <MoveToFolderDialog
        isOpen={itemToMove !== null}
        onClose={() => setItemToMove(null)}
        onMove={handleMoveAction}
        folderTree={folderTree}
        itemToMove={itemToMove}
      />
      
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  )
}
