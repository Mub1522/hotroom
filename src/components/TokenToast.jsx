import { useEffect, useRef, useState } from 'react'
import { BROADCASTER } from '../App'

export default function TokenToast({ amount, onDone }) {
  const [visible, setVisible] = useState(false)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10)
    const t2 = setTimeout(() => setVisible(false), 2800)
    const t3 = setTimeout(() => onDoneRef.current(), 3400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 w-72
        bg-surface border border-gold/30 rounded-lg shadow-2xl
        flex items-center gap-3 px-4 py-3
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}
      `}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold rounded-l-lg" />

      {/* Icono */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center ml-1 text-lg leading-none">
        ⬡
      </div>

      {/* Texto */}
      <div className="flex flex-col min-w-0">
        <span className="text-white text-sm font-semibold leading-tight">
          ¡Enviaste {amount} tokens!
        </span>
        <span className="text-muted text-xs mt-0.5">
          Le enviaste un regalo a {BROADCASTER} 💛
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border overflow-hidden rounded-b-lg">
        <div
          className="h-full bg-gold rounded-b-lg"
          style={{ animation: 'progress 2.8s linear forwards' }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  )
}
