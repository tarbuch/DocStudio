import { useState } from 'react'
import { useEditorContext } from '../editor/providers/EditorProvider'

export const useDocumentTitle = () => {
  const { documentTitle, setDocumentTitle } = useEditorContext()
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(documentTitle)

  const startEditing = () => {
    setDraftTitle(documentTitle)
    setIsEditing(true)
  }

  const commitEditing = () => {
    const trimmed = draftTitle.trim()
    const newTitle = trimmed === '' ? 'Untitled Document' : trimmed
    setDocumentTitle(newTitle)
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setDraftTitle(documentTitle)
    setIsEditing(false)
  }

  return {
    title: documentTitle,
    draftTitle,
    isEditing,
    setDraftTitle,
    startEditing,
    commitEditing,
    cancelEditing,
  }
}
