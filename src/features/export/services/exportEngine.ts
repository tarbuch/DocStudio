import type { JSONContent } from '@tiptap/core'
import type { SupportedExportFormat } from '../constants/export'
import type { ExportResult, ExportOptions, ExportContext, ResolvedAsset, AnyExportNode } from '../types'
import { getExportPipeline } from '../registry/exportRegistry'

/**
 * Orchestrates the export pipeline by:
 * 1. Invoking the parser to generate the DocumentAST.
 * 2. Pre-resolving all required image assets asynchronously.
 * 3. Running validation checks.
 * 4. Compiling the clean, immutable ExportContext.
 * 5. Running the pure, synchronous builder and download exporter.
 */
export const executeExport = async (
  format: SupportedExportFormat,
  content: JSONContent,
  title: string,
  options: ExportOptions = {}
): Promise<ExportResult> => {
  const start = performance.now()
  const pipeline = getExportPipeline(format)
  
  if (!pipeline) {
    return {
      success: false,
      format,
      duration: 0,
      assetsResolved: 0,
      assetsFailed: 0,
      assetsSkipped: 0,
      error: `Export format ${format} is not supported or not registered.`,
    }
  }

  const { parser, validator, builder, exporter } = pipeline

  let assetsResolved = 0
  let assetsFailed = 0
  let assetsSkipped = 0
  const resolvedAssets = new Map<string, ResolvedAsset>()

  try {
    // 1. Parse TipTap content to AST (Single-pass traversal)
    const ast = parser(content)

    // 2. Traversal to pre-collect image assets
    const uniqueSrcs = collectImageSrcs(ast.content)

    const failedResolutions: { src: string; reason: string }[] = []

    if (options.assetResolver && uniqueSrcs.length > 0) {
      const resolutions = await Promise.allSettled(
        uniqueSrcs.map(async (src) => {
          const asset = await options.assetResolver!.resolve(src)
          if (!asset) {
            throw new Error(`Resolver returned null for ${src}`)
          }
          return { src, asset }
        })
      )

      resolutions.forEach((result, index) => {
        const src = uniqueSrcs[index]
        if (result.status === 'fulfilled') {
          resolvedAssets.set(src, result.value.asset)
          assetsResolved++
        } else {
          assetsFailed++
          failedResolutions.push({
            src,
            reason: result.reason instanceof Error ? result.reason.message : 'Unknown error',
          })
          console.warn(`Failed resolving image: ${src}`, result.reason)
        }
      })
    } else {
      assetsSkipped = uniqueSrcs.length
    }

    // 3. Construct base context before validation
    const baseContext: Omit<ExportContext, 'validation'> = {
      documentTitle: title,
      format,
      options,
      ast,
      metrics: ast.metrics,
      resolvedAssets,
    }

    // 4. Validate
    const validationResult = validator(baseContext)

    // Add resolver warnings to validation feedback if any failed
    if (assetsFailed > 0) {
      validationResult.issues.push({
        severity: 'WARNING',
        message: `Failed to resolve ${assetsFailed} image asset(s). Omitted from final document.`,
      })
      failedResolutions.forEach(({ src, reason }) => {
        validationResult.issues.push({
          severity: 'WARNING',
          message: `Image failed [${src}]: ${reason}`,
        })
      })
    }

    // Fatal severity stops export
    const hasFatal = validationResult.issues.some((issue) => issue.severity === 'FATAL')
    if (hasFatal) {
      const fatalErrors = validationResult.issues
        .filter((issue) => issue.severity === 'FATAL')
        .map((issue) => issue.message)
        .join('; ')

      return {
        success: false,
        format,
        duration: performance.now() - start,
        metrics: ast.metrics,
        validation: validationResult,
        assetsResolved,
        assetsFailed,
        assetsSkipped,
        error: `Fatal validation error: ${fatalErrors}`,
      }
    }

    // 5. Build final immutable context
    const context: ExportContext = {
      ...baseContext,
      validation: validationResult,
    }

    // 6. Build document (pure transformation layer)
    const doc = builder(context)

    // 7. Export (browser download trigger)
    const filename = await exporter(doc, context)

    const duration = performance.now() - start

    return {
      success: true,
      filename,
      format,
      duration,
      metrics: ast.metrics,
      validation: validationResult,
      assetsResolved,
      assetsFailed,
      assetsSkipped,
    }
  } catch (error) {
    const duration = performance.now() - start
    return {
      success: false,
      format,
      duration,
      assetsResolved,
      assetsFailed,
      assetsSkipped,
      error: error instanceof Error ? error.message : 'Unknown export engine error',
    }
  }
}

/**
 * Traverses the parsed intermediate AST to gather unique image asset URLs.
 */
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
  return Array.from(new Set(srcs))
}
