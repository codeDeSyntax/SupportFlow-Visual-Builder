import { FlowNode, ValidationResult } from '../types'

/**
 * validateFlow — analyses the decision tree graph and returns a set of issues.
 *
 * Algorithm:
 *  1. BFS from the start node to discover all reachable node IDs.
 *  2. Any node not reached is "unreachable" — it exists in the data but
 *     no path from the start leads to it.
 *  3. Any node whose options reference a nextId that doesn't exist in the
 *     node map is a "broken reference" — the bot would crash at that branch.
 *
 * Complexity: O(N + E) where N = nodes, E = edges (options).
 * This is standard BFS on a directed graph — a core CS fundamental.
 */
export function validateFlow(nodes: FlowNode[]): ValidationResult {
  // Build an O(1) lookup map: id → node
  const nodeMap = new Map<string, FlowNode>(nodes.map(n => [n.id, n]))

  const startNode = nodes.find(n => n.type === 'start')

  // --- BFS from start node ---
  const reachable = new Set<string>()

  if (startNode) {
    const queue: string[] = [startNode.id]

    while (queue.length > 0) {
      const id = queue.shift()!
      if (reachable.has(id)) continue   // already visited
      reachable.add(id)

      const node = nodeMap.get(id)
      if (!node) continue

      // Enqueue all children
      for (const opt of node.options) {
        if (!reachable.has(opt.nextId)) {
          queue.push(opt.nextId)
        }
      }
    }
  }

  // --- Unreachable nodes ---
  const unreachableIds = new Set<string>(
    nodes.filter(n => !reachable.has(n.id)).map(n => n.id)
  )

  // --- Broken references ---
  // A node is broken if any of its options point to an id that doesn't exist
  const brokenRefIds = new Set<string>()
  for (const node of nodes) {
    for (const opt of node.options) {
      if (!nodeMap.has(opt.nextId)) {
        brokenRefIds.add(node.id)
        break
      }
    }
  }

  return {
    unreachableIds,
    brokenRefIds,
    issueCount: unreachableIds.size + brokenRefIds.size,
  }
}
