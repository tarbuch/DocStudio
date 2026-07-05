import React from 'react'

interface ToolbarGroupProps {
  children: React.ReactNode
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ children }) => {
  return <div className="flex items-center gap-1">{children}</div>
}
