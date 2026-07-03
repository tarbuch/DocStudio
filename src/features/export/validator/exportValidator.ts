import type { DocumentAST } from '../types/document'
import type { ExportValidationResult } from '../types/pipeline'

export const validateExport = (ast: DocumentAST): ExportValidationResult => {
  const warnings: string[] = []
  const errors: string[] = []

  if (!ast.content || ast.content.length === 0) {
    warnings.push('Document is empty.')
  }

  if (ast.metrics.unsupportedNodes > 0) {
    warnings.push(`Document contains ${ast.metrics.unsupportedNodes} unsupported element(s). They will be ignored in the export.`)
  }

  // Future checks: invalid hierarchies, missing metadata, etc.

  return {
    valid: errors.length === 0,
    warnings,
    errors,
    unsupportedNodes: ast.unsupportedNodes,
    metrics: ast.metrics,
  }
}
