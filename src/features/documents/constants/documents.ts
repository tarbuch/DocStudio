export const DOCUMENT_CONSTANTS = {
  // Storage Keys
  STORAGE_KEY_LIBRARY: 'docstudio.library',
  STORAGE_KEY_FOLDER_LIBRARY: 'docstudio.folder.library',
  STORAGE_KEY_DOCUMENT_PREFIX: 'docstudio.document.',
  STORAGE_KEY_PREFERENCES: 'docstudio.preferences',
  STORAGE_KEY_TRASH: 'docstudio.trash',

  // Curated Folder Colors (predefined tailwind text colors)
  FOLDER_COLORS: {
    gray: 'text-gray-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    pink: 'text-pink-500',
    yellow: 'text-yellow-500',
  } as Record<string, string>,

  // Curated Folder Icons
  FOLDER_ICONS: {
    default: '📁',
    open: '📂',
    favorites: '⭐',
    study: '📚',
    work: '💼',
    notes: '📝',
    archive: '📦',
    design: '🎨',
    project: '⚙️',
  } as Record<string, string>,
  
  // Magic Strings
  DEFAULT_DOCUMENT_TITLE: 'Untitled Document',
  
  // Dimensions
  SIDEBAR_WIDTH_DESKTOP: 'w-72',
  SIDEBAR_WIDTH_TABLET: 'w-64',
  
  // Limits
  MAX_RECENT_DOCUMENTS: 10,
}
