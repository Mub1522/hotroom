import { useCallback, useEffect, useRef, useState } from 'react'
import { toJpeg } from 'html-to-image'

const TOTAL = 10
const RADIUS = 44
const CIRCUM = 2 * Math.PI * RADIUS

export default function PhotoBooth({ active, onClose }) {
  const [countdown, setCountdown] = useState(null)
  const [photo, setPhoto]         = useState(null)
  const [flashing, setFlashing]   = useState(false)
  const ringRef = useRef(null)

  // Arrancar cuando se activa desde fuera
  useEffect(() => {
    if (active && countdown === null && !photo) {
      setCountdown(TOTAL)
    }
  }, [active])

  // Tick
  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      capture()
      setCountdown(null)
      return
    }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown])

  // Animación del anillo al arrancar
  useEffect(() => {
    if (countdown === TOTAL && ringRef.current) {
      ringRef.current.style.animation = 'none'
      ringRef.current.getBoundingClientRect()
      ringRef.current.style.animation = `drain ${TOTAL}s linear forwards`
    }
  }, [countdown === TOTAL])

  const capture = useCallback(async () => {
    const node  = document.getElementById('hotroom-ui')
    const video = node?.querySelector('video')
    if (!node) return

    // 1. Snapshot del frame actual del video en un canvas
    let tempCanvas = null
    if (video && video.readyState >= 2) {
      tempCanvas = document.createElement('canvas')
      tempCanvas.width  = video.videoWidth  || video.clientWidth
      tempCanvas.height = video.videoHeight || video.clientHeight
      tempCanvas.getContext('2d').drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height)
      // Copiar estilos para que ocupe el mismo espacio
      tempCanvas.className = video.className
      tempCanvas.style.cssText = video.style.cssText
      video.parentNode.insertBefore(tempCanvas, video)
      video.style.display = 'none'
    }

    try {
      const dataUrl = await toJpeg(node, {
        quality: 0.92,
        pixelRatio: 1,
        filter: (n) => n.tagName !== 'VIDEO',
      })
      setPhoto(dataUrl)
      setFlashing(true)
      setTimeout(() => setFlashing(false), 350)
    } catch (e) {
      console.error('Screenshot error:', e)
    } finally {
      // 2. Restaurar el video
      if (video && tempCanvas) {
        video.style.display = ''
        tempCanvas.parentNode.removeChild(tempCanvas)
      }
    }
  }, [])

  const download = useCallback(() => {
    const a = document.createElement('a')
    a.href     = photo
    a.download = `hotroom-${Date.now()}.jpg`
    a.click()
  }, [photo])

  const reset = useCallback(() => {
    setPhoto(null)
    setCountdown(null)
    onClose()
  }, [onClose])

  if (!active && countdown === null && !photo) return null

  return (
    <>
      {/* Flash */}
      {flashing && (
        <div className="fixed inset-0 bg-white z-[60] pointer-events-none"
             style={{ animation: 'flash 0.35s ease-out forwards' }} />
      )}

      {/* Countdown centrado en pantalla */}
      {countdown !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            <svg width="120" height="120" className="-rotate-90">
              <circle cx="60" cy="60" r={RADIUS}
                fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
              <circle ref={ringRef} cx="60" cy="60" r={RADIUS}
                fill="none" stroke="#e8173a" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRCUM}
                strokeDashoffset="0" />
            </svg>
            <span className="absolute text-white font-bold drop-shadow-lg"
                  style={{ fontSize: '2.6rem', lineHeight: 1 }}>
              {countdown}
            </span>
          </div>
        </div>
      )}

      {/* Modal preview */}
      {photo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6">
          <div className="flex flex-col items-center gap-4 max-w-2xl w-full">
            <img src={photo} alt="Screenshot"
                 className="w-full rounded-xl shadow-2xl border border-white/10 object-contain max-h-[70vh]" />
            <div className="flex gap-3">
              <button onClick={download}
                      className="px-6 py-2 bg-accent hover:bg-accent/80 text-white text-sm font-bold rounded transition-colors">
                Descargar
              </button>
              <button onClick={reset}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes drain {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: ${CIRCUM}; }
        }
        @keyframes flash {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  )
}
