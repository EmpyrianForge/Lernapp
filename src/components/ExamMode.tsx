import { useEffect, useMemo, useRef, useState } from 'react'
import type { Item } from '../types'
import { buildExam, type ExamQuestion } from '../lib/scheduler'
import { gradeForPoints, PASS_THRESHOLD, TARGET_POINTS } from '../lib/grade'
import { Pill } from './ui'
import { MarkdownText } from './markdown'
import { Icon } from './Icon'

// Prüfungssimulation: 90 Min, 4 unabhängige Aufgabenbereiche, nur offene Aufgaben.
// Selbstbewertung pro Frage nach Teilpunkten → Auswertung gegen 100 P + Blockschlüssel
// (00-Pruefungsrahmen.md). Bewusst getrennt vom Spaced-Repetition-Fortschritt.

interface FlatQ extends ExamQuestion {
  areaIndex: number
  areaTitle: string
}

function questionText(item: Item): string {
  return item.type === 'flashcard' ? item.front : item.prompt
}

function ModelAnswer({ item }: { item: Item }) {
  if (item.type === 'flashcard') {
    return <p><MarkdownText text={item.back} /></p>
  }
  if (item.type === 'calc') {
    return (
      <div>
        <ol className="steps">
          {item.solutionSteps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
        <p className="result"><strong>Ergebnis:</strong> {item.answer}{item.unit !== '—' ? ` [${item.unit}]` : ''}</p>
        <ul className="rubric">
          {item.rubric.map((r, i) => (
            <li key={i}><span className="pts">{r.points} P</span> {r.criterion}</li>
          ))}
        </ul>
      </div>
    )
  }
  return (
    <div>
      <p className="result"><strong>Ergebnis:</strong> {item.output}</p>
      <ul className="rubric">
        {item.rubric.map((r, i) => (
          <li key={i}><span className="pts">{r.points} P</span> {r.criterion}</li>
        ))}
      </ul>
    </div>
  )
}

export function ExamMode({ onExit }: { onExit: () => void }) {
  const exam = useMemo(() => buildExam(), [])
  const flat = useMemo<FlatQ[]>(
    () =>
      exam.areas.flatMap((a, ai) =>
        a.questions.map((q) => ({ ...q, areaIndex: ai, areaTitle: a.title })),
    ),
    [exam],
  )

  const [secondsLeft, setSecondsLeft] = useState(exam.durationMin * 60)
  const [phase, setPhase] = useState<'running' | 'finished'>('running')
  const [pos, setPos] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [awarded, setAwarded] = useState<Record<number, number>>({})
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (phase !== 'running') return
    timerRef.current = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(timerRef.current!)
          setPhase('finished')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [phase])

  const q = flat[pos]
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')
  const lowTime = secondsLeft <= 300

  if (phase === 'finished') {
    const scored = Object.values(awarded).reduce((s, p) => s + p, 0)
    const total = exam.totalPoints
    const norm = Math.round((scored / total) * 100)
    const grade = gradeForPoints(scored, total)
    const perArea = exam.areas.map((a, ai) => {
      const qs = flat.filter((f) => f.areaIndex === ai)
      const max = qs.reduce((s, f) => s + f.maxPoints, 0)
      const got = qs.reduce((s, f) => s + (awarded[flat.indexOf(f)] ?? 0), 0)
      return { title: a.title, got, max }
    })
    return (
      <section className="panel">
        <header className="panel-head">
          <h2>Auswertung</h2>
        </header>
        <div className="exam-result">
          <div className={`big-score note-${grade.note}`}>
            <strong>{norm}</strong><span>/ 100 P</span>
          </div>
          <p className="grade-line">Note <strong>{grade.note}</strong> — {grade.label}
            {norm >= TARGET_POINTS ? ' — Ziel erreicht!' : norm >= PASS_THRESHOLD ? ' (bestanden)' : ' (nicht bestanden)'}
          </p>
          <p className="muted small">{scored} von {total} Rohpunkten, normiert auf 100.</p>
        </div>
        <div className="area-breakdown">
          {perArea.map((a) => (
            <div key={a.title} className="area-row">
              <span>{a.title}</span>
              <Pill>{a.got}/{a.max} P</Pill>
            </div>
          ))}
        </div>
        <div className="row">
          <button className="btn primary" onClick={onExit}>Zurück zum Dashboard</button>
        </div>
      </section>
    )
  }

  const answered = flat.filter((_, i) => (awarded[i] ?? null) !== null && revealed[i]).length

  return (
    <section className="panel exam">
      <header className="exam-head">
        <button className="btn ghost" onClick={() => setPhase('finished')}>Abgeben</button>
        <div className={`timer ${lowTime ? 'low' : ''}`} role="timer" aria-live="off">
          <Icon name="timer" size={16} /> {mm}:{ss}
        </div>
        <span className="counter">{pos + 1} / {flat.length}</span>
      </header>

      <div className="area-label">{q.areaTitle}</div>

      <div className="qnav" role="tablist" aria-label="Fragen">
        {flat.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === pos ? 'cur' : ''} ${revealed[i] ? 'seen' : ''}`}
            aria-label={`Frage ${i + 1}`}
            aria-current={i === pos}
            onClick={() => setPos(i)}
          />
        ))}
      </div>

      <div className="card">
        <div className="q-head">
          <span className="q-no">Aufgabe {pos + 1}</span>
          <Pill tone="var(--accent-dim)">{q.maxPoints} P</Pill>
        </div>
        <p className="q"><MarkdownText text={questionText(q.item)} /></p>
        <textarea
          className="calc-input"
          placeholder="Antwort … (nichts leer lassen — Teilpunkte!)"
          value={answers[pos] ?? ''}
          onChange={(e) => setAnswers((a) => ({ ...a, [pos]: e.target.value }))}
          rows={5}
          aria-label="Deine Antwort"
        />

        {!revealed[pos] ? (
          <button className="btn" onClick={() => setRevealed((r) => ({ ...r, [pos]: true }))}>
            Musterlösung & Punkte vergeben
          </button>
        ) : (
          <div className="solution" aria-live="polite">
            <h3>Musterlösung</h3>
            <ModelAnswer item={q.item} />
            <div className="award">
              <span>Punkte vergeben:</span>
              <div className="award-btns">
                {Array.from({ length: q.maxPoints + 1 }, (_, p) => (
                  <button
                    key={p}
                    className={`award-btn ${awarded[pos] === p ? 'sel' : ''}`}
                    onClick={() => setAwarded((a) => ({ ...a, [pos]: p }))}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="exam-foot">
        <button className="btn ghost" disabled={pos === 0} onClick={() => setPos((p) => p - 1)}>← Zurück</button>
        <span className="muted small">{answered} / {flat.length} bewertet</span>
        <button className="btn" disabled={pos === flat.length - 1} onClick={() => setPos((p) => p + 1)}>Weiter →</button>
      </div>
    </section>
  )
}
