import type { JSONContent } from '@tiptap/core'
import type { SupportedExportFormat } from '../constants/export'
import type { ExportResult } from '../types/pipeline'
import { getExportPipeline } from '../registry/exportRegistry'

export const executeExport = async (
  format: SupportedExportFormat,
  content: JSONContent,
  title: string
): Promise<ExportResult> => {
  const pipeline = getExportPipeline(format)
  
  if (!pipeline) {
    return {
      success: false,
      format,
      duration: 0,
      error: `Export format ${format} is not supported or not registered.`,
    }
  }

  const { parser, validator, builder, exporter } = pipeline

  const start = performance.now()

  try {
    // 1. Parse
    const ast = parser(content)

    // 2. Validate
    const validation = validator(ast)
    if (!validation.valid) {
      return {
        success: false,
        format,
        duration: performance.now() - start,
        metrics: validation.metrics,
        warnings: validation.warnings,
        unsupportedNodes: validation.unsupportedNodes,
        error: `Validation failed: ${validation.errors.join(', ')}`,
      }
    }

    // 3. Build
    const doc = builder(ast, title)

    // 4. Export (Download)
    const filename = await exporter(doc, title)

    const duration = performance.now() - start

    return {
      success: true,
      filename,
      format,
      duration,
      metrics: validation.metrics,
      warnings: validation.warnings,
      unsupportedNodes: validation.unsupportedNodes,
    }
  } catch (error) {
    const duration = performance.now() - start
    return {
      success: false,
      format,
      duration,
      error: error instanceof Error ? error.message : 'Unknown export engine error',
    }
  }
}
