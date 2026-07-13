import { useMemo, useState } from 'react'
import { EXAM_TASKS, type ExamTask } from '../data/exam-tasks'
import { TOPIC_BY_ID } from '../data/topics'
import { gradeForPoints } from '../lib/grade'
import { MarkdownText } from './markdown'
import { Pill } from './ui'

// Authentische, mehrteilige Prüfungsaufgaben mit Selbstbewertung nach Teilpunkten.

function taskPoints(t: ExamTask): number {
  return t.parts.reduce((s, p) => s + p.points, 0)
}

function TaskView({ task, onExit }: { task: ExamTask; onExit: () => void }) {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [awarded, setAwarded] = useState<Record<number, number>>({})
  const total = useMemo(() => taskPoints(task), [task])
  const scored = Object.values(awarded).reduce((s, p) => s + p, 0)
  const allScored = task.parts.every((_, i) => awarded[i] !== undefined)
  const grade = gradeForPoints(scored, total)

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>{task.title}</h2>
      </header>

      <div className="scenario"><MarkdownText text={task.scenario} /></div>

      {task.parts.map((part, i) => (
        <div key={i} className="exam-part">
          <div className="part-head">
            <span className="part-label">{part.label}</span>
            <span className="part-op muted small">{part.operator}</span>
            <Pill tone="var(--accent-dim)">{part.points} P</Pill>
          </div>
          <p className="q"><MarkdownText text={part.prompt} /></p>
          <textarea className="calc-input" rows={3} placeholder="Deine Antwort … (nichts leer lassen)" aria-label={`Antwort ${part.label}`} />

          {!revealed[i] ? (
            <button className="btn" onClick={() => setRevealed((r) => ({ ...r, [i]: true }))}>Musterlösung & Punkte</button>
          ) : (
            <div className="solution" aria-live="polite">
              <h3>Musterlösung</h3>
              <p><MarkdownText text={part.modelAnswer} /></p>
              <h3>Bewertungskriterien</h3>
              <ul className="rubric">
                {part.rubric.map((r, k) => (
                  <li key={k}><span className="pts">✓</span> {r}</li>
                ))}
              </ul>
              <div className="award">
                <span>Punkte:</span>
                <div className="award-btns">
                  {Array.from({ length: part.points + 1 }, (_, p) => (
                    <button
                      key={p}
                      className={`award-btn ${awarded[i] === p ? 'sel' : ''}`}
                      onClick={() => setAwarded((a) => ({ ...a, [i]: p }))}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className={`exam-tasks-total ${allScored ? 'done' : ''}`}>
        Erreicht: <strong>{scored} / {total} P</strong>
        {allScored && <> — Note {grade.note} ({grade.label})</>}
      </div>
    </section>
  )
}

export function ExamTasksMode({ onExit }: { onExit: () => void }) {
  const [task, setTask] = useState<ExamTask | null>(null)
  if (task) return <TaskView task={task} onExit={() => setTask(null)} />

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>Prüfungsaufgaben</h2>
      </header>
      <p className="muted small">Authentische, mehrteilige Aufgaben im AP1-Stil (Frühjahr-2025-Blueprint). Antworten, Musterlösung aufdecken, selbst nach Punkten bewerten.</p>
      <div className="deck-list">
        {EXAM_TASKS.map((t) => (
          <button key={t.id} className="deck-card" onClick={() => setTask(t)}>
            <span className="deck-title">{t.title}</span>
            <span className="deck-meta">
              <Pill>{taskPoints(t)} P · {t.parts.length} Teile</Pill>
              <span className="muted small">{TOPIC_BY_ID[t.topicId]?.label ?? t.topicId}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
