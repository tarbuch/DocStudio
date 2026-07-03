import { EditorProvider } from '@/features/editor/providers/EditorProvider'
import { WorkspaceLayout } from '@/features/workspace/components/WorkspaceLayout'

function App() {
  return (
    <EditorProvider initialContent="<h2>DocStudio Workspace</h2><p>Begin crafting your document here...</p>">
      <WorkspaceLayout />
    </EditorProvider>
  )
}

export default App

