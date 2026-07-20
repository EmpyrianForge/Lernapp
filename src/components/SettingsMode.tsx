import { useRef, useState } from 'react'
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
  const {
    theme, setTheme, fontScale, setFontScale, lastExport, markExported, reloadStates,
    cloudUrl, cloudKey, cloudAuto, lastCloudBackup, setCloudConfig, setCloudAuto,
    cloudTest, cloudBackup, cloudRestore,
  } = useAppState()
  const fileRef = useRef<HTMLInputElement>(null)

  const [url, setUrl] = useState(cloudUrl)
  const [key, setKey] = useState(cloudKey)
  const [cloudMsg, setCloudMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const configured = cloudUrl.trim().length > 0 && cloudKey.trim().length >= 16

  const saveCloud = () => {
    setCloudConfig(url.trim(), key.trim())
    setCloudMsg({ ok: true, text: 'Gespeichert.' })
  }
  const runCloud = async (fn: () => Promise<{ ok: boolean; savedAt?: string; error?: string }>, okText: string) => {
    setBusy(true)
    setCloudMsg(null)
    const res = await fn()
    setBusy(false)
    setCloudMsg({ ok: res.ok, text: res.ok ? okText : `Fehler: ${res.error ?? 'unbekannt'}` })
    return res
  }
  const doRestore = async () => {
    if (!confirm('Lokalen Lernstand mit dem Server-Backup überschreiben? Danach wird die App neu geladen.')) return
    const res = await runCloud(cloudRestore, 'Wiederhergestellt.')
    if (res.ok) setTimeout(() => window.location.reload(), 600)
  }

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

      <h3 className="sec">Cloud-Backup (VPS)</h3>
      <p className="muted small">
        Sichert den Lernstand zusätzlich auf deinen eigenen Server (HTTPS-URL + geheimer Schlüssel).
        Server aufsetzen: siehe <code>server/README.md</code> im Projekt.
      </p>
      <label className="field">
        <span>Server-URL (HTTPS)</span>
        <input className="search-input" type="url" inputMode="url" placeholder="https://backup.deine-domain.de"
          value={url} onChange={(e) => setUrl(e.target.value)} autoCapitalize="off" autoCorrect="off" spellCheck={false} />
      </label>
      <label className="field">
        <span>Geheimer Schlüssel (min. 16 Zeichen)</span>
        <input className="search-input" type="password" placeholder="langer Zufallswert (openssl rand -hex 24)"
          value={key} onChange={(e) => setKey(e.target.value)} autoComplete="off" />
      </label>
      <div className="row" style={{ justifyContent: 'flex-start' }}>
        <button className="btn" onClick={saveCloud}>Speichern</button>
        <button className="btn" disabled={busy || !cloudUrl.trim()} onClick={() => runCloud(cloudTest, 'Server erreichbar.')}>Verbindung testen</button>
        <button className="btn primary" disabled={busy || !configured} onClick={() => runCloud(cloudBackup, 'Auf dem Server gesichert.')}>Jetzt sichern</button>
        <button className="btn" disabled={busy || !configured} onClick={doRestore}>Wiederherstellen</button>
      </div>
      <label className="core-toggle" style={{ marginTop: '0.6rem' }}>
        <input type="checkbox" checked={cloudAuto} onChange={(e) => setCloudAuto(e.target.checked)} disabled={!configured} />
        <span>Automatisch sichern</span>
        <span className="muted small">— 20 s nach jeder Änderung</span>
      </label>
      {cloudMsg && <p className={`small ${cloudMsg.ok ? 'cloud-ok' : 'cloud-err'}`}>{cloudMsg.text}</p>}
      <p className="muted small">
        {configured
          ? lastCloudBackup
            ? `Letztes Cloud-Backup: ${formatDE(lastCloudBackup.slice(0, 10))}.`
            : 'Konfiguriert — noch kein Cloud-Backup.'
          : 'Noch nicht eingerichtet (URL + Schlüssel ≥ 16 Zeichen speichern).'}
      </p>

      <h3 className="sec">Tastatur-Kürzel</h3>
      <ul className="shortcut-list">
        {SHORTCUTS.map(([k, d]) => (
          <li key={k}><kbd>{k}</kbd><span>{d}</span></li>
        ))}
      </ul>
    </section>
  )
}
