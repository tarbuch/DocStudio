import { Packer, Document } from 'docx'
import { DEFAULT_FILENAME, DOCX_EXTENSION } from '../constants/export'

/**
 * Handles browser-specific download logic for DOCX.
 * Receives a built docx.Document and triggers the download.
 */
export const docxExporter = async (docxDocument: Document, title: string): Promise<string> => {
  try {
    // Step 1: Pack to binary Blob
    const blob = await Packer.toBlob(docxDocument)

    // Step 2: Generate safe filename
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || DEFAULT_FILENAME
    const filename = `${safeTitle}${DOCX_EXTENSION}`

    // Step 3: Trigger browser download
    const url = URL.createObjectURL(blob)
    const a = window.document.createElement('a')
    a.href = url
    a.download = filename
    window.document.body.appendChild(a)
    a.click()
    
    // Cleanup
    window.document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return filename
  } catch (error) {
    throw new Error(`Export download failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { cause: error })
  }
}
