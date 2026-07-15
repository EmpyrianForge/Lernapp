import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { BUG_QUIZ, type ErrorType } from '../data/bug-quiz'
import { shuffle } from '../lib/scheduler'
import { Pill } from './ui'
import { Icon } from './Icon'

// "Fehler finden" — Fehlerart (Syntax/Laufzeit/Logik) eines Code-Bugs erkennen.
const TYPES: [ErrorType, string][] = [
  ['syntax', 'Syntaxfehler'],
  ['laufzeit', 'Laufzeitfehler'],
  ['logik', 'Logikfehler'],
]

export function BugFindMode({ onExit }: { onExit: () => void }) {
  const { recordDrill } = useAppState()
  const [items] = useState(() => shuffle(BUG_QUIZ))
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<ErrorType | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const item = items[idx]
  const done = idx >= items.length
  const correct = chosen === item?.errorType

  const check = () => {
    if (checked || chosen === null) return
    setChecked(true)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    recordDrill('Fehler finden', correct ? 1 : 0, 1)
  }
  const next = () => {
    setChecked(false)
    setChosen(null)
    setIdx((i) => i + 1)
  }

  if (done) {
    return (
      <section className="panel center">
        <h2><Icon name="check" size={20} className="done-ico" /> Geschafft</h2>
        <p className="big">{score.correct}/{score.total} richtig</p>
        <button className="btn primary" onClick={onExit}>Zurück zum Dashboard</button>
      </section>
    )
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><Pill>Fehler finden</Pill></div>
        <span className="counter">{score.correct}/{score.total} ✓</span>
      </header>

      <p className="q">Welche Fehlerart steckt in diesem Code?</p>

      <div className="code-lines" aria-label="Code">
        {item.code.split('\n').map((line, i) => (
          <div key={i} className={`code-line ${checked && i + 1 === item.buggyLine ? 'bug' : ''}`}>
            <span className="ln">{i + 1}</span>
            <span className="lc">{line || ' '}</span>
          </div>
        ))}
      </div>

      <div className="type-choice" role="group" aria-label="Fehlerart">
        {TYPES.map(([t, label]) => (
          <button
            key={t}
            className={`type-btn ${chosen === t ? 'sel' : ''} ${checked && item.errorType === t ? 'right' : ''} ${checked && chosen === t && !correct ? 'wrong' : ''}`}
            disabled={checked}
            aria-pressed={chosen === t}
            onClick={() => setChosen(t)}
          >
            {label}
          </button>
        ))}
      </div>

      {!checked ? (
        <button className="btn primary wide" disabled={chosen === null} onClick={check}>Prüfen</button>
      ) : (
        <>
          <div className={`feedback ${correct ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={correct ? 'check' : 'x'} size={16} className="fb-ico" />
            <span>{item.explanation}</span>
          </div>
          <button className="btn primary wide" onClick={next}>Nächste Aufgabe</button>
        </>
      )}
    </section>
  )
}
