export interface NodeOption {
  label: string
  nextId: string
}

export interface FlowNode {
  id: string
  type: 'start' | 'question' | 'end'
  text: string
  position: { x: number; y: number }
  options: NodeOption[]
}

export interface CanvasSize {
  w: number
  h: number
}

export type IssueType = 'unreachable' | 'broken-ref'

export interface ValidationResult {
  // Node IDs not reachable from the start node via BFS
  unreachableIds: Set<string>
  // Node IDs whose options reference a nextId that does not exist
  brokenRefIds: Set<string>
  issueCount: number
}
