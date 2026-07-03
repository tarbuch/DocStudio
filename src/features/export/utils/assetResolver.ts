import type { AssetResolver, ResolvedAsset } from '../types/pipeline'

/**
 * Native Browser Asset Resolver implementation.
 * Supports standard HTTP/HTTPS URLs and Base64 Data URIs.
 * Restricts images to PNG and JPEG.
 */
export class BrowserAssetResolver implements AssetResolver {
  async resolve(src: string): Promise<ResolvedAsset | null> {
    try {
      // 1. Handle Base64 Data URIs
      if (src.startsWith('data:')) {
        const match = src.match(/^data:(image\/[a-zA-Z+-]+);base64,(.+)$/)
        if (!match) return null

        const mimeType = match[1]
        const base64Data = match[2]

        if (!this.isSupportedMimeType(mimeType)) {
          return null
        }

        const binaryStr = atob(base64Data)
        const len = binaryStr.length
        const bytes = new Uint8Array(len)
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i)
        }

        return {
          data: bytes.buffer,
          mimeType,
        }
      }

      // 2. Handle HTTP/HTTPS URLs
      if (src.startsWith('http://') || src.startsWith('https://')) {
        const response = await fetch(src)
        if (!response.ok) return null

        const mimeType = response.headers.get('content-type') || ''
        if (!this.isSupportedMimeType(mimeType)) {
          return null
        }

        const arrayBuffer = await response.arrayBuffer()
        return {
          data: arrayBuffer,
          mimeType,
        }
      }

      return null
    } catch (error) {
      console.error('Failed to resolve asset:', src, error)
      return null
    }
  }

  private isSupportedMimeType(mimeType: string): boolean {
    const lowerMime = mimeType.toLowerCase()
    return lowerMime === 'image/png' || lowerMime === 'image/jpeg' || lowerMime === 'image/jpg'
  }
}
