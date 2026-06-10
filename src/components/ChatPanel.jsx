import { useState, useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'

const EMOJIS = [
  '😍','🔥','💋','❤️','🥵','👅','💦','😩','🫦','💕',
  '😏','👑','💰','🎉','✨','😂','🙈','💀','🫶','👏',
]

export default function ChatPanel({ messages, onSend }) {
  const [inputText, setInputText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    onSend(inputText)
    setInputText('')
    setShowEmoji(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const insertEmoji = (emoji) => {
    setInputText(t => t + emoji)
    setShowEmoji(false)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-surface2">
      {/* Header */}
      <div className="h-10 border-b border-gray-200 dark:border-border flex items-center px-3 flex-shrink-0">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">Chat en vivo</span>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto chat-scroll px-2 py-2 flex flex-col gap-0.5">
        {messages.length === 0 && (
          <p className="text-muted text-xs text-center mt-4">El chat aparecerá aquí…</p>
        )}
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 dark:border-border p-2 flex-shrink-0 relative">
        {showEmoji && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-surface border border-gray-200 dark:border-border rounded p-2 grid grid-cols-5 gap-1 z-10">
            {EMOJIS.map(e => (
              <button
                key={e}
                onClick={() => insertEmoji(e)}
                className="text-lg hover:bg-gray-100 dark:hover:bg-border rounded p-0.5 transition-colors leading-none"
              >
                {e}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-1.5">
          <button
            onClick={() => setShowEmoji(s => !s)}
            className="p-2 text-muted hover:text-gray-900 dark:hover:text-white rounded hover:bg-gray-100 dark:hover:bg-border transition-colors flex-shrink-0 text-base leading-none"
          >
            😊
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe algo…"
            maxLength={200}
            className="flex-1 bg-gray-100 dark:bg-border text-gray-900 dark:text-white text-sm rounded px-2 py-1.5 placeholder-dim outline-none focus:ring-1 focus:ring-accent/50 min-w-0"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="px-3 py-1.5 bg-accent hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded transition-colors flex-shrink-0"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
