import type { DocumentData } from '../types'

const STORAGE_KEY = 'docstudio.current-document'

/**
 * Persists the DocumentData payload to LocalStorage.
 * Completely isolated from Editor logic.
 * 
 * @param document - The structural DocumentData model
 * @returns true if successful, false otherwise
 */
export const saveDocument = (document: DocumentData): boolean => {
  try {
    const serialized = JSON.stringify(document)
    window.localStorage.setItem(STORAGE_KEY, serialized)
    return true
  } catch (error) {
    console.error('Failed to save document to local storage', error)
    return false
  }
}

/**
 * Loads the current active document from LocalStorage.
 * 
 * @returns The parsed DocumentData model or null if non-existent or corrupted
 */
export const loadDocument = (): DocumentData | null => {
  try {
    const serialized = window.localStorage.getItem(STORAGE_KEY)
    if (!serialized) {
      return null
    }
    
    const parsed = JSON.parse(serialized) as DocumentData
    
    // Very basic runtime structural check
    if (!parsed || !parsed.id || !parsed.content) {
      return null
    }
    
    return parsed
  } catch (error) {
    console.error('Failed to load document from local storage', error)
    return null
  }
}

/**
 * Removes the saved document payload from LocalStorage.
 * 
 * @returns true if successful, false otherwise
 */
export const removeDocument = (): boolean => {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to remove document from local storage', error)
    return false
  }
}

/**
 * Checks if a stored document payload exists.
 * 
 * @returns true if a document is persisted, false otherwise
 */
export const hasDocument = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}
