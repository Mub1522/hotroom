import { useCallback, useState } from 'react'
import { BROADCASTER } from '../App'
import FollowToast from './FollowToast'
import TokenTooltip from './TokenTooltip'
import TokenToast from './TokenToast'

export default function TopBar({ viewers, onSendTokens, onFollow, isDark, onToggleTheme, onPhoto }) {
  const [followKey, setFollowKey] = useState(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tokenToast, setTokenToast] = useState(null)

  const handleFollow = useCallback(() => {
    setFollowKey(Date.now())
    onFollow()
  }, [onFollow])

  const handleSend = useCallback((amount) => {
    onSendTokens(amount)
    setTokenToast({ key: Date.now(), amount })
  }, [onSendTokens])

  return (
    <>
      {followKey && (
        <FollowToast key={followKey} name={BROADCASTER} onDone={() => setFollowKey(null)} />
      )}
      {tokenToast && (
        <TokenToast key={tokenToast.key} amount={tokenToast.amount} onDone={() => setTokenToast(null)} />
      )}

      <header className="h-14 bg-white dark:bg-surface border-b border-gray-200 dark:border-border flex items-center px-4 gap-4 flex-shrink-0 relative z-20">
        {/* Brand */}
        <div className="font-bold text-lg tracking-tight select-none">
          <span className="text-accent">Hot</span><span className="text-gray-900 dark:text-white">Room</span>
        </div>

        {/* EN VIVO badge */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 border border-accent/40 rounded-sm">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent text-xs font-bold tracking-widest">EN VIVO</span>
        </div>

        {/* Viewer count */}
        <div className="flex items-center gap-1.5 text-muted text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>{viewers.toLocaleString('es')}</span>
        </div>

        {/* Acciones */}
        <div className="ml-auto flex items-center gap-2">

          {/* Toggle tema */}
          <button
            onClick={onToggleTheme}
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
            className="p-2 rounded-lg text-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-border transition-colors"
          >
            {isDark ? (
              /* Sol */
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              /* Luna */
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          {/* Botón foto */}
          <button
            onClick={onPhoto}
            title="Tomar foto (10s)"
            className="p-2 rounded-lg text-muted hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-border transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>

          <button
            onClick={handleFollow}
            className="px-4 py-1.5 bg-accent hover:bg-accent/80 text-white text-sm font-semibold rounded transition-colors"
          >
            Seguir
          </button>

          <div className="relative">
            <button
              onClick={() => setShowTooltip(v => !v)}
              className="px-4 py-1.5 border border-gold text-gold hover:bg-gold/10 text-sm font-semibold rounded transition-colors"
            >
              Enviar tokens
            </button>
            {showTooltip && (
              <TokenTooltip onSend={handleSend} onClose={() => setShowTooltip(false)} />
            )}
          </div>
        </div>
      </header>
    </>
  )
}
