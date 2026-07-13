import { useMemo, useState } from 'react'
import type { FlashcardItem } from '../types'
import { useAppState } from '../state/AppState'
import { CALCS, FLASHCARDS, ITEM_BY_ID } from '../data/content'
import { TOPIC_BY_ID } from '../data/topics'
import { MarkdownText } from './markdown'
import { Pill } from './ui'
import { Icon } from './Icon'

type Tab = 'suche' | 'formeln' | 'lesezeichen'

function BookmarkStar({ id }: { id: string }) {
  const { bookmarks, toggleBookmark } = useAppState()
  const on = bookmarks.has(id)
  return (
    <button
      className={`star ${on ? 'on' : ''}`}
      aria-pressed={on}
      aria-label={on ? 'Lesezeichen entfernen' : 'Lesezeichen setzen'}
      onClick={() => toggleBookmark(id)}
    >
      <Icon name={on ? 'bookmark-fill' : 'bookmark'} size={17} />
    </button>
  )
}

function CardRow({ item }: { item: FlashcardItem }) {
  return (
    <li className="ref-row">
      <div className="ref-head">
        <span className="ref-front">{item.front}</span>
        <BookmarkStar id={item.id} />
      </div>
      <div className="ref-back muted"><MarkdownText text={item.back} /></div>
      <Pill>{TOPIC_BY_ID[item.topicId]?.label ?? item.topicId}</Pill>
    </li>
  )
}

export function ReferenceMode({ onExit }: { onExit: () => void }) {
  const { bookmarks } = useAppState()
  const [tab, setTab] = useState<Tab>('suche')
  const [q, setQ] = useState('')

  const results = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (query.length < 2) return []
    return FLASHCARDS.filter(
      (c) => c.front.toLowerCase().includes(query) || c.back.toLowerCase().includes(query),
    ).slice(0, 40)
  }, [q])

  const bookmarked = useMemo(
    () => [...bookmarks].map((id) => ITEM_BY_ID.get(id)).filter((i): i is FlashcardItem => i?.type === 'flashcard'),
    [bookmarks],
  )

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>Nachschlagen</h2>
      </header>

      <div className="tabs" role="tablist">
        {([['suche', 'Suche'], ['formeln', 'Formeln'], ['lesezeichen', `Lesezeichen (${bookmarks.size})`]] as [Tab, string][]).map(([t, label]) => (
          <button key={t} role="tab" aria-selected={tab === t} className={`tab ${tab === t ? 'on' : ''}`} onClick={() => setTab(t)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'suche' && (
        <>
          <input
            className="search-input"
            placeholder={`Alle ${FLASHCARDS.length} Karten durchsuchen …`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Suche"
            autoFocus
          />
          {q.trim().length < 2 ? (
            <p className="muted small">Mindestens 2 Zeichen eingeben. Durchsucht Frage und Antwort.</p>
          ) : (
            <>
              <p className="muted small">{results.length} Treffer{results.length === 40 ? '+ (gekürzt)' : ''}</p>
              <ul className="ref-list">
                {results.map((c) => <CardRow key={c.id} item={c} />)}
              </ul>
            </>
          )}
        </>
      )}

      {tab === 'formeln' && (
        <div className="formulas">
          <p className="muted small">Alle prüfungsrelevanten Rechenschemata mit Formel und Musterergebnis.</p>
          {CALCS.map((c) => (
            <div key={c.id} className="formula-card">
              <div className="ref-head"><strong>{c.prompt.split('.')[0]}</strong><Pill tone="var(--accent-dim)">{c.points} P</Pill></div>
              <ol className="steps">{c.solutionSteps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              <p className="result"><strong>Ergebnis:</strong> {c.answer}{c.unit !== '—' ? ` [${c.unit}]` : ''}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'lesezeichen' && (
        bookmarked.length === 0 ? (
          <p className="muted">Noch keine Lesezeichen. Setze in der Suche über das Lesezeichen-Symbol eines.</p>
        ) : (
          <ul className="ref-list">
            {bookmarked.map((c) => <CardRow key={c.id} item={c} />)}
          </ul>
        )
      )}
    </section>
  )
}
