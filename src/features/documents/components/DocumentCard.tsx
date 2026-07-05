import React from 'react'
import type { DocumentMetadata } from '../types/document'

interface DocumentCardProps {
  document: DocumentMetadata
  isActive: boolean
  onClick: (id: string) => void | Promise<void>
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onToggleFavorite: (id: string, favorite: boolean) => void
}

export const DocumentCard: React.FC<DocumentCardProps> = React.memo(({
  document,
  isActive,
  onClick,
  onDelete,
  onDuplicate,
  onToggleFavorite
}) => {
  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  const date = new Date(document.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })

  return (
    <div 
      className={`group flex items-start justify-between p-3 rounded-lg cursor-pointer transition-colors border ${
        isActive 
          ? 'bg-primary/10 border-primary/20' 
          : 'bg-background border-border/40 hover:bg-muted/40 hover:border-border'
      }`}
      onClick={() => onClick(document.id)}
    >
      <div className="flex flex-col overflow-hidden min-w-0 pr-2">
        <span className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-foreground'}`}>
          {document.title}
        </span>
        <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
          <span>{date}</span>
          <span>•</span>
          <span className="capitalize">{document.status}</span>
        </div>
      </div>

      <div className={`flex items-center space-x-1 shrink-0 ${isActive || document.favorite ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
        <button
          className={`p-1.5 rounded-md transition-colors ${document.favorite ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          onClick={(e) => handleAction(e, () => onToggleFavorite(document.id, !document.favorite))}
          title={document.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={document.favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={document.favorite ? 0 : 2} className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        </button>
        
        {/* Simple inline actions instead of full dropdown for now */}
        <button
          className="p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          onClick={(e) => handleAction(e, () => onDuplicate(document.id))}
          title="Duplicate"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
          </svg>
        </button>

        <button
          className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={(e) => {
            if (window.confirm('Are you sure you want to delete this document?')) {
              handleAction(e, () => onDelete(document.id))
            } else {
              e.stopPropagation()
            }
          }}
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  )
})
DocumentCard.displayName = 'DocumentCard'
