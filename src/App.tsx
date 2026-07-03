import { EditorProvider } from '@/features/editor/providers/EditorProvider'
import { WorkspaceLayout } from '@/features/workspace/components/WorkspaceLayout'

function App() {
  return (
    <EditorProvider initialContent="">
      <WorkspaceLayout />
    </EditorProvider>
  )
}

export default App

