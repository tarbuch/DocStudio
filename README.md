# DocStudio

DocStudio is a modern, responsive, and robust in-browser rich text editor designed for productivity and seamless document management. It features a complete multi-document workspace, a hierarchical folder system, rich text formatting, native drag-and-drop interactions, and extensive export capabilities (DOCX & PDF).

## Features

- **Rich Text Editor Engine**: Powered by Tiptap, supporting advanced formatting, tables, images, nested lists, and a context-aware bubble menu.
- **Slash Commands**: Rapidly insert tables, headings, images, and lists using `/` commands.
- **Workspace Architecture**: Manage multiple documents seamlessly.
- **Hierarchical Folders**: Organize your files with infinite nesting, drag-and-drop, colored icons, and safe move-to workflows.
- **Autosave & Version History**: Local debounced autosave ensures you never lose work. Access and restore up to 20 local snapshots per document via the Version History drawer.
- **Global Search**: Instantly find documents and folders with the `Ctrl + K` Command Palette, featuring fuzzy searching and live content snippets.
- **Extensive Export Engine**: Highly extensible builder pipeline exporting to **DOCX** (using `docx`) and **PDF** (using `pdfmake`).
- **Native Browser Printing**: Optimized `@media print` CSS engine ensuring clean A4-formatted physical copies.
- **Document Outline**: Automatically generated, clickable Table of Contents reflecting document headings.

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + `clsx` + `tailwind-merge`
- **Editor Engine**: Tiptap (ProseMirror)
- **Icons**: Lucide React
- **PDF Generation**: `pdfmake`
- **DOCX Generation**: `docx`
- **Testing**: Vitest & Playwright

## Architecture

DocStudio follows a highly modular design pattern separated into distinct domains:
- **UI Components (`/src/components`, `/src/features/**/components`)**: Pure React presentational components.
- **Providers (`/src/features/**/providers`)**: React Context boundaries managing global state (e.g., `DocumentProvider`, `EditorProvider`).
- **Services (`/src/features/**/services`)**: Business logic and storage abstraction (e.g., `documentManager.ts`, `folderManager.ts`).
- **Export Engine (`/src/features/export`)**: A 4-stage pipeline separating Parsing, Validation, Building, and Exporting for maximum extensibility.

## Folder Structure

```
src/
├── components/          # Reusable shared UI components
├── design-system/       # Base UI primitives (Buttons, Dialogs, Inputs)
├── features/            # Feature-based domain boundaries
│   ├── autosave/        # Debounced saving hooks
│   ├── documents/       # Workspace, Document, and Folder services
│   ├── editor/          # Tiptap engine, Slash commands, Bubble menu
│   ├── export/          # PDF & DOCX generation pipelines
│   ├── history/         # Version snapshot management
│   ├── outline/         # AST-based table of contents
│   ├── search/          # In-memory search index & Command palette
│   └── workspace/       # Application layout and sidebars
├── lib/                 # Core utilities
└── test/                # Setup for Vitest
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage & Keyboard Shortcuts

- **Slash Menu**: Type `/` in the editor to quickly insert content blocks.
- **Search Palette**: Press `Ctrl + K` (or `Cmd + K`) to search across all documents.
- **Print**: Press `Ctrl + P` (or `Cmd + P`) to print the current document layout.
- **Formatting**:
  - `Ctrl + B`: Bold
  - `Ctrl + I`: Italic
  - `Ctrl + U`: Underline
  - `Ctrl + Z`: Undo
  - `Ctrl + Shift + Z`: Redo

## Future Scope

While DocStudio v1.0 is highly capable for local environments, future considerations include:
- Real-time Collaboration (CRDT / Yjs).
- Cloud Syncing and Firebase integration.
- Markdown Import/Export.
- Advanced AI Copilot integrations.
