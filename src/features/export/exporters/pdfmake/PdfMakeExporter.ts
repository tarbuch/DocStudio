import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions } from 'pdfmake/interfaces'
import type { ExportExporter } from '../../types'

// Initialize fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs

export const PdfMakeExporter: ExportExporter<TDocumentDefinitions> = async (document, context) => {
  return new Promise((resolve, reject) => {
    try {
      const pdf = pdfMake.createPdf(document)
      
      pdf.getBlob((blob) => {
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
      })
    } catch (e) {
      reject(e)
    }
  })
}
