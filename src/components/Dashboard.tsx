import type { View } from '../nav'
import { useAppState } from '../state/AppState'
import { allTopicMastery, examReadiness, overview } from '../lib/mastery'
import { ALL_ITEMS } from '../data/content'
import { daysBetween, daysUntilExam, EXAM_DATE, formatDE } from '../lib/date'
import { TARGET_POINTS } from '../lib/grade'
import { ProgressBar, ScoreRing } from './ui'
import { Icon } from './Icon'

interface ModeDef {
  view: View
  icon: string
  title: string
  desc: string
}

const MODES: ModeDef[] = [
  { view: 'flashcards', icon: 'cards', title: 'Karteikarten', desc: 'Fällige Karten, Spaced Repetition, interleaved' },
  { view: 'quiz', icon: 'help', title: 'Themen-Quiz', desc: 'Frei gewählte Themen, Sofort-Feedback' },
  { view: 'weak', icon: 'activity', title: 'Schwachstellen', desc: 'Gezielt deine schwächsten Karten üben' },
  { view: 'calc', icon: 'calculator', title: 'Rechnen', desc: 'Rechenwege mit Teilpunkten & Fallen' },
  { view: 'trace', icon: 'braces', title: 'Schreibtischtest', desc: 'Pseudocode Zeile für Zeile durchspielen' },
  { view: 'examtasks', icon: 'file-text', title: 'Prüfungsaufgaben', desc: 'Mehrteilige Aufgaben mit Musterlösung' },
  { view: 'exam', icon: 'clipboard', title: 'Prüfungssimulation', desc: '90 Min, 4 Bereiche, gegen 100 P' },
  { view: 'operators', icon: 'target', title: 'Operatoren', desc: 'Was jeder Operator für volle Punkte will' },
  { view: 'oop', icon: 'code', title: 'OOP-Grundlagen', desc: 'Klassen & Objekte mit Code (Pseudo/Java/Python)' },
  { view: 'stats', icon: 'bar-chart', title: 'Statistik', desc: 'Heatmap, Verlauf, Noten-Verteilung' },
]

const TOOLS: ModeDef[] = [
  { view: 'reference', icon: 'search', title: 'Nachschlagen', desc: 'Suche, Formeln, Lesezeichen' },
  { view: 'mycards', icon: 'card-plus', title: 'Meine Karten', desc: 'Eigene Karteikarten anlegen' },
  { view: 'settings', icon: 'gear', title: 'Einstellungen', desc: 'Design, Schrift, Backup' },
]

const INTERACTIVE: ModeDef[] = [
  { view: 'chmod', icon: 'lock', title: 'chmod-Rechte', desc: 'rwx-Matrix klicken → Oktalzahl live' },
  { view: 'subnet', icon: 'network', title: 'Subnetting', desc: 'Netz/Broadcast/Hosts mit Bit-Leiste' },
  { view: 'baseconv', icon: 'hash', title: 'Zahlensysteme', desc: 'Bits klicken → Dez/Hex/Bin live' },
  { view: 'nutzwert', icon: 'scale', title: 'Nutzwertanalyse', desc: 'Bewertungsmatrix rechnen, Sieger finden' },
  { view: 'netzplan', icon: 'git-graph', title: 'Netzplan', desc: 'FAZ/FEZ/SAZ/SEZ + kritischer Pfad' },
  { view: 'match', icon: 'link', title: 'Zuordnung', desc: 'Ports, Cloud, Backup, Krypto, IPv6' },
  { view: 'symbols', icon: 'shapes', title: 'UML/BPMN-Symbole', desc: 'Gezeichnetes Symbol → Bedeutung' },
  { view: 'order', icon: 'list', title: 'Reihenfolge', desc: 'OSI, DORA, Handshake, Phasen sortieren' },
]

