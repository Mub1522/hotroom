import { useEffect, useRef, useState } from 'react'

export default function FollowToast({ name, onDone }) {
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
        bg-surface border border-border2 rounded-lg shadow-2xl
        flex items-center gap-3 px-4 py-3
        transition-all duration-500 ease-out
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}
      `}
    >
      {/* Barra lateral de color */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent rounded-l-lg" />

      {/* Icono corazón */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center ml-1">
        <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>

      {/* Texto */}
      <div className="flex flex-col min-w-0">
        <span className="text-white text-sm font-semibold leading-tight">
          ¡Siguiendo a {name}!
        </span>
        <span className="text-muted text-xs mt-0.5">
          Recibirás avisos cuando esté en vivo 💕
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border overflow-hidden rounded-b-lg">
        <div
          className="h-full bg-accent rounded-b-lg"
          style={{
            animation: 'progress 2.8s linear forwards',
          }}
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
