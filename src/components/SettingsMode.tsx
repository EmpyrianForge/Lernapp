import { useRef } from 'react'
import type { Theme } from '../state/AppState'
import { useAppState } from '../state/AppState'
import { exportJSON, importJSON } from '../db/db'
import { formatDE } from '../lib/date'

const THEMES: [Theme, string][] = [['system', 'System'], ['light', 'Hell'], ['dark', 'Dunkel']]
const FONTS: [number, string][] = [[0.9, 'Klein'], [1, 'Normal'], [1.15, 'Groß'], [1.3, 'XL']]

const SHORTCUTS: [string, string][] = [
  ['1 – 4', 'Karte bewerten (nicht gewusst … perfekt)'],
  ['Leertaste / Enter', 'Antwort aufdecken'],
  ['Esc', 'Session / Ansicht verlassen'],
  ['?', 'Diese Kürzel-Übersicht anzeigen'],
]

export function SettingsMode({ onExit }: { onExit: () => void }) {
  const { theme, setTheme, fontScale, setFontScale, lastExport, markExported, reloadStates } = useAppState()
  const fileRef = useRef<HTMLInputElement>(null)

  async function onExport() {
    const json = await exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ap1-lernapp-backup.json'
    a.click()
    URL.revokeObjectURL(url)
    markExported()
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const n = await importJSON(await file.text())
      await reloadStates()
      alert(`${n} Lernstände importiert. Bitte App neu laden, damit eigene Karten erscheinen.`)
    } catch {
      alert('Import fehlgeschlagen — ungültige Datei.')
    }
    e.target.value = ''
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>Einstellungen</h2>
      </header>

      <h3 className="sec">Darstellung</h3>
      <div className="setting-row">
        <span>Design</span>
        <div className="seg-group">
          {THEMES.map(([t, label]) => (
            <button key={t} className={`seg-btn ${theme === t ? 'on' : ''}`} onClick={() => setTheme(t)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="setting-row">
        <span>Schriftgröße</span>
        <div className="seg-group">
          {FONTS.map(([v, label]) => (
            <button key={v} className={`seg-btn ${fontScale === v ? 'on' : ''}`} onClick={() => setFontScale(v)}>{label}</button>
          ))}
        </div>
      </div>

      <h3 className="sec">Backup</h3>
      <p className="muted small">
        Dein Lernstand liegt nur lokal (IndexedDB). Sichere ihn regelmäßig als JSON.
        {lastExport ? ` Zuletzt gesichert: ${formatDE(lastExport)}.` : ' Noch nie gesichert.'}
      </p>
      <div className="row" style={{ justifyContent: 'flex-start' }}>
        <button className="btn primary" onClick={onExport}>⬇ Exportieren</button>
        <button className="btn" onClick={() => fileRef.current?.click()}>⬆ Importieren</button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
      </div>

      <h3 className="sec">Tastatur-Kürzel</h3>
      <ul className="shortcut-list">
        {SHORTCUTS.map(([k, d]) => (
          <li key={k}><kbd>{k}</kbd><span>{d}</span></li>
        ))}
      </ul>
    </section>
  )
}
