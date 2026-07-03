import type { SupportedExportFormat } from '../constants/export'
import type { ExportPipeline } from '../types/pipeline'
import { parseTipTapToAST } from '../parser/parser'
import { validateExport } from '../validator/exportValidator'
import { buildDocx } from '../builders/docxBuilder'
import { docxExporter } from '../exporters/docxExporter'

/**
 * The ExportRegistry maps supported export formats to their entire processing pipelines.
 * This ensures the UI remains format-agnostic and new formats can be added dynamically.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportRegistry: Record<SupportedExportFormat, ExportPipeline<any> | null> = {
  docx: {
    parser: parseTipTapToAST,
    validator: validateExport,
    builder: buildDocx,
    exporter: docxExporter,
  },
  html: null,
  markdown: null,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getExportPipeline = (format: SupportedExportFormat): ExportPipeline<any> | null => {
  return exportRegistry[format] || null
}
