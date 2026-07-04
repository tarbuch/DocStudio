import { EditorProvider } from '@/features/editor/providers/EditorProvider'
import { DocumentProvider } from '@/features/documents/providers/DocumentProvider'
import { WorkspaceLayout } from '@/features/workspace/components/WorkspaceLayout'

function App() {
  return (
    <EditorProvider initialContent="">
      <DocumentProvider>
        <WorkspaceLayout />
      </DocumentProvider>
    </EditorProvider>
  )
}

export default App

