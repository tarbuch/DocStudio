import type { TDocumentDefinitions, Content, StyleDictionary, TableCell } from 'pdfmake/interfaces'
import type { 
  ExportBuilder, 
  ExportContext, 
  AnyExportNode,
  TextNode,
  HeadingNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  TableHeaderNode,
  ImageNode
} from '../../types'

export const PdfMakeBuilder: ExportBuilder<TDocumentDefinitions> = (context) => {
  const { ast, layout } = context
  
  const mmToPt = (mm: number) => mm * 2.834645669

  const content: Content[] = []
  
  const processNode = (node: AnyExportNode): Content | null => {
    switch (node.type) {
      case 'paragraph':
        return {
          text: (node.content || []).map(c => processTextOrImage(c as TextNode | ImageNode, context)).filter(Boolean) as Content[],
          margin: [0, 5, 0, 5],
          alignment: (node.alignment as 'left' | 'center' | 'right' | 'justify') || 'left',
        }
      case 'heading': {
        const headingNode = node as HeadingNode
        return {
          text: (headingNode.content || []).map(c => processTextOrImage(c as TextNode | ImageNode, context)).filter(Boolean) as Content[],
          style: `h${headingNode.level || 1}`,
          margin: [0, 10, 0, 5],
          alignment: (headingNode.alignment as 'left' | 'center' | 'right' | 'justify') || 'left',
        }
      }
      case 'bulletList':
      case 'orderedList':
        return processList(node, context)
      case 'table':
        return processTable(node as TableNode, context)
      case 'image': {
        const img = processImage(node as ImageNode, context)
        if (!img) return null
        return {
          ...(img as { image: string, width: number }),
          margin: [0, 5, 0, 5],
          alignment: (node.alignment as 'left' | 'center' | 'right') || 'left',
        }
      }
      default:
        return null
    }
  }

  ast.content.forEach(node => {
    const processed = processNode(node)
    if (processed) {
      content.push(processed)
    }
  })

  const styles: StyleDictionary = {
    h1: { fontSize: 24, bold: true },
    h2: { fontSize: 18, bold: true },
    h3: { fontSize: 14, bold: true },
    h4: { fontSize: 12, bold: true },
    h5: { fontSize: 10, bold: true },
    h6: { fontSize: 10, bold: true },
  }

  const margins = layout.margins

  return {
    pageSize: { width: mmToPt(layout.width), height: mmToPt(layout.height) },
    pageOrientation: layout.orientation,
    pageMargins: [mmToPt(margins.left), mmToPt(margins.top), mmToPt(margins.right), mmToPt(margins.bottom)],
    content,
    styles,
    info: {
      title: context.documentTitle,
    }
  }
}

const processTextOrImage = (node: TextNode | ImageNode, context: ExportContext): Content | null => {
  if (node.type === 'image') {
    return processImage(node as ImageNode, context)
  }

  if (node.type === 'text') {
    const textNode = node as TextNode
    const isBold = textNode.marks?.some(m => m.type === 'bold')
    const isItalic = textNode.marks?.some(m => m.type === 'italic')
    const isUnderline = textNode.marks?.some(m => m.type === 'underline')

    return {
      text: textNode.text,
      bold: isBold,
      italics: isItalic,
      decoration: isUnderline ? 'underline' : undefined,
    }
  }
  return null
}

const processImage = (node: ImageNode, context: ExportContext): Content | null => {
  const asset = context.assets.get(node.src)
  if (!asset) return null

  // pdfmake requires base64 string or dataURI, so we must convert ArrayBuffer
  let binary = ''
  const bytes = new Uint8Array(asset.data)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  const base64 = btoa(binary)
  const dataUri = `data:${asset.mimeType};base64,${base64}`

  const width = node.width || 400
  return {
    image: dataUri,
    width: Math.min(width, 500) // constraint
  }
}

const processList = (node: AnyExportNode & { content?: AnyExportNode[] }, context: ExportContext): Content | null => {
  const items = (node.content || []).filter((li: AnyExportNode) => li.type === 'listItem').map((li: AnyExportNode) => {
    const liContent = ('content' in li ? li.content : []) || []
    return liContent.map((child: AnyExportNode) => {
      if (child.type === 'paragraph') {
        const childContent = 'content' in child ? child.content : []
        return (childContent || []).map((c: AnyExportNode) => processTextOrImage(c as TextNode | ImageNode, context)).filter(Boolean)
      } else if (child.type === 'bulletList' || child.type === 'orderedList') {
        return processList(child, context)
      }
      return null
    }).filter(Boolean)
  })

  if (node.type === 'orderedList') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { ol: items as any, margin: [0, 5, 0, 5] }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { ul: items as any, margin: [0, 5, 0, 5] }
}

const processTable = (node: TableNode, context: ExportContext): Content | null => {
  const rows = node.content || []
  
  const body = rows.map((r: AnyExportNode) => {
    const tr = r as TableRowNode
    return (tr.content || []).map((c: AnyExportNode) => {
      const tc = c as TableCellNode | TableHeaderNode
      const cellContent = (tc.content || []).map((child: AnyExportNode) => {
        if (child.type === 'paragraph') {
          const childContent = 'content' in child ? child.content : []
          return {
            text: (childContent || []).map((n: AnyExportNode) => processTextOrImage(n as TextNode | ImageNode, context)).filter(Boolean)
          }
        }
        return null
      }).filter(Boolean)

      return {
        stack: cellContent,
        fillColor: tc.type === 'tableHeader' ? '#f3f4f6' : undefined,
      } as TableCell
    })
  })

  // Basic table widths logic (distribute evenly)
  const colsCount = body[0]?.length || 1
  const widths = Array(colsCount).fill('*')

  return {
    table: {
      headerRows: rows.some((r: AnyExportNode) => r.type === 'tableRow' && r.content?.some((c: AnyExportNode) => c.type === 'tableHeader')) ? 1 : 0,
      widths,
      body,
    },
    margin: [0, 5, 0, 5]
  }
}
