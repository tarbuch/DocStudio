import type { ExportConfiguration } from '../types/configuration'
import type { PageLayout } from '../types/layout'

const PAGE_DIMENSIONS_MM = {
  'A4': { width: 210, height: 297 },
  'Letter': { width: 215.9, height: 279.4 },
  'Legal': { width: 215.9, height: 355.6 },
}

/**
 * Resolves the given export configuration into a concrete page layout in millimeters.
 */
export const resolveLayout = (config: ExportConfiguration): PageLayout => {
  const { size, orientation, margins } = config.pageSetup

  const baseDimensions = PAGE_DIMENSIONS_MM[size]
  let width = baseDimensions.width
  let height = baseDimensions.height

  if (orientation === 'landscape') {
    width = baseDimensions.height
    height = baseDimensions.width
  }

  const printableWidth = width - margins.left - margins.right
  const printableHeight = height - margins.top - margins.bottom

  return {
    width,
    height,
    printableWidth: Math.max(0, printableWidth),
    printableHeight: Math.max(0, printableHeight),
    margins,
    paperSize: size,
    orientation,
  }
}
