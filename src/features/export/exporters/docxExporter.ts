import { Packer } from 'docx'
import type { JSONContent } from '@tiptap/core'
import { parseTipTapToAST } from '../parser/parser'
import { buildDocx } from '../builders/docxBuilder'
import { DEFAULT_FILENAME, DOCX_EXTENSION } from '../constants/export'

/**
 * Orchestrates the DOCX export pipeline:
 * 1. TipTap JSON -> DocumentAST (Parser)
 * 2. DocumentAST -> docx.Document (Builder)
 * 3. docx.Document -> Blob -> Download (Exporter)
 */
export const exportToDocx = async (content: JSONContent, title: string): Promise<void> => {
  try {
    // Step 1: Parse to intermediate AST
    const ast = parseTipTapToAST(content)

    // Step 2: Build DOCX document
    const doc = buildDocx(ast, title)

    // Step 3: Pack to binary Blob
    const blob = await Packer.toBlob(doc)

    // Step 4: Trigger browser download
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || DEFAULT_FILENAME}${DOCX_EXTENSION}`
    document.body.appendChild(a)
    a.click()
    
    // Cleanup
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to export DOCX:', error)
    throw new Error(`Export pipeline failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { cause: error })
  }
}