export function Dashboard({ go }: { go: (v: View) => void }) {
  const { states, dueTotal, streak, coreOnly, setCoreOnly, lastExport, today } = useAppState()
  const readiness = examReadiness(states)
  const masteries = allTopicMastery(states)
  const ov = overview(states, dueTotal)
  const days = daysUntilExam()
  const cram = days <= 14 && days >= 0

  // „Auf Kurs?": wie viele neue Karten/Tag, um bis zur Prüfung alles einmal zu sehen.
  const unseen = ALL_ITEMS.filter((i) => {
    const st = states.get(i.id)
    return !st || st.history.length === 0
  }).length
  const perDay = days > 0 ? Math.ceil(unseen / days) : unseen
  const track: 'good' | 'warn' | 'bad' = readiness >= 66 ? 'good' : readiness >= 40 ? 'warn' : 'bad'
  const trackLabel = track === 'good' ? 'Gut auf Kurs' : track === 'warn' ? 'Dranbleiben' : 'Mehr Tempo nötig'

  // Backup-Erinnerung: es gibt Fortschritt, aber lange (oder nie) kein Export.
  const daysSinceExport = lastExport ? daysBetween(lastExport, today) : Infinity
  const showBackupReminder = ov.seen >= 10 && daysSinceExport >= 14

  return (
    <div className="dashboard">
      {cram && (
        <div className="cram-banner" role="alert">
          <Icon name="flame" size={16} className="banner-ico" /> <strong>Endspurt:</strong> nur noch {days} {days === 1 ? 'Tag' : 'Tage'} bis zur AP1.
          Wiederholungs­intervalle werden jetzt gestaucht — täglich fällige Karten abarbeiten!
        </div>
      )}

      {showBackupReminder && (
        <div className="backup-reminder" role="status">
          <Icon name="save" size={15} className="banner-ico" /> Dein Lernstand liegt nur lokal. {lastExport ? `Letztes Backup vor ${daysSinceExport} Tagen.` : 'Noch kein Backup.'}{' '}
          <button className="link-btn" onClick={() => go('settings')}>Jetzt sichern</button>
        </div>
      )}

      <section className="hero">
        <div className="hero-ring">
          <ScoreRing value={readiness} caption="% reif" />
          <p className="muted small">Ziel: {TARGET_POINTS} P (sehr gut)</p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-num">{days}</span>
            <span className="stat-label">Tage bis AP1</span>
            <span className="muted small">{formatDE(EXAM_DATE)}</span>
          </div>
          <div className="stat">
            <span className="stat-num accent">{dueTotal}</span>
            <span className="stat-label">fällig heute</span>
          </div>
          <div className="stat">
            <span className="stat-num">{ov.mastered}</span>
            <span className="stat-label">gemeistert / {ov.totalItems}</span>
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

      <div className={`ontrack ${track}`}>
        <div className="ontrack-main">
          <span className="ontrack-dot" aria-hidden="true" />
          <strong>{trackLabel}</strong>
        </div>
        <span className="muted small">
          {unseen > 0
            ? `Noch ${unseen} neue Karten · ~${perDay}/Tag, um bis zum ${formatDE(EXAM_DATE)} alles einmal zu sehen`
            : 'Alles einmal gesehen — jetzt festigen & wiederholen'}
          {' · '}heute fällig: {dueTotal}
        </span>
      </div>

      <label className="core-toggle">
        <input type="checkbox" checked={coreOnly} onChange={(e) => setCoreOnly(e.target.checked)} />
        <span>Nur Kernthemen</span>
        <span className="muted small">— Karteikarten &amp; Quiz auf die Kernthemen beschränken</span>
      </label>

      <section className="modes">
        {MODES.map((m) => (
          <button key={m.view} className="mode-card" onClick={() => go(m.view)}>
            <span className="mode-icon" aria-hidden="true"><Icon name={m.icon} size={22} /></span>
            <span className="mode-title">{m.title}</span>
            <span className="mode-desc">{m.desc}</span>
          </button>
        ))}
      </section>

      <h2 className="section-title"><Icon name="grid" size={17} /> Interaktive Übungen</h2>
      <section className="modes">
        {INTERACTIVE.map((m) => (
          <button key={m.view} className="mode-card interactive" onClick={() => go(m.view)}>
            <span className="mode-icon" aria-hidden="true"><Icon name={m.icon} size={22} /></span>
            <span className="mode-title">{m.title}</span>
            <span className="mode-desc">{m.desc}</span>
          </button>
        ))}
      </section>

      <h2 className="section-title"><Icon name="wrench" size={17} /> Werkzeuge</h2>
      <section className="modes">
        {TOOLS.map((m) => (
          <button key={m.view} className="mode-card" onClick={() => go(m.view)}>
            <span className="mode-icon" aria-hidden="true"><Icon name={m.icon} size={22} /></span>
            <span className="mode-title">{m.title}</span>
            <span className="mode-desc">{m.desc}</span>
          </button>
        ))}
      </section>

      <section className="mastery">
        <h2>Mastery pro Thema</h2>
        <p className="muted small">Gewichtet nach Prüfungshäufigkeit (Heuristik). Rot = schwach, priorisiert.</p>
        <ul className="mastery-list">
          {masteries.map((m) => (
            <li key={m.topic.id} className={m.weak && m.seen > 0 ? 'weak' : ''}>
              <div className="mastery-top">
                <span className="mastery-name">{m.topic.label}</span>
                <span className="mastery-num muted small">
                  {m.mastered}/{m.total}
                  {m.topic.ap1Status === 'core' && <span className="core-dot" title="Kernthema"> ●</span>}
                </span>
              </div>
              <ProgressBar value={m.fraction} label={`${m.topic.label} Mastery`} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
