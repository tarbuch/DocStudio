import { useState, useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/core'
import { debounce } from '../utils/debounce'
import { serializeDocument } from '../services/serializer'
import { saveDocument } from '../services/storage'

export type SaveState = 'idle' | 'typing' | 'saving' | 'saved'

export function useAutosave(
  editor: Editor | null,
  documentId: string,
  title: string
) {
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const previousPayloadRef = useRef<string | null>(null)

  useEffect(() => {
    if (!editor) return

    const executeSave = () => {
      setSaveState('saving')
      const content = editor.getJSON()
      const documentData = serializeDocument(documentId, title, content)
      
      const payloadString = JSON.stringify(documentData.content)
      
      // Avoid saving identical payloads
      if (previousPayloadRef.current === payloadString) {
        setSaveState('saved')
        return
      }

      const success = saveDocument(documentData)
      
      if (success) {
        previousPayloadRef.current = payloadString
        setSaveState('saved')
      } else {
        setSaveState('idle') // fallback or could add 'error' state
      }
    }

    const debouncedSave = debounce(executeSave, 2000)

    const handleUpdate = () => {
      setSaveState('typing')
      debouncedSave()
    }

    editor.on('update', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
      debouncedSave.cancel()
    }
  }, [editor, documentId, title])

  return { saveState }
}
