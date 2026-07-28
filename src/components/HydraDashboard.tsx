import type { View } from '../nav'
import { useAppState } from '../state/AppState'
import { ALL_ITEMS } from '../data/content'
import { isMastered } from '../lib/mastery'
import { ScoreRing } from './ui'
import { Icon } from './Icon'

// Eigenes, schlankes Dashboard für den Hydra-Track (IHK-Abschlussprojekt).
// Kein AP1-Prüfungsdatum, keine AP1-Drills — nur die für's Fachgespräch nützlichen
// Modi, die den (auf Hydra gefilterten) Content-Pool direkt nutzen.

interface ModeDef {
  view: View
  icon: string
  title: string
  desc: string
}

const HYDRA_MODES: ModeDef[] = [
  { view: 'flashcards', icon: 'cards', title: 'Karteikarten', desc: 'Fällige Hydra-Karten, Spaced Repetition' },
  { view: 'weak', icon: 'activity', title: 'Schwachstellen', desc: 'Gezielt deine schwächsten Hydra-Karten üben' },
  { view: 'reference', icon: 'search', title: 'Nachschlagen', desc: 'Alle Hydra-Karten durchsuchen' },
]

export function HydraDashboard({ go }: { go: (v: View) => void }) {
  const { states, dueTotal, streak } = useAppState()

  const total = ALL_ITEMS.length
  const seen = ALL_ITEMS.filter((i) => {
    const st = states.get(i.id)
    return !!st && st.history.length > 0
  }).length
  const mastered = ALL_ITEMS.filter((i) => {
    const st = states.get(i.id)
    return !!st && isMastered(st)
  }).length
  const pct = total ? Math.round((mastered / total) * 100) : 0

  return (
    <div className="dashboard">
      <section className="hero">
        <div className="hero-ring">
          <ScoreRing value={pct} caption="% gefestigt" />
          <p className="muted small">Fachgespräch-Vorbereitung</p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">{total}</span>
            <span className="stat-label">Karten gesamt</span>
          </div>
          <div className="stat">
            <span className="stat-num accent">{dueTotal}</span>
            <span className="stat-label">fällig heute</span>
          </div>
          <div className="stat">
            <span className="stat-num">{seen}</span>
            <span className="stat-label">gesehen</span>
          </div>
          <div className="stat">
            <span className="stat-num streak-num">{streak}<Icon name="flame" size={18} className="streak-ico" /></span>
            <span className="stat-label">Tage-Streak</span>
          </div>
        </div>
      </section>

      {dueTotal > 0 && (
        <button className="cta" onClick={() => go('flashcards')}>
          <Icon name="play" size={16} /> {dueTotal} fällige Karten jetzt lernen
        </button>
      )}

      {total === 0 && (
        <div className="ontrack warn">
          <div className="ontrack-main">
            <span className="ontrack-dot" aria-hidden="true" />
            <strong>Noch keine Hydra-Karten</strong>
          </div>
          <span className="muted small">Inhalte werden gerade ergänzt.</span>
        </div>
      )}

      <section className="modes">
        {HYDRA_MODES.map((m) => (
          <button key={m.view} className="mode-card" onClick={() => go(m.view)}>
            <span className="mode-icon" aria-hidden="true"><Icon name={m.icon} size={22} /></span>
            <span className="mode-title">{m.title}</span>
            <span className="mode-desc">{m.desc}</span>
          </button>
        ))}
      </section>
    </div>
  )
}
