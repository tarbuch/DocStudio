import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { parseTipTapToAST } from '../parser/parser'
import { validateExport } from '../validator/exportValidator'
import { buildDocx } from '../builders/docxBuilder'
import type { AssetResolver, ResolvedAsset, ExportContext, AnyExportNode } from '../types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Mock resolver for fixtures
class MockAssetResolver implements AssetResolver {
  async resolve(src: string): Promise<ResolvedAsset | null> {
    if (src.startsWith('data:')) {
      // Decode data URI
      return {
        data: new ArrayBuffer(8),
        mimeType: 'image/png',
      }
    }
    if (src.includes('test.png')) {
      return {
        data: new ArrayBuffer(8),
        mimeType: 'image/png',
      }
    }
    if (src.includes('test.jpg')) {
      return {
        data: new ArrayBuffer(8),
        mimeType: 'image/jpeg',
      }
    }
    // Fail for broken or unsupported formats
    return null
  }
}

async function verifyFixture(fileName: string) {
  const filePath = path.join(__dirname, 'fixtures', fileName)
  console.log(`Verifying fixture: ${fileName}`)
  
  const rawContent = fs.readFileSync(filePath, 'utf8')
  const jsonContent = JSON.parse(rawContent)

  // 1. Parse
  const ast = parseTipTapToAST(jsonContent)
  
  // 2. Mock Image pre-resolution
  const resolvedAssets = new Map<string, ResolvedAsset>()
  const resolver = new MockAssetResolver()
  
  const collectImageSrcs = (nodes: AnyExportNode[]): string[] => {
    const srcs: string[] = []
    const traverse = (node: AnyExportNode) => {
      if (node.type === 'image') {
        srcs.push(node.src)
      } else if ('content' in node && Array.isArray(node.content)) {
        node.content.forEach(traverse)
      }
    }
    nodes.forEach(traverse)
    return srcs
  }

  const srcs = collectImageSrcs(ast.content)
  for (const src of srcs) {
    const asset = await resolver.resolve(src)
    if (asset) {
      resolvedAssets.set(src, asset)
    }
  }

  // 3. Validate
  const baseContext: Omit<ExportContext, 'validation'> = {
    documentTitle: 'Test Doc',
    format: 'docx',
    options: { assetResolver: resolver },
    ast,
    metrics: ast.metrics,
    resolvedAssets,
  }

  const validation = validateExport(baseContext)
  console.log(`  Validation passed: ${validation.valid}, Issues count: ${validation.issues.length}`)
  
  const context: ExportContext = {
    ...baseContext,
    validation,
  }

  // 4. Build (Must not throw)
  const doc = buildDocx(context)
  if (!doc) {
    throw new Error(`Failed to build document for fixture: ${fileName}`)
  }

  console.log(`  Fixture ${fileName} verified successfully!`)
}

async function main() {
  const fixturesDir = path.join(__dirname, 'fixtures')
  const files = fs.readdirSync(fixturesDir)

  for (const file of files) {
    if (file.endsWith('.json')) {
      await verifyFixture(file)
    }
  }
}

main().catch((err) => {
  console.error('Fixture verification failed:', err)
  process.exit(1)
})
