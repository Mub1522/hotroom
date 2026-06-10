import { useEffect, useRef, useState } from 'react'
import { BROADCASTER } from '../App'

const PRESETS = [10, 25, 50, 100, 200, 500]

export default function TokenTooltip({ onSend, onClose }) {
  const [amount, setAmount] = useState(50)
  const [custom, setCustom] = useState('')
  const ref = useRef(null)

  // Cerrar al click fuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  const finalAmount = custom !== '' ? Math.max(1, parseInt(custom) || 1) : amount

  const handleSend = () => {
    onSend(finalAmount)
    onClose()
  }

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-surface border border-gray-200 dark:border-border2 rounded-lg shadow-2xl z-50 p-4 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-gray-900 dark:text-white text-sm font-semibold">Enviar tokens a</span>
        <span className="text-gold text-sm font-bold">{BROADCASTER}</span>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-1.5">
        {PRESETS.map(p => (
          <button
            key={p}
            onClick={() => { setAmount(p); setCustom('') }}
            className={`py-1.5 rounded text-sm font-semibold transition-colors border
              ${amount === p && custom === ''
                ? 'bg-gold text-black border-gold'
                : 'bg-transparent text-gold border-gold/40 hover:border-gold hover:bg-gold/10'
              }`}
          >
            ⬡ {p}
          </button>
        ))}
      </div>

      {/* Cantidad personalizada */}
      <div className="flex items-center gap-2">
        <span className="text-gold text-sm">⬡</span>
        <input
          type="number"
          min="1"
          placeholder="Otro monto..."
          value={custom}
          onChange={e => { setCustom(e.target.value); setAmount(0) }}
          className="flex-1 bg-gray-100 dark:bg-border text-gray-900 dark:text-white text-sm rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-gold/50 placeholder-dim [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>

      {/* Botón enviar */}
      <button
        onClick={handleSend}
        disabled={finalAmount < 1}
        className="w-full py-2 bg-gold hover:bg-yellow-400 disabled:opacity-40 text-black text-sm font-bold rounded transition-colors"
      >
        Enviar {finalAmount} tokens ⬡
      </button>
    </div>
  )
}
