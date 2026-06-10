import { useEffect, useRef, useState } from 'react'

export default function StreamAlert({ alert, onDone }) {
  const [visible, setVisible] = useState(false)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 30)
    const t2 = setTimeout(() => setVisible(false), 3500)
    const t3 = setTimeout(() => onDoneRef.current(), 4000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const isTip = alert.type === 'tip'

  return (
    <div
      className={`
        absolute right-3 top-14 z-30
        flex items-center gap-2 px-3 py-2 rounded-lg
        border transition-all duration-400 ease-out pointer-events-none select-none
        ${isTip
          ? 'bg-black/50 border-gold/25'
          : 'bg-black/50 border-white/15'
        }
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'}
      `}
    >
      <span className="text-base leading-none">
        {isTip ? '⬡' : '🔔'}
      </span>
      <div className="flex flex-col leading-tight">
        <span className={`text-xs font-semibold ${isTip ? 'text-gold' : 'text-white/90'}`}>
          {alert.username}
        </span>
        <span className="text-white/50 text-[10px]">
          {isTip ? `donó ${alert.tokens} tokens` : alert.self ? '¡ahora la sigues!' : 'te siguió'}
        </span>
      </div>
    </div>
  )
}
