import { useCallback, useEffect, useRef, useState } from 'react'
import type { FlashcardItem, Grade } from '../types'
import { useAppState } from '../state/AppState'
import { TOPIC_BY_ID } from '../data/topics'
import { GradeButtons, Pill, ProgressBar } from './ui'
import { MarkdownText } from './markdown'
import { Icon } from './Icon'

// Wiederverwendbarer Active-Recall-Loop: erst Frage, Antwort erst nach Eigenversuch
// (Testing-Effekt). Selbstbewertung 1–4 speist SM-2. Volle Tastaturbedienung.

interface Props {
  items: FlashcardItem[]
  title: string
  onExit: () => void
}

export function Reviewer({ items, title, onExit }: Props) {
  const { review, bookmarks, toggleBookmark } = useAppState()
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [grades, setGrades] = useState<Grade[]>([])
  const liveRef = useRef<HTMLDivElement>(null)

  const item = items[idx]
  const done = idx >= items.length

  const reveal = useCallback(() => setRevealed(true), [])

  const grade = useCallback(
    (g: Grade) => {
      if (!item || !revealed) return
      void review(item.id, g)
      setGrades((prev) => [...prev, g])
      setRevealed(false)
      setIdx((i) => i + 1)
    },
    [item, revealed, review],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (done) return
      if (e.key === 'Escape') {
        onExit()
        return
      }
      if ((e.key === ' ' || e.key === 'Enter') && !revealed) {
        e.preventDefault()
        reveal()
      } else if (revealed && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault()
        grade(Number(e.key) as Grade)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, revealed, reveal, grade, onExit])

  if (items.length === 0) {
    return (
      <section className="panel center">
        <h2>{title}</h2>
        <p className="muted">Aktuell nichts fällig. Schau später wieder rein oder wähle einen anderen Modus.</p>
        <button className="btn" onClick={onExit}>Zurück</button>
      </section>
    )
  }

  if (done) {
    const good = grades.filter((g) => g >= 3).length
    return (
      <section className="panel center">
        <h2><Icon name="check" size={20} className="done-ico" /> Session abgeschlossen</h2>
        <p className="big">{good}/{grades.length} sicher gewusst</p>
        <div className="grade-dist">
          {([1, 2, 3, 4] as Grade[]).map((g) => (
            <span key={g}>Note {g}: {grades.filter((x) => x === g).length}</span>
          ))}
        </div>
        <button className="btn primary" onClick={onExit}>Zurück zum Dashboard</button>
      </section>
    )
  }

  const topic = TOPIC_BY_ID[item.topicId]

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit} aria-label="Session verlassen (Esc)">← Beenden</button>
        <div className="study-meta">
          <Pill>{topic?.label ?? item.topicId}</Pill>
          {item.ap1Status === 'ap2-grundlagen' && <Pill tone="var(--muted-bg)">AP2-Grundlagen</Pill>}
          <button
            className={`star ${bookmarks.has(item.id) ? 'on' : ''}`}
            aria-pressed={bookmarks.has(item.id)}
            aria-label={bookmarks.has(item.id) ? 'Lesezeichen entfernen' : 'Lesezeichen setzen'}
            onClick={() => toggleBookmark(item.id)}
          >
            <Icon name={bookmarks.has(item.id) ? 'bookmark-fill' : 'bookmark'} size={16} />
          </button>
        </div>
        <span className="counter">{idx + 1} / {items.length}</span>
      </header>

      <ProgressBar value={idx / items.length} label="Fortschritt" />

      <div className="card" aria-live="polite" ref={liveRef}>
        <p className="q"><MarkdownText text={item.front} /></p>
        {revealed ? (
          <div className="a">
            <hr />
            <p><MarkdownText text={item.back} /></p>
          </div>
        ) : (
          <p className="hint muted">Antwort mental formulieren, dann aufdecken.</p>
        )}
      </div>

      {revealed ? (
        <GradeButtons onGrade={grade} />
      ) : (
        <button className="btn primary wide" onClick={reveal}>
          Antwort aufdecken <kbd>Leertaste</kbd>
        </button>
      )}
    </section>
  )
}
