import { useMemo, useState } from 'react'
import { ORDER_TASKS, type OrderTask } from '../data/interactive'
import { TOPIC_BY_ID } from '../data/topics'
import { useAppState } from '../state/AppState'
import { shuffle } from '../lib/scheduler'
import { Pill } from './ui'
import { Icon } from './Icon'

// Reihenfolge-Drill: Elemente per ▲/▼ in die richtige Ordnung bringen (touch-/tastaturfreundlich).

function initialOrder(correct: string[]): string[] {
  let s = shuffle(correct)
  // sicherstellen, dass es nicht zufällig schon korrekt ist
  if (s.every((v, i) => v === correct[i])) s = shuffle(correct)
  return s
}

function Game({ task, onExit }: { task: OrderTask; onExit: () => void }) {
  const { recordDrill } = useAppState()
  const [items, setItems] = useState<string[]>(() => initialOrder(task.correct))
  const [checked, setChecked] = useState(false)

  const correctness = useMemo(
    () => items.map((v, i) => v === task.correct[i]),
    [items, task.correct],
  )
  const allCorrect = correctness.every(Boolean)

  const doCheck = () => {
    setChecked(true)
    recordDrill('Reihenfolge', correctness.filter(Boolean).length, items.length)
  }

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    setItems((prev) => {
      const next = prev.slice()
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
    setChecked(false)
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><span className="pill">{task.title}</span></div>
      </header>
      <p className="muted small">{task.prompt}</p>

      <ol className="order-list">
        {items.map((item, i) => (
          <li
            key={item}
            className={`order-item ${checked ? (correctness[i] ? 'ok' : 'bad') : ''}`}
          >
            <span className="order-pos">{i + 1}</span>
            <span className="order-label">{item}</span>
            <span className="order-btns">
              <button className="btn ghost sm" disabled={i === 0} aria-label="nach oben" onClick={() => move(i, -1)}>▲</button>
              <button className="btn ghost sm" disabled={i === items.length - 1} aria-label="nach unten" onClick={() => move(i, 1)}>▼</button>
            </span>
          </li>
        ))}
      </ol>

      {allCorrect && checked ? (
        <>
          <div className="feedback ok" aria-live="polite"><Icon name="check" size={16} className="fb-ico" /><span>Richtige Reihenfolge!</span></div>
          <button className="btn primary wide" onClick={onExit}>Zurück zur Auswahl</button>
        </>
      ) : (
        <button className="btn primary wide" onClick={doCheck}>Prüfen</button>
      )}
      {checked && !allCorrect && (
        <div className="feedback bad" aria-live="polite">
          <Icon name="x" size={16} className="fb-ico" />
          <span>{correctness.filter(Boolean).length}/{items.length} an der richtigen Position — weiter sortieren.</span>
        </div>
      )}
    </section>
  )
}

export function OrderDrill({ onExit }: { onExit: () => void }) {
  const [task, setTask] = useState<OrderTask | null>(null)
  if (task) return <Game task={task} onExit={() => setTask(null)} />

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>Reihenfolge</h2>
      </header>
      <p className="muted small">Wähle eine Aufgabe und bringe die Elemente mit ▲/▼ in die richtige Ordnung.</p>
      <div className="deck-list">
        {ORDER_TASKS.map((t) => (
          <button key={t.id} className="deck-card" onClick={() => setTask(t)}>
            <span className="deck-title">{t.title}</span>
            <span className="deck-meta">
              <Pill>{t.correct.length} Schritte</Pill>
              <span className="muted small">{TOPIC_BY_ID[t.topicId]?.label ?? t.topicId}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
