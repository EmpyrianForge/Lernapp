import { useEffect, useState } from 'react'

// Globales Tastatur-Kürzel-Overlay: „?" öffnet/schließt, Esc schließt.
const SHORTCUTS: [string, string][] = [
  ['1 – 4', 'Karte bewerten (nicht gewusst … perfekt)'],
  ['Leertaste / Enter', 'Antwort aufdecken'],
  ['Esc', 'Session / Ansicht verlassen · Overlay schließen'],
  ['?', 'Diese Übersicht ein-/ausblenden'],
]

export function ShortcutOverlay() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement
      const typing = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT'
      if (e.key === '?' && !typing) {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!open) return null
  return (
    <div className="overlay-backdrop" onClick={() => setOpen(false)}>
      <div className="overlay-modal" role="dialog" aria-label="Tastatur-Kürzel" onClick={(e) => e.stopPropagation()}>
        <h2>Tastatur-Kürzel</h2>
        <ul className="shortcut-list">
          {SHORTCUTS.map(([k, d]) => (
            <li key={k}><kbd>{k}</kbd><span>{d}</span></li>
          ))}
        </ul>
        <button className="btn primary wide" onClick={() => setOpen(false)}>Schließen</button>
      </div>
    </div>
  )
}
