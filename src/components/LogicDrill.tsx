import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { randomLogic, type LogicDrill as Drill } from '../lib/logic'
import { Pill } from './ui'
import { Icon } from './Icon'

// Bedingungen/Logik: booleschen Ausdruck (UND/ODER/NICHT, Vergleiche) auswerten.
export function LogicDrill({ onExit }: { onExit: () => void }) {
  const { recordDrill } = useAppState()
  const [drill, setDrill] = useState<Drill>(() => randomLogic())
  const [chosen, setChosen] = useState<boolean | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const correct = chosen === drill.result

  const check = (val: boolean) => {
    if (checked) return
    setChosen(val)
    setChecked(true)
    const ok = val === drill.result
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }))
    recordDrill('Bedingungen/Logik', ok ? 1 : 0, 1)
  }
  const next = () => {
    setDrill(randomLogic())
    setChosen(null)
    setChecked(false)
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><Pill>Bedingungen / Logik</Pill></div>
        <span className="counter">{score.correct}/{score.total} ✓</span>
      </header>

      <div className="card">
        <p className="muted small">Gegeben:</p>
        <div className="logic-vars">
          <span>a = <strong>{drill.vars.a}</strong></span>
          <span>b = <strong>{drill.vars.b}</strong></span>
          <span>c = <strong>{drill.vars.c}</strong></span>
        </div>
        <p className="q">Ist dieser Ausdruck wahr oder falsch?</p>
        <pre className="code-block logic-expr"><code>{drill.expr}</code></pre>
      </div>

      {!checked ? (
        <div className="logic-choice">
          <button className="btn primary" onClick={() => check(true)}>WAHR</button>
          <button className="btn primary" onClick={() => check(false)}>FALSCH</button>
        </div>
      ) : (
        <>
          <div className={`feedback ${correct ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={correct ? 'check' : 'x'} size={16} className="fb-ico" />
            <span>{correct ? 'Richtig!' : 'Leider falsch.'} Der Ausdruck ist <strong>{drill.result ? 'WAHR' : 'FALSCH'}</strong>.</span>
          </div>
          <div className="solution">
            <h3>Auswertung</h3>
            <ol className="steps">
              {drill.steps.map((s, i) => (
                <li key={i} className="mono">{s}</li>
              ))}
            </ol>
          </div>
          <button className="btn primary wide" onClick={next}>Nächste Aufgabe</button>
        </>
      )}
    </section>
  )
}
