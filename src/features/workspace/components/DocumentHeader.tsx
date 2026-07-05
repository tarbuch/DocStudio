import React from 'react'
import { EditableTitle } from '../../document/EditableTitle'
import { DocumentMeta } from '../../document/DocumentMeta'

export const DocumentHeader: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <EditableTitle />
      <DocumentMeta />
    </div>
  )
}
