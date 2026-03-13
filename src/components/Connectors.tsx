import { FlowNode } from '../types'

interface ConnectorsProps {
  nodes: FlowNode[]
  nodeWidth: number
  nodeHeight: number
}

interface Edge {
  key: string
  path: string
  label: string
  labelX: number
  labelY: number
}

/**
 * Connectors — SVG overlay that draws bezier curves between parent and child nodes.
 * Demonstrates: SVG coordinate math, path construction, cubic bezier curves,
 * pointer-events passthrough, reactive re-rendering on position changes.
 */
export default function Connectors({ nodes, nodeWidth, nodeHeight }: ConnectorsProps) {
  // Build a map for quick lookup: id → node
  const nodeMap: Record<string, FlowNode> = {}
  nodes.forEach(n => { nodeMap[n.id] = n })

  // Collect all edges: parent → child via options
  const edges: Edge[] = []
  nodes.forEach(parent => {
    parent.options.forEach((opt, i) => {
      const child = nodeMap[opt.nextId]
      if (!child) return

      // Spread parent exit points across the bottom if multiple options
      const optionCount = parent.options.length
      const spacing = nodeWidth / (optionCount + 1)
      const x1 = parent.position.x + spacing * (i + 1)
      const y1 = parent.position.y + nodeHeight   // parent bottom

      const x2 = child.position.x + nodeWidth / 2
      const y2 = child.position.y                 // child top-center

      // Midpoint Y for smooth cubic bezier S-curve
      const midY = (y1 + y2) / 2

      edges.push({
        key: `${parent.id}-${opt.nextId}-${i}`,
        path: `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`,
        label: opt.label,
        labelX: (x1 + x2) / 2,
        labelY: midY,
      })
    })
  })

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="6"
          refX="8"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
        </marker>
      </defs>

      {edges.map(edge => (
        <g key={edge.key}>
          <path
            d={edge.path}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
          {/* Background rect for label readability */}
          <rect
            x={edge.labelX - edge.label.length * 3 - 4}
            y={edge.labelY - 8}
            width={edge.label.length * 6 + 8}
            height={16}
            rx="4"
            fill="#f8fafc"
            opacity="0.9"
          />
          <text
            x={edge.labelX}
            y={edge.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#64748b"
            fontSize="10"
            className="select-none"
          >
            {edge.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
