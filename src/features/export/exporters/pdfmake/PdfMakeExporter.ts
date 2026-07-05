import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import type { ExportExporter } from '../../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).vfs = (pdfFonts as any).pdfMake ? (pdfFonts as any).pdfMake.vfs : pdfFonts

export const PdfMakeExporter: ExportExporter<TDocumentDefinitions> = async (document, context) => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = pdfMake.createPdf(document)
      
      pdf.getBlob().then((blob: Blob) => {
        const url = URL.createObjectURL(blob)
      
        // Generate filename
        const safeTitle = context.documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        const filename = `${safeTitle}.pdf`
        
        // Trigger download
        const a = window.document.createElement('a')
        a.href = url
        a.download = filename
        a.click()
        
        setTimeout(() => {
          URL.revokeObjectURL(url)
          resolve(filename)
        }, 100)
      }).catch(reject)
    } catch (e) {
      reject(e)
    }
  })
}
