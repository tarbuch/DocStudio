import { useState, useEffect, useRef } from 'react'
import type { Editor } from '@tiptap/core'
import { debounce } from '../utils/debounce'
import { serializeDocument } from '../services/serializer'
import { saveDocument, loadDocument } from '../services/storage'

export type SaveState = 'idle' | 'typing' | 'saving' | 'saved'

export function useAutosave(
  editor: Editor | null,
  documentId: string,
  title: string
) {
  const [saveState, setSaveState] = useState<SaveState>(() => {
    return loadDocument() ? 'saved' : 'idle'
  })
  // Initialize payload tracking immediately if editor is available 
  // to prevent hydration loops or false-positive saves on load.
  const previousPayloadRef = useRef<string | null>(
    editor ? JSON.stringify(editor.getJSON()) : null
  )

  useEffect(() => {
    if (!editor) return
    
    // Make sure we have the initial payload captured when the editor activates
    if (previousPayloadRef.current === null) {
      previousPayloadRef.current = JSON.stringify(editor.getJSON())
    }

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
