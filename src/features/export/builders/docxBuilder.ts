import { Document, Paragraph, TextRun, HeadingLevel } from 'docx'
import type {
  DocumentAST,
  AnyExportNode,
  TextNode,
  HeadingNode,
} from '../types'

/**
 * Builds a docx.Document from a DocStudio DocumentAST
 */
export const buildDocx = (ast: DocumentAST, title: string = 'Document'): Document => {
  const children = ast.content
    .flatMap((node) => buildDocxNode(node))
    .filter(Boolean) as Paragraph[]

  return new Document({
    creator: 'DocStudio',
    title: title,
    numbering: {
      config: [
        {
          reference: 'ordered',
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: 'start',
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {},
        children,
      },
    ],
  })
}

const buildDocxNode = (node: AnyExportNode): Paragraph | Paragraph[] | null => {
  switch (node.type) {
    case 'paragraph':
      return new Paragraph({
        children: node.content
          ?.filter((c) => c.type === 'text')
          .map((c) => buildTextRun(c as TextNode)) || [],
      })

    case 'heading': {
      const headingNode = node as HeadingNode
      return new Paragraph({
        heading: getHeadingLevel(headingNode.level),
        children: headingNode.content
          ?.filter((c) => c.type === 'text')
          .map((c) => buildTextRun(c as TextNode)) || [],
      })
    }

    case 'bulletList':
    case 'orderedList':
      // Lists are expanded into individual paragraphs with bullet/numbering config
      return buildListItems(node as AnyExportNode, 0) as unknown as Paragraph

    case 'listItem':
    case 'unsupported':
    case 'text':
      return null
  }
}

const buildListItems = (listNode: AnyExportNode, level: number = 0): Paragraph[] => {
  const isOrdered = listNode.type === 'orderedList'
  const items: Paragraph[] = []

  if (listNode.type === 'bulletList' || listNode.type === 'orderedList') {
    const listItems = listNode.content as AnyExportNode[] || []
    
    listItems.forEach((li) => {
      if (li.type !== 'listItem') return
      
      const liContent = li.content || []
      liContent.forEach((child) => {
        if (child.type === 'paragraph') {
          items.push(
            new Paragraph({
              children: (child.content || [])
                .filter((c) => c.type === 'text')
                .map((c) => buildTextRun(c as TextNode)),
              bullet: !isOrdered ? { level } : undefined,
              numbering: isOrdered ? { reference: 'ordered', level } : undefined,
            })
          )
        } else if (child.type === 'bulletList' || child.type === 'orderedList') {
          // Nested lists
          items.push(...buildListItems(child, level + 1))
        }
      })
    })
  }

  return items
}

const buildTextRun = (node: TextNode): TextRun => {
  const isBold = node.marks?.some((m) => m.type === 'bold')
  const isItalic = node.marks?.some((m) => m.type === 'italic')
  const isUnderline = node.marks?.some((m) => m.type === 'underline')

  return new TextRun({
    text: node.text,
    bold: isBold,
    italics: isItalic,
    underline: isUnderline ? {} : undefined,
  })
}

const getHeadingLevel = (level: number) => {
  switch (level) {
    case 1:
      return HeadingLevel.HEADING_1
    case 2:
      return HeadingLevel.HEADING_2
    case 3:
      return HeadingLevel.HEADING_3
    case 4:
      return HeadingLevel.HEADING_4
    case 5:
      return HeadingLevel.HEADING_5
    case 6:
      return HeadingLevel.HEADING_6
    default:
      return HeadingLevel.HEADING_1
  }
}
