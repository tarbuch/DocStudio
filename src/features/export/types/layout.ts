export interface PageLayout {
  /** Page size in mm */
  width: number
  height: number

  /** Printable area size in mm */
  printableWidth: number
  printableHeight: number

  /** Margins in mm */
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }

  /** The original paper size requested */
  paperSize: 'A4' | 'Letter' | 'Legal'
  /** The original orientation requested */
  orientation: 'portrait' | 'landscape'
}
