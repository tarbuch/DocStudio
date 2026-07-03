import { parseTipTapToAST } from './src/features/export/parser/parser'
import { BrowserAssetResolver } from './src/features/export/utils/assetResolver'
import { getExportPipeline } from './src/features/export/registry/exportRegistry'
import { ExportContext } from './src/features/export/types'

async function run() {
  const content = {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'image',
            attrs: {
              src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
              width: 100,
              height: 100
            }
          }
        ]
      }
    ]
  }

  console.log('--- 1. AST PARSING ---')
  const ast = parseTipTapToAST(content as any)
  console.log('Images in AST metrics:', ast.metrics.images)
  console.log('Image node in AST:', JSON.stringify(ast.content[0], null, 2))
  
  const pipeline = getExportPipeline('docx')
  if (!pipeline) {
    console.error('No pipeline found')
    return
  }
  
  const resolver = new BrowserAssetResolver()
  const asset = await resolver.resolve((ast.content[0] as any).content[0].src)
  
  console.log('--- 2. ASSET RESOLUTION ---')
  console.log('Asset resolved:', !!asset)
  
  const resolvedAssets = new Map()
  if (asset) {
    resolvedAssets.set((ast.content[0] as any).content[0].src, asset)
  }
  
  const context: ExportContext = {
    documentTitle: 'Test Doc',
    format: 'docx',
    options: {},
    ast,
    metrics: ast.metrics,
    resolvedAssets,
    validation: { isValid: true, issues: [] }
  }
  
  console.log('--- 3. BUILDER ---')
  const docx = pipeline.builder(context)
  
  // Docx document structure
  const rootElement = docx as any
  console.log('Docx created.')
  
  // Usually the structure is docx.sections[0].root[0]
  // Let's print out the sections to see if ImageRun is there.
  try {
    const sections = rootElement.sections || rootElement.document?.sections
    if (sections) {
      console.log('Sections length:', sections.length)
      const firstSection = sections[0]
      const children = firstSection.root || firstSection.children
      console.log('Children in first section:', children.length)
      
      const firstChild = children[0]
      console.log('First child type (Paragraph?):', firstChild.constructor.name)
      
      const runs = firstChild.root || firstChild.children || []
      console.log('Runs in paragraph:', runs.length)
      
      if (runs.length > 0) {
        console.log('First run type:', runs[0].constructor.name)
      } else {
        console.log('No runs found inside the paragraph.')
      }
    }
  } catch (e) {
    console.error('Failed to inspect document structure', e)
  }
}

run().catch(console.error)
