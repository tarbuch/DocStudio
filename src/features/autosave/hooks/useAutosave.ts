import { useState, useEffect, useRef, useCallback } from 'react'
import type { Editor } from '@tiptap/core'
import { debounce } from '../utils/debounce'
import { storageProvider } from '../../documents/services/documentStorage'
import { incrementDocumentRevision, saveSnapshot } from '../../documents/services/documentManager'

export type SaveState = 'idle' | 'typing' | 'saving' | 'saved'

export function useAutosave(
  editor: Editor | null,
  documentId: string,
  title: string
) {
  const [saveState, setSaveState] = useState<SaveState>('idle')
  
  const previousPayloadRef = useRef<string | null>(
    editor ? JSON.stringify(editor.getJSON()) : null
  )
  const lastSnapshotTimeRef = useRef<number>(0)

  // We maintain a ref to the latest save function so flushAutosave can call it
  const executeSaveRef = useRef<() => Promise<void>>(async () => {})

  useEffect(() => {
    if (!editor || documentId === 'temp') return
    
    if (previousPayloadRef.current === null) {
      previousPayloadRef.current = JSON.stringify(editor.getJSON())
    }
    
    if (lastSnapshotTimeRef.current === 0) {
      lastSnapshotTimeRef.current = Date.now()
    }

    const executeSave = async () => {
      setSaveState('saving')
      const content = editor.getJSON()
      const payloadString = JSON.stringify(content)
      
      if (previousPayloadRef.current === payloadString) {
        setSaveState('saved')
        return
      }

      try {
        await storageProvider.saveContent(documentId, { 
          content,
          lastSelection: {
            from: editor.state.selection.from,
            to: editor.state.selection.to,
          }
        })
        await incrementDocumentRevision(documentId)

        // Save a snapshot if 5 minutes have passed
        const now = Date.now()
        if (now - lastSnapshotTimeRef.current >= 5 * 60 * 1000) {
          await saveSnapshot(documentId, content)
          lastSnapshotTimeRef.current = now
        }

        previousPayloadRef.current = payloadString
        setSaveState('saved')
      } catch (e) {
        console.error('Failed to autosave', e)
        setSaveState('idle')
      }
    }

    executeSaveRef.current = executeSave

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

  const flushAutosave = useCallback(async () => {
    await executeSaveRef.current()
  }, [])

  return { saveState, flushAutosave }
}
