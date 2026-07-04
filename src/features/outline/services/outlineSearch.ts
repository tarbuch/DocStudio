import type { OutlineNode } from '../types/outline'

/**
 * Pure service for filtering the outline tree based on a search query.
 * Preserves hierarchy (parents are kept if their children match).
 */
export function filterOutlineTree(nodes: OutlineNode[], query: string): OutlineNode[] {
  if (!query.trim()) {
    return nodes
  }

  const lowerQuery = query.toLowerCase()

  return nodes.reduce<OutlineNode[]>((acc, node) => {
    // 1. Check if the current node matches the query
    const isMatch = node.text.toLowerCase().includes(lowerQuery)

    // 2. Recursively check children
    const matchingChildren = filterOutlineTree(node.children, query)

    // 3. Keep the node if it matches directly OR if any of its descendants match
    if (isMatch || matchingChildren.length > 0) {
      acc.push({
        ...node,
        // If the node itself matches, do we show all its children?
        // Usually, yes, or just matching children. The requested behavior
        // implies we filter children recursively.
        children: matchingChildren,
        // Ensure it is expanded if it's part of a search result
        collapsed: false,
      })
    }

    return acc
  }, [])
}
