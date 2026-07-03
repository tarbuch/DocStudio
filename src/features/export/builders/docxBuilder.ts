import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
  AlignmentType,
} from 'docx'
import type {
  AnyExportNode,
  TextNode,
  HeadingNode,
  TableNode,
  TableRowNode,
  TableHeaderNode,
  TableCellNode,
  ImageNode,
  ExportContext,
} from '../types'
import { DEFAULT_IMAGE_WIDTH, MAX_IMAGE_WIDTH } from '../constants/export'

/**
 * Builds a docx.Document from a DocStudio ExportContext
 * (Pure & Synchronous Transformation Layer)
 */
export const buildDocx = (context: ExportContext): Document => {
  const children = context.ast.content
    .flatMap((node) => buildDocxNode(node, context))
    .filter(Boolean) as Paragraph[]

  return new Document({
    creator: 'DocStudio',
    title: context.documentTitle,
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

const buildDocxNode = (
  node: AnyExportNode,
  context: ExportContext
): Paragraph | Paragraph[] | null => {
  switch (node.type) {
    case 'paragraph':
      return new Paragraph({
        children: (node.content || [])
          .map((c) => buildParagraphChild(c as TextNode | ImageNode, context))
          .filter(Boolean) as (TextRun | ImageRun)[],
      })

    case 'heading': {
      const headingNode = node as HeadingNode
      return new Paragraph({
        heading: getHeadingLevel(headingNode.level),
        children: (headingNode.content || [])
          .filter((c) => c.type === 'text')
          .map((c) => buildTextRun(c as TextNode)),
      })
    }

    case 'bulletList':
    case 'orderedList':
      return buildListItems(node as AnyExportNode, context, 0) as unknown as Paragraph

    case 'table':
      return buildTable(node as TableNode, context) as unknown as Paragraph

    case 'image': {
      const run = buildImageRun(node as ImageNode, context)
      if (!run) return null
      return new Paragraph({
        children: [run],
        alignment: node.alignment ? getParagraphAlignment(node.alignment) : undefined,
      })
    }

    case 'tableRow':
    case 'tableHeader':
    case 'tableCell':
    case 'listItem':
    case 'unsupported':
    case 'text':
      return null
  }
}

const buildParagraphChild = (
  child: TextNode | ImageNode,
  context: ExportContext
): TextRun | ImageRun | null => {
  if (child.type === 'text') {
    return buildTextRun(child as TextNode)
  }
  if (child.type === 'image') {
    return buildImageRun(child as ImageNode, context)
  }
  return null
}

const buildImageRun = (node: ImageNode, context: ExportContext): ImageRun | null => {
  const asset = context.resolvedAssets.get(node.src)
  if (!asset) return null

  const width = node.width || DEFAULT_IMAGE_WIDTH
  const height = node.height || width * 0.75

  const finalWidth = Math.min(width, MAX_IMAGE_WIDTH)
  const scale = finalWidth / width
  const finalHeight = height * scale

  const lowerMime = asset.mimeType.toLowerCase()
  if (!lowerMime.startsWith('image/')) return null

  let imageType: 'png' | 'jpg' = 'png'
  if (lowerMime === 'image/jpeg' || lowerMime === 'image/jpg') {
    imageType = 'jpg'
  }

  return new ImageRun({
    data: asset.data,
    transformation: {
      width: finalWidth,
      height: finalHeight,
    },
    type: imageType,
  })
}

const getParagraphAlignment = (align: 'left' | 'center' | 'right') => {
  switch (align) {
    case 'left':
      return AlignmentType.LEFT
    case 'center':
      return AlignmentType.CENTER
    case 'right':
      return AlignmentType.RIGHT
    default:
      return AlignmentType.LEFT
  }
}

const buildTable = (node: TableNode, context: ExportContext) => {
  const rows = node.content || []
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: rows.map((r) => buildTableRow(r, context)),
  })
}

const buildTableRow = (node: TableRowNode, context: ExportContext) => {
  const cells = node.content || []
  return new TableRow({
    children: cells.map((c) => buildTableCell(c, context)),
  })
}

const buildTableCell = (node: TableHeaderNode | TableCellNode, context: ExportContext) => {
  const cellContent = node.content || []
  return new TableCell({
    children: cellContent
      .flatMap((c) => buildDocxNode(c, context))
      .filter(Boolean) as Paragraph[],
  })
}

const buildListItems = (
  listNode: AnyExportNode,
  context: ExportContext,
  level: number = 0
): Paragraph[] => {
  const isOrdered = listNode.type === 'orderedList'
  const items: Paragraph[] = []

  if (listNode.type === 'bulletList' || listNode.type === 'orderedList') {
    const listItems = (listNode.content as AnyExportNode[]) || []

    listItems.forEach((li) => {
      if (li.type !== 'listItem') return

      const liContent = li.content || []
      liContent.forEach((child) => {
        if (child.type === 'paragraph') {
          items.push(
            new Paragraph({
              children: (child.content || [])
                .map((c) => buildParagraphChild(c as TextNode | ImageNode, context))
                .filter(Boolean) as (TextRun | ImageRun)[],
              bullet: !isOrdered ? { level } : undefined,
              numbering: isOrdered ? { reference: 'ordered', level } : undefined,
            })
          )
        } else if (child.type === 'bulletList' || child.type === 'orderedList') {
          items.push(...buildListItems(child, context, level + 1))
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
