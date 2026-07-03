export const DEFAULT_FILENAME = 'document'
export const DOCX_EXTENSION = '.docx'
export const EXPORT_VERSION = 1

export const SupportedExportFormats = {
  DOCX: 'docx',
  HTML: 'html',
  MARKDOWN: 'markdown',
} as const

export type SupportedExportFormat = typeof SupportedExportFormats[keyof typeof SupportedExportFormats]
