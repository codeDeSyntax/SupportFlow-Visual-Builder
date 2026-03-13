import { useEffect, useRef } from 'react'
import { FlowNode } from '../types'

interface EditPanelProps {
  node: FlowNode
  onUpdate: (id: string, changes: Partial<FlowNode>) => void
  onClose: () => void
}

/**
 * EditPanel — side panel for editing node text and options.
 * Demonstrates: controlled inputs, real-time state updates,
 * keyboard event handling (Escape to close), useEffect for focus management.
 */
export default function EditPanel({ node, onUpdate, onClose }: EditPanelProps) {
  const textRef = useRef<HTMLTextAreaElement>(null)

  // Focus the text input when a new node is selected
  useEffect(() => {
    textRef.current?.focus()
  }, [node.id])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(node.id, { text: e.target.value })
  }

  const handleOptionLabelChange = (index: number, newLabel: string) => {
    const updatedOptions = node.options.map((opt, i) =>
      i === index ? { ...opt, label: newLabel } : opt
    )
    onUpdate(node.id, { options: updatedOptions })
  }

  return (
    <div
      className="w-80 bg-white border-l border-gray-200 p-5 flex flex-col gap-5 shrink-0 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Edit Node
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="4" x2="14" y2="14" />
            <line x1="14" y1="4" x2="4" y2="14" />
          </svg>
        </button>
      </div>

      {/* Node type badge */}
      <div className="text-xs text-gray-400">
        Type: <span className="text-gray-600 font-medium uppercase">{node.type}</span>
        &nbsp;&middot;&nbsp;
        ID: <span className="text-gray-600 font-mono">{node.id}</span>
      </div>

      {/* Question text */}
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Question Text</label>
        <textarea
          ref={textRef}
          value={node.text}
          onChange={handleTextChange}
          rows={3}
          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 resize-none focus:outline-none focus:border-blue-400 transition-colors"
        />
      </div>

      {/* Options */}
      {node.options.length > 0 && (
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">
            Options ({node.options.length})
          </label>
          <div className="flex flex-col gap-2">
            {node.options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                <input
                  type="text"
                  value={opt.label}
                  onChange={(e) => handleOptionLabelChange(i, e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-blue-400 transition-colors"
                />
                <span className="text-[10px] text-gray-400 font-mono">→{opt.nextId}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Position info */}
      <div className="mt-auto pt-4 border-t border-gray-100">
        <p className="text-[10px] text-gray-400">
          Position: ({Math.round(node.position.x)}, {Math.round(node.position.y)})
        </p>
      </div>
    </div>
  )
}
