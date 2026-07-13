import { useMemo, useState } from 'react'
import { useAppState } from '../state/AppState'
import { TOPICS } from '../data/topics'
import { flashcardsByTopic } from '../data/content'
import { buildQuiz } from '../lib/scheduler'
import { Reviewer } from './Reviewer'
import { Pill } from './ui'

// Themen-Quiz: frei wählbare Themen, interleaved, Sofort-Feedback (via Reviewer).
export function QuizMode({ onExit }: { onExit: () => void }) {
  const { states, coreOnly } = useAppState()
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(TOPICS.filter((t) => !coreOnly || t.ap1Status === 'core').map((t) => t.id)),
  )
  const [count, setCount] = useState(20)
  const [started, setStarted] = useState(false)

  const items = useMemo(
    () => (started ? buildQuiz([...selected], count, states) : []),
    // bewusst nur bei Start neu bauen:
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [started],
  )

  const toggle = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  if (started) return <Reviewer items={items} title="Themen-Quiz" onExit={onExit} />

  const available = TOPICS.filter((t) => selected.has(t.id)).reduce(
    (s, t) => s + flashcardsByTopic(t.id).length,
    0,
  )

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>Themen-Quiz</h2>
      </header>

      <p className="muted">Themen wählen — die Fragen werden gemischt (Interleaving wirkt besser als Blocklernen).</p>

      <div className="topic-grid">
        {TOPICS.map((t) => (
          <label key={t.id} className={`topic-pick ${selected.has(t.id) ? 'on' : ''}`}>
            <input
              type="checkbox"
              checked={selected.has(t.id)}
              onChange={() => toggle(t.id)}
            />
            <span className="topic-name">{t.label}</span>
            <Pill>{Math.round(t.examFrequency * 100)} %</Pill>
          </label>
        ))}
      </div>

      <div className="quiz-controls">
        <div className="seg">
          <button className="btn ghost sm" onClick={() => setSelected(new Set(TOPICS.map((t) => t.id)))}>Alle</button>
          <button className="btn ghost sm" onClick={() => setSelected(new Set())}>Keine</button>
        </div>
        <label className="count">
          Anzahl:
          <select value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[10, 20, 30, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </label>
        <button
          className="btn primary"
          disabled={selected.size === 0}
          onClick={() => setStarted(true)}
        >
          Quiz starten ({Math.min(count, available)} Fragen)
        </button>
      </div>
    </section>
  )
}
