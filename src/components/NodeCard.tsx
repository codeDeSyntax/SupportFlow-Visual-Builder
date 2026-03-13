import { FlowNode, IssueType } from '../types'

interface NodeCardProps {
  node: FlowNode
  isSelected: boolean
  onSelect: (id: string | null) => void
  nodeWidth: number
  issueType?: IssueType
}

/**
 * NodeCard — renders a single node, absolutely positioned on the canvas.
 * Demonstrates: absolute positioning, inline style coordinates,
 * conditional styling by node type, event delegation.
 */

type NodeStyleKey = FlowNode['type']

const TYPE_STYLES: Record<NodeStyleKey, { border: string; bg: string; badge: string; label: string }> = {
  start: {
    border: 'border-emerald-400',
    bg: 'bg-emerald-50',
    badge: 'bg-emerald-100 text-emerald-700',
    label: 'START',
  },
  question: {
    border: 'border-blue-400',
    bg: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
    label: 'QUESTION',
  },
  end: {
    border: 'border-orange-400',
    bg: 'bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
    label: 'END',
  },
}

export default function NodeCard({
  node,
  isSelected,
  onSelect,
  nodeWidth,
  issueType,
}: NodeCardProps) {
  const style = TYPE_STYLES[node.type]

  const borderClass =
    issueType === 'broken-ref'
      ? 'border-red-400'
      : issueType === 'unreachable'
        ? 'border-orange-400 border-dashed'
        : style.border

  return (
    <div
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        width: nodeWidth,
      }}
      className={`
        rounded-xl border-2 ${borderClass} ${issueType ? 'bg-white' : style.bg}
        shadow-md select-none cursor-pointer
        transition-shadow duration-150
        ${isSelected ? 'ring-2 ring-blue-300 shadow-lg' : 'hover:shadow-lg'}
      `}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(node.id)
      }}
    >
      {/* Card header — type badge + optional issue chip */}
      <div className="px-3 py-2 flex items-center justify-between gap-2">
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${style.badge}`}>
          {style.label}
        </span>

        {issueType && (
          <span
            className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              issueType === 'broken-ref'
                ? 'bg-red-100 text-red-600'
                : 'bg-orange-100 text-orange-600'
            }`}
          >
            <svg width="9" height="9" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1L1 14h14L8 1zm0 3l5.5 9.5H2.5L8 4zm-.75 3v3h1.5V7h-1.5zm0 4v1.5h1.5V11h-1.5z" />
            </svg>
            {issueType === 'broken-ref' ? 'An answer goes nowhere' : 'Customers can\'t reach this'}
          </span>
        )}
      </div>

      {/* Node text */}
      <div className="px-3 pb-2">
        <p className="text-sm text-gray-700 leading-snug">{node.text}</p>
      </div>

      {/* Option pills */}
      {node.options.length > 0 && (
        <div className="px-3 pb-3 flex flex-wrap gap-1.5">
          {node.options.map((opt, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-1 rounded-md bg-gray-50 text-gray-500 border border-gray-200"
            >
              {opt.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
