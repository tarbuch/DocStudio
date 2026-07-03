import type { JSONContent } from '@tiptap/core'
import type { DocumentAST, ExportMetrics } from './document'
import type { UnsupportedNode } from './nodes'
import type { SupportedExportFormat } from '../constants/export'

export interface ExportValidationResult {
  valid: boolean
  warnings: string[]
  errors: string[]
  unsupportedNodes: UnsupportedNode[]
  metrics: ExportMetrics
}

export interface ExportResult {
  success: boolean
  filename?: string
  format: SupportedExportFormat
  duration: number
  metrics?: ExportMetrics
  warnings?: string[]
  unsupportedNodes?: UnsupportedNode[]
  error?: string
}

export interface ExportParser {
  (content: JSONContent): DocumentAST
}

export interface ExportValidator {
  (ast: DocumentAST): ExportValidationResult
}

export interface ExportBuilder<T = unknown> {
  (ast: DocumentAST, title: string): T
}

export interface ExportExporter<T = unknown> {
  (document: T, title: string): Promise<string> // Returns the filename
}

export interface ExportPipeline<T = unknown> {
  parser: ExportParser
  validator: ExportValidator
  builder: ExportBuilder<T>
  exporter: ExportExporter<T>
}
