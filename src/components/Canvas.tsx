import { useRef } from 'react'
import NodeCard from './NodeCard'
import Connectors from './Connectors'
import { FlowNode, CanvasSize, ValidationResult, IssueType } from '../types'

interface CanvasProps {
  nodes: FlowNode[]
  canvasSize: CanvasSize
  selectedNodeId: string | null
  onSelectNode: (id: string | null) => void
  nodeWidth: number
  nodeHeight: number
  validationResult: ValidationResult
}

/**
 * Canvas — the scrollable container that holds all nodes and connectors.
 * Demonstrates: relative positioning context, scroll containers,
 * ref-based DOM access, coordinate system foundation.
 */
export default function Canvas({
  nodes,
  canvasSize,
  selectedNodeId,
  onSelectNode,
  nodeWidth,
  nodeHeight,
  validationResult,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  function getIssueType(id: string): IssueType | undefined {
    if (validationResult.brokenRefIds.has(id)) return 'broken-ref'
    if (validationResult.unreachableIds.has(id)) return 'unreachable'
    return undefined
  }

  return (
    <div
      className="flex-1 min-h-0 overflow-auto"
      onClick={() => onSelectNode(null)}
    >
      <div
        ref={canvasRef}
        style={{
          position: 'relative',
          width: canvasSize.w,
          height: canvasSize.h,
          minWidth: canvasSize.w,
          minHeight: canvasSize.h,
        }}
        className="m-4"
      >
        {/* Dot grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            borderRadius: '12px',
          }}
        />

        {/* SVG connectors layer */}
        <Connectors
          nodes={nodes}
          nodeWidth={nodeWidth}
          nodeHeight={nodeHeight}
        />

        {/* Node cards layer */}
        {nodes.map(node => (
          <NodeCard
            key={node.id}
            node={node}
            isSelected={node.id === selectedNodeId}
            onSelect={onSelectNode}
            nodeWidth={nodeWidth}
            issueType={getIssueType(node.id)}
          />
        ))}
      </div>
    </div>
  )
}
