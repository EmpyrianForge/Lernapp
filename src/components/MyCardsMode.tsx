import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { TOPICS, TOPIC_BY_ID } from '../data/topics'
import { Pill } from './ui'

// Eigene Karteikarten: lokal gespeichert (Dexie), fließen in Spaced Repetition & Quiz
// ein und bleiben beim Re-Ingest der Vault-Decks erhalten.
export function MyCardsMode({ onExit }: { onExit: () => void }) {
  const { userCards, addUserCard, deleteUserCard } = useAppState()
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [topicId, setTopicId] = useState(TOPICS[0].id)
  const [busy, setBusy] = useState(false)

  const canAdd = front.trim().length > 2 && back.trim().length > 1

  const add = async () => {
    if (!canAdd || busy) return
    setBusy(true)
    await addUserCard(front, back, topicId)
    setFront('')
    setBack('')
    setBusy(false)
  }

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>Meine Karten</h2>
      </header>
      <p className="muted small">Eigene Karten werden lokal gespeichert, in Karteikarten &amp; Quiz einbezogen und bleiben beim Aktualisieren der Vault-Decks erhalten.</p>

      <div className="card mycard-form">
        <label className="field">
          <span>Frage</span>
          <textarea value={front} onChange={(e) => setFront(e.target.value)} rows={2} placeholder="Vorderseite / Frage" />
        </label>
        <label className="field">
          <span>Antwort</span>
          <textarea value={back} onChange={(e) => setBack(e.target.value)} rows={3} placeholder="Rückseite / Antwort (Markdown: **fett**, `code`)" />
        </label>
        <div className="mycard-row">
          <label className="field inline">
            <span>Thema</span>
            <select value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </label>
          <button className="btn primary" disabled={!canAdd || busy} onClick={add}>Karte hinzufügen</button>
        </div>
      </div>

      <h3 className="sec">Deine Karten ({userCards.length})</h3>
      {userCards.length === 0 ? (
        <p className="muted">Noch keine eigenen Karten.</p>
      ) : (
        <ul className="ref-list">
          {userCards.map((c) => (
            <li key={c.id} className="ref-row">
              <div className="ref-head">
                <span className="ref-front">{c.front}</span>
                <button className="btn ghost sm" aria-label="Karte löschen" onClick={() => void deleteUserCard(c.id)}>🗑</button>
              </div>
              <div className="ref-back muted">{c.back}</div>
              <Pill>{TOPIC_BY_ID[c.topicId]?.label ?? c.topicId}</Pill>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
