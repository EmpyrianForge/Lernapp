import { useCallback, useEffect, useState } from 'react'
import type { Grade } from '../types'
import { useAppState } from '../state/AppState'
import { CALCS } from '../data/content'
import { shuffle } from '../lib/scheduler'
import { TOPIC_BY_ID } from '../data/topics'
import { GradeButtons, Pill, ProgressBar } from './ui'
import { Icon } from './Icon'

// Rechenaufgaben: freies Rechnen, dann Musterlösung mit Rechenweg + Teilpunkten (rubric)
// + Fallen. Trainiert die Taktik „Formel + Weg + Einheit" (02-Aufgabentypen-Operatoren).
export function CalcMode({ onExit }: { onExit: () => void }) {
  const { review } = useAppState()
  const [items] = useState(() => shuffle(CALCS))
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [answer, setAnswer] = useState('')

  const item = items[idx]
  const done = idx >= items.length

  const next = useCallback(
    (g: Grade) => {
      if (!item) return
      void review(item.id, g)
      setRevealed(false)
      setAnswer('')
      setIdx((i) => i + 1)
    },
    [item, review],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (done || !revealed) return
      const el = e.target as HTMLElement
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') return
      if (['1', '2', '3', '4'].includes(e.key)) next(Number(e.key) as Grade)
      if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, revealed, next, onExit])

  if (done) {
    return (
      <section className="panel center">
        <h2><Icon name="check" size={20} className="done-ico" /> Rechentraining fertig</h2>
        <p className="muted">Alle {items.length} Aufgaben durch. Formel + Weg + Einheit sitzt?</p>
        <button className="btn primary" onClick={onExit}>Zurück zum Dashboard</button>
      </section>
    )
  }

  const topic = TOPIC_BY_ID[item.topicId]

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta">
          <Pill>{topic?.label ?? item.topicId}</Pill>
          <Pill tone="var(--accent-dim)">{item.points} P</Pill>
        </div>
        <span className="counter">{idx + 1} / {items.length}</span>
      </header>

      <ProgressBar value={idx / items.length} label="Fortschritt" />

      <div className="card">
        <p className="q">{item.prompt}</p>
        <textarea
          className="calc-input"
          placeholder="Rechenweg + Zwischenschritte + Einheit …"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={5}
          aria-label="Dein Rechenweg"
        />
      </div>

      {!revealed ? (
        <button className="btn primary wide" onClick={() => setRevealed(true)}>Musterlösung zeigen</button>
      ) : (
        <>
          <div className="solution" aria-live="polite">
            <h3>Rechenweg</h3>
            <ol className="steps">
              {item.solutionSteps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            <p className="result"><strong>Ergebnis:</strong> {item.answer} {item.unit !== '—' && <span className="unit">[{item.unit}]</span>}</p>

            <h3>Teilpunkte (Rubric)</h3>
            <ul className="rubric">
              {item.rubric.map((r, i) => (
                <li key={i}><span className="pts">{r.points} P</span> {r.criterion}</li>
              ))}
            </ul>

            <h3 className="h3-ico"><Icon name="alert" size={15} /> Typische Fallen</h3>
            <ul className="pitfalls">
              {item.pitfalls.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <p className="muted small">Wie sicher warst du? (fließt in die Wiederholung ein)</p>
          <GradeButtons onGrade={next} />
        </>
      )}
    </section>
  )
}
