import type { JSONContent } from '@tiptap/core'
import type { DocumentAST, ExportMetrics } from './document'
import type { ExportConfiguration } from './configuration'
import type { PageLayout } from './layout'
import type { SupportedExportFormat } from '../constants/export'

export type ValidationSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'FATAL'

export interface ValidationIssue {
  severity: ValidationSeverity
  message: string
  code?: string
}

export interface ExportValidationResult {
  valid: boolean // false ONLY if there are FATAL issues
  issues: ValidationIssue[]
  metrics: ExportMetrics
}

export interface ResolvedAsset {
  data: ArrayBuffer
  mimeType: string
  width?: number
  height?: number
}

export interface AssetResolver {
  resolve(src: string): Promise<ResolvedAsset | null>
}

export interface ExportOptions {
  includeMetadata?: boolean
  includeComments?: boolean
  includeUnsupportedWarnings?: boolean
  pageMargins?: { top: number; bottom: number; left: number; right: number }
  orientation?: 'portrait' | 'landscape'
  assetResolver?: AssetResolver
}

export interface ExportContext {
  documentId: string
  documentTitle: string
  configuration: ExportConfiguration
  layout: PageLayout
  ast: DocumentAST
  metrics: ExportMetrics
  validation: ExportValidationResult
  assets: Map<string, ResolvedAsset>
}

export interface ExportResult {
  success: boolean
  filename: string
  format: SupportedExportFormat
  duration: number
  pages: number
  fileSize: number
  warnings: ValidationIssue[]
  generatedAt: number
  output?: Blob
  
  // Keep legacy metrics for diagnostic
  metrics?: ExportMetrics
  assetsResolved: number
  assetsFailed: number
  assetsSkipped: number
  error?: string
}

export interface ExportParser {
  (content: JSONContent): DocumentAST
}

export interface ExportValidator {
  (context: Omit<ExportContext, 'validation'>): ExportValidationResult
}

export interface ExportBuilder<T = unknown> {
  (context: ExportContext): T // pure & synchronous
}

export interface ExportExporter<T = unknown> {
  (document: T, context: ExportContext): Promise<string> // Returns the filename
}

export interface ExportPipeline<T = unknown> {
  version: string
  parser: ExportParser
  validator: ExportValidator
  builder: ExportBuilder<T>
  exporter: ExportExporter<T>
}
