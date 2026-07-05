import type { ExportContext, ExportValidationResult, ValidationIssue } from '../types/pipeline'

export const validateExport = (
  context: Omit<ExportContext, 'validation'>
): ExportValidationResult => {
  const issues: ValidationIssue[] = []
  const ast = context.ast

  // FATAL validation: corrupted document
  if (!ast || ast.type !== 'document') {
    issues.push({
      severity: 'FATAL',
      message: 'Corrupted document structure: Root node is not a document.',
    })
  }

  // WARNING validation: empty document
  if (!ast.content || ast.content.length === 0) {
    issues.push({
      severity: 'WARNING',
      message: 'The document contains no content to export.',
    })
  }

  // WARNING validation: unsupported nodes
  if (ast.metrics.unsupportedNodes > 0) {
    issues.push({
      severity: 'WARNING',
      message: `Document contains ${ast.metrics.unsupportedNodes} unsupported element(s) that will be omitted.`,
    })
  }

  // INFO validation: missing metadata options or checks
  if (!context.documentTitle || context.documentTitle.trim() === '') {
    issues.push({
      severity: 'INFO',
      message: 'Document title is empty, exporting as untitled.',
    })
  }

  // Check if any issue has FATAL severity
  const hasFatal = issues.some((issue) => issue.severity === 'FATAL')

  return {
    valid: !hasFatal,
    issues,
    metrics: ast.metrics,
  }
}
