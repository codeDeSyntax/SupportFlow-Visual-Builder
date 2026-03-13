import { useState, useRef, useEffect } from 'react'
import { FlowNode } from '../types'

interface PreviewProps {
  nodes: FlowNode[]
}

interface Message {
  type: 'bot' | 'user'
  text: string
}

/**
 * Preview — chat-style "runner" that simulates the bot experience.
 * Demonstrates: list rendering, scroll management (scrollIntoView),
 * conditional rendering, state machine traversal.
 */
export default function Preview({ nodes }: PreviewProps) {
  const startNode = nodes.find(n => n.type === 'start')

  const [conversation, setConversation] = useState<Message[]>([])
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Initialize with the start node
  useEffect(() => {
    if (startNode) {
      setConversation([{ type: 'bot', text: startNode.text }])
      setCurrentNodeId(startNode.id)
    }
  }, [startNode?.id])

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation])

  const currentNode = nodes.find(n => n.id === currentNodeId)

  const handleOptionClick = (option: FlowNode['options'][number]) => {
    const nextNode = nodes.find(n => n.id === option.nextId)
    if (!nextNode) return

    setConversation(prev => [
      ...prev,
      { type: 'user', text: option.label },
      { type: 'bot', text: nextNode.text },
    ])
    setCurrentNodeId(nextNode.id)
  }

  const handleRestart = () => {
    if (startNode) {
      setConversation([{ type: 'bot', text: startNode.text }])
      setCurrentNodeId(startNode.id)
    }
  }

  const isEnded = currentNode && currentNode.options.length === 0

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col h-full max-h-[600px] bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
        {/* Chat header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1C4.13 1 1 3.58 1 6.73c0 1.87 1.12 3.53 2.86 4.57-.12.88-.56 2.17-1.36 2.7 0 0 2.41-.28 3.96-1.47.5.1 1.02.15 1.54.15 3.87 0 7-2.58 7-5.73S11.87 1 8 1z" fill="#34d399" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">SupportFlow Bot</p>
            <p className="text-[10px] text-emerald-500">Online</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                msg.type === 'bot'
                  ? 'self-start bg-gray-100 text-gray-700 rounded-bl-sm'
                  : 'self-end bg-blue-500 text-white rounded-br-sm'
              }`}
            >
              {msg.text}
            </div>
          ))}

          {/* Option buttons */}
          {currentNode && !isEnded && (
            <div className="self-start flex flex-col gap-2 mt-1">
              {currentNode.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  className="text-left text-sm px-3 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Restart button at end */}
          {isEnded && (
            <div className="self-center mt-4">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-sm font-medium transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 1v5h5" />
                  <path d="M3.51 10a5 5 0 1 0 .49-5.5L1 6" />
                </svg>
                Restart Conversation
              </button>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  )
}
