import { LocalStorageProvider } from './storage/LocalStorageProvider'
import type { DocumentStorageProvider } from './storage/types'

export const storageProvider: DocumentStorageProvider = new LocalStorageProvider()
