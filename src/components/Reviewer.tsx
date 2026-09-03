import { useCallback, useEffect, useRef, useState } from 'react'
import type { FlashcardItem, Grade } from '../types'
import { useAppState } from '../state/AppState'
import { TOPIC_BY_ID } from '../data/topics'
import { keyTerms, matchTerms } from '../lib/keywords'
import { GradeButtons, Pill, ProgressBar } from './ui'
import { MarkdownText } from './markdown'
import { Icon } from './Icon'
import { Confetti } from './Confetti'

// Wiederverwendbarer Active-Recall-Loop: erst Frage, Antwort erst nach Eigenversuch
// (Testing-Effekt). Mit „Antwort eintippen" (Einstellungen, Standard an) wird die eigene
// Antwort erst GESCHRIEBEN und dann neben der Musterlösung verglichen — strenger als
// „hätte ich gewusst". Ein Schlüsselbegriff-Abgleich hilft beim Vergleichen, bewertet aber
// nicht: die Note 1–4 vergibst du selbst (wie in der IHK-Prüfung gegen die Musterlösung).
// Selbstbewertung speist SM-2. Volle Tastaturbedienung.

interface Props {
  items: FlashcardItem[]
  title: string
  onExit: () => void
}

function inField(e: KeyboardEvent): boolean {
  const t = e.target as HTMLElement | null
  return !!t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT')
}

export function Reviewer({ items, title, onExit }: Props) {
  const { review, bookmarks, toggleBookmark, typeAnswers } = useAppState()
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [typed, setTyped] = useState('')
  const [grades, setGrades] = useState<Grade[]>([])
  const liveRef = useRef<HTMLDivElement>(null)

  const item = items[idx]
  const done = idx >= items.length

  const reveal = useCallback(() => setRevealed(true), [])

  const grade = useCallback(
    (g: Grade) => {
      if (!item || !revealed) return
      void review(item.id, g, { typed: typed.trim().length > 0 })
      setGrades((prev) => [...prev, g])
      setRevealed(false)
      setTyped('')
      setIdx((i) => i + 1)
    },
    [item, revealed, review, typed],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (done) return
      if (e.key === 'Escape') {
        onExit()
        return
      }
      if (!revealed) {
        if (inField(e)) {
          // Im Eingabefeld: Enter = vergleichen, Shift+Enter = neue Zeile, Leertaste tippt.
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            reveal()
          }
          return
        }
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          reveal()
        }
      } else if (['1', '2', '3', '4'].includes(e.key)) {
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
        {grades.length >= 5 && good / grades.length >= 0.8 && <Confetti />}
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
  const hasTyped = typed.trim().length >= 3
  const terms = revealed && hasTyped ? keyTerms(item.back) : []
  const { hit, miss } = terms.length > 0 ? matchTerms(terms, typed) : { hit: [], miss: [] }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit} aria-label="Session verlassen (Esc)">← Beenden</button>
        <div className="study-meta">
          <Pill>{topic?.label ?? item.topicId}</Pill>
          {item.ap1Status === 'ap2-grundlagen' && <Pill tone="var(--muted-bg)">AP2-Grundlagen</Pill>}
          {item.peripheral && <Pill tone="var(--accent-dim)">Randstoff</Pill>}
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

        {!revealed && typeAnswers && (
          <textarea
            key={item.id}
            className="calc-input"
            rows={3}
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Deine Antwort … (Enter = vergleichen, Shift+Enter = neue Zeile)"
            aria-label="Deine Antwort"
          />
        )}
        {!revealed && !typeAnswers && (
          <p className="hint muted">Antwort mental formulieren, dann aufdecken.</p>
        )}

        {revealed && (
          <div className="a">
            {hasTyped && (
              <div className="typed-answer">
                <span className="ta-label">Deine Antwort</span>
                <p>{typed}</p>
              </div>
            )}
            <hr />
            <p><MarkdownText text={item.back} /></p>
            {terms.length > 0 && (
              <div className="kw-hint" aria-label="Schlüsselbegriff-Abgleich">
                <span className="muted small">Schlüsselbegriffe (Hinweis, keine Bewertung):</span>
                {hit.map((t) => <span key={`h-${t}`} className="kw kw-hit" title="in deiner Antwort">{t}</span>)}
                {miss.map((t) => <span key={`m-${t}`} className="kw kw-miss" title="nicht erwähnt">{t}</span>)}
              </div>
            )}
          </div>
        )}
      </div>

      {revealed ? (
        <GradeButtons onGrade={grade} />
      ) : (
        <button className="btn primary wide" onClick={reveal}>
          {typeAnswers ? <>Vergleichen <kbd>Enter</kbd></> : <>Antwort aufdecken <kbd>Leertaste</kbd></>}
        </button>
      )}
    </section>
  )
}
