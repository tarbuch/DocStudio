import { describe, it, expect } from 'vitest'
import { resolveLayout } from './layoutResolver'
import type { ExportConfiguration } from '../types/configuration'
import { EXPORT_CONFIGURATION_VERSION } from '../types/configuration'

describe('layoutResolver', () => {
  const createConfig = (
    size: 'A4' | 'Letter' | 'Legal',
    orientation: 'portrait' | 'landscape',
    margins = { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 }
  ): ExportConfiguration => ({
    version: EXPORT_CONFIGURATION_VERSION,
    format: 'pdf',
    pageSetup: {
      size,
      orientation,
      margins,
    },
    features: {
      header: {},
      footer: {},
      watermark: { enabled: false, text: '', opacity: 0.2, rotation: -45, color: '#000000' },
      pageNumbers: { enabled: true, position: 'bottom-right' },
    },
  })

  it('resolves A4 portrait correctly', () => {
    const config = createConfig('A4', 'portrait')
    const layout = resolveLayout(config)

    expect(layout.paperSize).toBe('A4')
    expect(layout.orientation).toBe('portrait')
    expect(layout.width).toBe(210)
    expect(layout.height).toBe(297)
    expect(layout.printableWidth).toBeCloseTo(210 - 25.4 - 25.4)
    expect(layout.printableHeight).toBeCloseTo(297 - 25.4 - 25.4)
  })

  it('resolves A4 landscape correctly', () => {
    const config = createConfig('A4', 'landscape')
    const layout = resolveLayout(config)

    expect(layout.paperSize).toBe('A4')
    expect(layout.orientation).toBe('landscape')
    expect(layout.width).toBe(297) // Swapped
    expect(layout.height).toBe(210)
    expect(layout.printableWidth).toBeCloseTo(297 - 25.4 - 25.4)
    expect(layout.printableHeight).toBeCloseTo(210 - 25.4 - 25.4)
  })

  it('resolves Letter portrait correctly', () => {
    const config = createConfig('Letter', 'portrait')
    const layout = resolveLayout(config)

    expect(layout.width).toBe(215.9)
    expect(layout.height).toBe(279.4)
  })

  it('resolves Legal landscape correctly', () => {
    const config = createConfig('Legal', 'landscape')
    const layout = resolveLayout(config)

    expect(layout.width).toBe(355.6)
    expect(layout.height).toBe(215.9)
  })

  it('calculates custom margins correctly', () => {
    const config = createConfig('A4', 'portrait', { top: 10, right: 20, bottom: 30, left: 40 })
    const layout = resolveLayout(config)

    expect(layout.margins.top).toBe(10)
    expect(layout.margins.left).toBe(40)
    expect(layout.printableWidth).toBe(210 - 20 - 40)
    expect(layout.printableHeight).toBe(297 - 10 - 30)
  })
})
