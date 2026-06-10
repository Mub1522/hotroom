import { BROADCASTER } from '../App'

export default function StreamControls() {
  return (
    <div className="h-12 bg-surface border-t border-border flex items-center px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-base select-none leading-none">
          😈
        </div>
        <span className="text-sm text-white font-medium">{BROADCASTER}</span>
        <span className="text-xs text-muted">transmitiendo ahora</span>
      </div>
    </div>
  )
}
