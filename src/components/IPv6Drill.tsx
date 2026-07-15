import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { randomIPv6, type IPv6Drill as Drill } from '../lib/ipv6'
import { Pill } from './ui'
import { Icon } from './Icon'

// IPv6-Kürzen: volle Adresse -> kanonische Kurzform (RFC 5952). Generativ.
const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '')

export function IPv6Drill({ onExit }: { onExit: () => void }) {
  const { recordDrill } = useAppState()
  const [drill, setDrill] = useState<Drill>(() => randomIPv6())
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const correct = norm(answer) === norm(drill.short)

  const check = () => {
    if (checked) return
    setChecked(true)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    recordDrill('IPv6 kürzen', correct ? 1 : 0, 1)
  }
  const next = () => {
    setDrill(randomIPv6())
    setAnswer('')
    setChecked(false)
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><Pill>IPv6 kürzen</Pill></div>
        <span className="counter">{score.correct}/{score.total} ✓</span>
      </header>

      <div className="card">
        <p className="q">Kürze diese IPv6-Adresse (führende Nullen weg, längste Null-Folge als <code>::</code>):</p>
        <p className="ipv6-full">{drill.full}</p>
        <input
          className="ipv6-input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={checked}
          placeholder="z. B. 2001:db8::ff00:42:8329"
          aria-label="Gekürzte IPv6-Adresse"
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {!checked ? (
        <button className="btn primary wide" onClick={check}>Prüfen</button>
      ) : (
        <>
          <div className={`feedback ${correct ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={correct ? 'check' : 'x'} size={16} className="fb-ico" />
            <span>{correct ? 'Richtig!' : 'Nicht ganz.'} Korrekt: <strong className="mono">{drill.short}</strong></span>
          </div>
          <button className="btn primary wide" onClick={next}>Nächste Adresse</button>
        </>
      )}
    </section>
  )
}
