import { Node as ProseMirrorNode } from '@tiptap/pm/model'
import type { OutlineNode } from '../types/outline'

/**
 * Pure function to extract an OutlineNode hierarchy from a ProseMirror document.
 * 
 * Extracts only heading nodes, tracking their absolute position and constructing 
 * a nested tree structure based on heading levels.
 */
export function parseDocumentOutline(doc: ProseMirrorNode): OutlineNode[] {
  const headings: OutlineNode[] = []

  let headingIndex = 0

  // Extract flat list of headings with precise positions
  doc.descendants((node, pos) => {
    if (node.type.name === 'heading') {
      headings.push({
        id: `heading-${pos}`,
        level: node.attrs.level as 1 | 2 | 3 | 4 | 5 | 6,
        text: node.textContent,
        position: pos,
        children: [],
        collapsed: false,
        index: headingIndex++,
      })
    }
  })

  // Build nested hierarchy
  const rootNodes: OutlineNode[] = []
  const stack: OutlineNode[] = []

  headings.forEach(heading => {
    // Pop the stack until we find a parent that has a STRICTLY smaller level number 
    // (e.g. H1 is level 1, H2 is level 2. H1 < H2)
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      rootNodes.push(heading)
    } else {
      const parent = stack[stack.length - 1]
      heading.parentId = parent.id
      parent.children.push(heading)
    }

    stack.push(heading)
  })

  return rootNodes
}
