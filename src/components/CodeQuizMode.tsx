import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { CODE_QUIZ } from '../data/code-quiz'
import { shuffle } from '../lib/scheduler'
import { Pill } from './ui'
import { Icon } from './Icon'

// "Was gibt der Code aus?" — Code lesen, Konsolenausgabe eintippen, prüfen.
type Lang = 'pseudocode' | 'java' | 'python'
const LANGS: [Lang, string][] = [
  ['pseudocode', 'Pseudocode'],
  ['java', 'Java'],
  ['python', 'Python'],
]

const norm = (s: string) => s.trim().replace(/\r/g, '')

export function CodeQuizMode({ onExit }: { onExit: () => void }) {
  const { recordDrill } = useAppState()
  const [items] = useState(() => shuffle(CODE_QUIZ))
  const [idx, setIdx] = useState(0)
  const [lang, setLangState] = useState<Lang>(
    () => ((typeof localStorage !== 'undefined' && (localStorage.getItem('oop-lang') as Lang)) || 'pseudocode'),
  )
  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('oop-lang', l) } catch { /* ignore */ }
  }
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const item = items[idx]
  const done = idx >= items.length
  const correct = !!item && norm(answer) === norm(item.output)

  const check = () => {
    if (checked || !item) return
    setChecked(true)
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }))
    recordDrill('Code-Ausgabe', correct ? 1 : 0, 1)
  }
  const next = () => {
    setChecked(false)
    setAnswer('')
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
        <div className="study-meta"><Pill>Was gibt der Code aus?</Pill></div>
        <span className="counter">{score.correct}/{score.total} ✓</span>
      </header>

      <p className="q">{item.title} — was steht am Ende in der Konsole?</p>

      <div className="lang-toggle" role="tablist" aria-label="Code-Sprache">
        {LANGS.map(([l, label]) => (
          <button key={l} role="tab" aria-selected={lang === l} className={`seg-btn ${lang === l ? 'on' : ''}`} onClick={() => setLang(l)}>
            {label}
          </button>
        ))}
      </div>

      <pre className="code-block" aria-label={`Code (${lang})`}><code>{item[lang]}</code></pre>

      <label className="cq-answer">
        <span className="co-label">Deine Ausgabe</span>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={checked}
          placeholder="Ergebnis eintippen …"
          aria-label="Konsolenausgabe eintippen"
          autoFocus
        />
      </label>

      {!checked ? (
        <button className="btn primary wide" onClick={check}>Prüfen</button>
      ) : (
        <>
          <div className={`feedback ${correct ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={correct ? 'check' : 'x'} size={16} className="fb-ico" />
            <span>{correct ? 'Richtig!' : 'Nicht ganz.'} Ausgabe: <strong>{item.output}</strong></span>
          </div>
          <button className="btn primary wide" onClick={next}>Nächste Aufgabe</button>
        </>
      )}
    </section>
  )
}
