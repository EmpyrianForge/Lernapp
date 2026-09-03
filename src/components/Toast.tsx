import { useEffect } from 'react'
import { useAppState } from '../state/AppState'
import { Confetti } from './Confetti'
import { Icon } from './Icon'

// Erfolgs-Toast für Meilensteine und das Tagesziel: statischer Hinweis (immer sichtbar)
// plus Konfetti, sofern Effekte erlaubt sind. Blendet sich nach ein paar Sekunden aus.

export function Toast() {
  const { toast, dismissToast } = useAppState()

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(dismissToast, 6500)
    return () => window.clearTimeout(t)
  }, [toast, dismissToast])

  if (!toast) return null

  return (
    <div className="toast-wrap" aria-live="polite" role="status">
      <Confetti count={44} />
      <div className="toast">
        <span className="toast-ico" aria-hidden="true"><Icon name="check" size={18} /></span>
        <div className="toast-text">
          <strong>{toast.title}</strong>
          <span className="muted small">{toast.desc}</span>
        </div>
        <button className="btn ghost sm" onClick={dismissToast} aria-label="Hinweis schließen">✕</button>
      </div>
    </div>
  )
}
