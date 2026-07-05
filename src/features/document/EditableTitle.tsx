import React, { useRef, useEffect } from 'react'
import { useDocumentTitle } from './useDocumentTitle'

export const EditableTitle: React.FC = () => {
  const {
    title,
    draftTitle,
    isEditing,
    setDraftTitle,
    startEditing,
    commitEditing,
    cancelEditing,
  } = useDocumentTitle()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitEditing()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draftTitle}
        onChange={(e) => setDraftTitle(e.target.value)}
        onBlur={commitEditing}
        onKeyDown={handleKeyDown}
        className="text-sm font-semibold tracking-tight bg-transparent border-none outline-none ring-1 ring-ring rounded px-1.5 -ml-1.5 w-48 text-foreground"
      />
    )
  }

  return (
    <h1 
      onClick={startEditing}
      className="text-sm font-semibold tracking-tight cursor-text hover:bg-accent hover:text-accent-foreground px-1.5 -ml-1.5 rounded transition-colors text-foreground"
    >
      {title}
    </h1>
  )
}
