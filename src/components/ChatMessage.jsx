export default function ChatMessage({ message }) {
  const { type, username, text, tokens } = message

  if (type === 'tip') {
    return (
      <div className="border-l-2 border-gold bg-gold/5 pl-2 pr-1 py-1 rounded-sm text-sm leading-snug">
        <span className="text-gold font-bold">⬡ {username}</span>
        <span className="text-gold/80"> {text}</span>
        {tokens && (
          <span className="ml-1 text-gold text-xs font-mono font-bold">({tokens} ⬡)</span>
        )}
      </div>
    )
  }

  if (type === 'follow') {
    return (
      <div className="border-l-2 border-accent/60 bg-accent/5 pl-2 pr-1 py-1 rounded-sm text-sm leading-snug">
        <span className="text-accent font-bold">🔔 {username}</span>
        <span className="text-gray-500 dark:text-white/70"> {text}</span>
      </div>
    )
  }

  const usernameClass =
    type === 'mod' ? 'text-user-purple font-semibold' : 'text-user-blue'

  return (
    <div className="px-1 py-0.5 text-sm leading-snug">
      <span className={usernameClass}>{username}</span>
      <span className="text-gray-400 dark:text-dim mx-1">:</span>
      <span className="text-gray-700 dark:text-white/80">{text}</span>
    </div>
  )
}
