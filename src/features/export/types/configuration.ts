export const EXPORT_CONFIGURATION_VERSION = 1

export interface PageMargins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface HeaderFooter {
  left?: string
  center?: string
  right?: string
}

export interface Watermark {
  enabled: boolean
  text: string
  opacity: number
  rotation: number
  color: string
}

export interface ExportConfiguration {
  version: typeof EXPORT_CONFIGURATION_VERSION
  format: 'pdf' | 'docx' | 'print'
  pageSetup: {
    size: 'A4' | 'Letter' | 'Legal'
    orientation: 'portrait' | 'landscape'
    margins: PageMargins
  }
  features: {
    header: HeaderFooter
    footer: HeaderFooter
    watermark: Watermark
    pageNumbers: {
      enabled: boolean
      position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
    }
  }
  presetId?: string
}

export interface ExportPreset {
  id: string
  name: string
  configuration: ExportConfiguration
  builtIn: boolean
}
