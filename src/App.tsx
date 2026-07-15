import { useRef, useState } from 'react'
import type { View } from './nav'
import { useAppState } from './state/AppState'
import { exportJSON, importJSON } from './db/db'
import { Dashboard } from './components/Dashboard'
import { FlashcardMode } from './components/FlashcardMode'
import { QuizMode } from './components/QuizMode'
import { CalcMode } from './components/CalcMode'
import { TraceMode } from './components/TraceMode'
import { ExamMode } from './components/ExamMode'
import { OperatorMode } from './components/OperatorMode'
import { StatsMode } from './components/StatsMode'
import { ChmodDrill } from './components/ChmodDrill'
import { SubnetDrill } from './components/SubnetDrill'
import { MatchDrill } from './components/MatchDrill'
import { OrderDrill } from './components/OrderDrill'
import { BaseConvDrill } from './components/BaseConvDrill'
import { NutzwertDrill } from './components/NutzwertDrill'
import { SymbolDrill } from './components/SymbolDrill'
import { NetzplanDrill } from './components/NetzplanDrill'
import { WeakTraining } from './components/WeakTraining'
import { OopMode } from './components/OopMode'
import { ExamTasksMode } from './components/ExamTasksMode'
import { ReferenceMode } from './components/ReferenceMode'
import { MyCardsMode } from './components/MyCardsMode'
import { SettingsMode } from './components/SettingsMode'
import { ShortcutOverlay } from './components/ShortcutOverlay'
import { Icon } from './components/Icon'

function BackupControls() {
  const { reloadStates, markExported } = useAppState()
  const fileRef = useRef<HTMLInputElement>(null)

  async function onExport() {
    const json = await exportJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ap1-lernapp-backup.json`
    a.click()
    URL.revokeObjectURL(url)
    markExported()
  }

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      const n = await importJSON(text)
      await reloadStates()
      alert(`${n} Lernstände importiert.`)
    } catch {
      alert('Import fehlgeschlagen — ungültige Datei.')
    }
    e.target.value = ''
  }

  return (
    <div className="backup">
      <button className="btn ghost sm icon-btn" onClick={onExport} title="Lernstand als JSON sichern"><Icon name="download" size={15} /> Export</button>
      <button className="btn ghost sm icon-btn" onClick={() => fileRef.current?.click()} title="Lernstand aus JSON laden"><Icon name="upload" size={15} /> Import</button>
      <input ref={fileRef} type="file" accept="application/json" hidden onChange={onImport} />
    </div>
  )
}

export function App() {
  const { ready } = useAppState()
  const [view, setView] = useState<View>('dashboard')

  if (!ready) {
    return (
      <div className="app loading">
        <p className="muted">Lade Lernstand …</p>
      </div>
    )
  }

  const exit = () => setView('dashboard')

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => setView('dashboard')}>
          <Icon name="brand" size={19} /> AP1 Lernapp
        </button>
        <div className="topbar-actions">
          <BackupControls />
          <button className="btn ghost sm icon-btn" aria-label="Einstellungen" onClick={() => setView('settings')}><Icon name="gear" size={17} /></button>
        </div>
      </header>

      <main className="main">
        {view === 'dashboard' && <Dashboard go={setView} />}
        {view === 'flashcards' && <FlashcardMode onExit={exit} />}
        {view === 'quiz' && <QuizMode onExit={exit} />}
        {view === 'calc' && <CalcMode onExit={exit} />}
        {view === 'trace' && <TraceMode onExit={exit} />}
        {view === 'exam' && <ExamMode onExit={exit} />}
        {view === 'operators' && <OperatorMode onExit={exit} />}
        {view === 'stats' && <StatsMode onExit={exit} />}
        {view === 'chmod' && <ChmodDrill onExit={exit} />}
        {view === 'subnet' && <SubnetDrill onExit={exit} />}
        {view === 'match' && <MatchDrill onExit={exit} />}
        {view === 'order' && <OrderDrill onExit={exit} />}
        {view === 'baseconv' && <BaseConvDrill onExit={exit} />}
        {view === 'nutzwert' && <NutzwertDrill onExit={exit} />}
        {view === 'symbols' && <SymbolDrill onExit={exit} />}
        {view === 'netzplan' && <NetzplanDrill onExit={exit} />}
        {view === 'weak' && <WeakTraining onExit={exit} />}
        {view === 'oop' && <OopMode onExit={exit} />}
        {view === 'examtasks' && <ExamTasksMode onExit={exit} />}
        {view === 'reference' && <ReferenceMode onExit={exit} />}
        {view === 'mycards' && <MyCardsMode onExit={exit} />}
        {view === 'settings' && <SettingsMode onExit={exit} />}
      </main>

      <footer className="foot muted small">
        FIAE · AP1 · 30.09.2026 — offline, ohne Konto, ohne Tracking. Kein IHK-Produkt.
        <button className="link-btn" onClick={() => setView('settings')}>Einstellungen</button> ·
        <span> „?" für Tastatur-Kürzel</span>
      </footer>
      <ShortcutOverlay />
    </div>
  )
}
