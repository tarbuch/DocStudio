import { useState } from 'react'

export const useDocumentTitle = (initialTitle: string = 'Untitled Document') => {
  const [title, setTitle] = useState(initialTitle)
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(initialTitle)

  const startEditing = () => {
    setDraftTitle(title)
    setIsEditing(true)
  }

  const commitEditing = () => {
    const trimmed = draftTitle.trim()
    setTitle(trimmed === '' ? 'Untitled Document' : trimmed)
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setDraftTitle(title)
    setIsEditing(false)
  }

  return {
    title,
    draftTitle,
    isEditing,
    setDraftTitle,
    startEditing,
    commitEditing,
    cancelEditing,
  }
}
