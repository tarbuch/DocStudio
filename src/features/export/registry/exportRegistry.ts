import type { SupportedExportFormat } from '../constants/export'
import type { ExportPipeline, ExportExporter } from '../types/pipeline'
import { parseTipTapToAST } from '../parser/parser'
import { validateExport } from '../validator/exportValidator'
import { buildDocx } from '../builders/docxBuilder'
import { docxExporter } from '../exporters/docxExporter'

export interface VersionedPipelines {
  versions: Record<string, ExportPipeline<unknown>>
  current: string
}

/**
 * The ExportRegistry maps supported export formats to versioned processing pipelines.
 * This ensures the UI remains format-agnostic and new formats/versions can be added dynamically.
 */
export const exportRegistry: Record<SupportedExportFormat, VersionedPipelines | null> = {
  docx: {
    versions: {
      v1: {
        version: 'v1',
        parser: parseTipTapToAST,
        validator: validateExport,
        builder: buildDocx,
        exporter: docxExporter as unknown as ExportExporter<unknown>,
      },
    },
    current: 'v1',
  },
  html: null,
  markdown: null,
}

export const getExportPipeline = (
  format: SupportedExportFormat,
  version?: string
): ExportPipeline<unknown> | null => {
  const pipelineSet = exportRegistry[format]
  if (!pipelineSet) return null

  const targetVersion = version || pipelineSet.current
  return pipelineSet.versions[targetVersion] || null
}
