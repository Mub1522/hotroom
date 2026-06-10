import { useState, useEffect, useRef, useCallback } from 'react'
import { BROADCASTER } from '../App'
import StreamAlert from './StreamAlert'

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
}

export default function VideoFeed({ tokenBalance, streamActive, currentAlert, onAlertDone }) {
  const [camOn, setCamOn] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    if (!streamActive) return
    const id = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(id)
  }, [streamActive])

  const startCam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setHasPermission(true)
      setCamOn(true)
    } catch {
      setHasPermission(false)
      setCamOn(false)
    }
  }, [])

  const stopCam = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) videoRef.current.srcObject = null
    setCamOn(false)
  }, [])

  const toggleCam = useCallback(() => {
    if (camOn) stopCam()
    else startCam()
  }, [camOn, startCam, stopCam])

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    }
  }, [])

  return (
    <div
      className="relative bg-black w-full overflow-hidden flex-1"
      style={{ minHeight: 0 }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${camOn ? 'block' : 'hidden'}`}
      />

      {/* Fallback */}
      {!camOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
          <svg className="w-14 h-14 text-dim" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <p className="text-muted text-sm">
            {hasPermission === false ? 'Permiso de cámara denegado' : 'Cámara apagada'}
          </p>
          <button
            onClick={startCam}
            className="px-5 py-2 bg-accent hover:bg-accent/80 text-white text-sm font-semibold rounded transition-colors"
          >
            Activar cámara
          </button>
        </div>
      )}

      {/* Alerta de stream (follow / tip) */}
      {currentAlert && (
        <StreamAlert
          key={currentAlert._id}
          alert={currentAlert}
          onDone={onAlertDone}
        />
      )}

      {/* Overlay top-left: timer + tokens */}
      <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded text-xs font-mono text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          {formatTime(elapsed)}
        </div>
        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded text-xs text-gold">
          <span>⬡</span>
          <span>{tokenBalance} fichas</span>
        </div>
      </div>

      {/* Overlay top-right: cam toggle */}
      <button
        onClick={toggleCam}
        className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded transition-colors"
        title={camOn ? 'Apagar cámara' : 'Encender cámara'}
      >
        {camOn ? (
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M21 21H3a2 2 0 01-2-2V8a2 2 0 012-2h3m3-3h6l2 3h4a2 2 0 012 2v9.34" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        )}
      </button>

      {/* Overlay bottom-left: broadcaster info */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-none">
        <div className="w-8 h-8 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-base leading-none">
          😈
        </div>
        <div className="flex flex-col bg-black/30 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
          <span className="text-white text-sm font-semibold leading-tight">{BROADCASTER}</span>
          <span className="text-gray-300 text-xs leading-tight">¡Ven y disfruta conmigo! 🔥</span>
        </div>
      </div>
    </div>
  )
}
