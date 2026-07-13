import { useMemo, useState } from 'react'
import { MATCH_DECKS, type MatchDeck } from '../data/interactive'
import { TOPIC_BY_ID } from '../data/topics'
import { useAppState } from '../state/AppState'
import { shuffle } from '../lib/scheduler'
import { Pill } from './ui'
import { Icon } from './Icon'

// Zuordnungs-Drill: erst einen Begriff links wählen, dann den passenden Wert rechts.
// Tap-to-Pair statt HTML5-Drag → touch- und tastaturfreundlich.

function Game({ deck, onExit }: { deck: MatchDeck; onExit: () => void }) {
  const { recordDrill } = useAppState()
  const rights = useMemo(
    () => shuffle(deck.pairs.map((p, li) => ({ right: p.right, li }))),
    [deck],
  )
  const [selLeft, setSelLeft] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [wrong, setWrong] = useState<{ li: number } | null>(null)
  const [mistakes, setMistakes] = useState(0)

  const done = matched.size === deck.pairs.length

  const clickRight = (li: number, right: string) => {
    if (selLeft === null || matched.has(li)) return
    if (deck.pairs[selLeft].right === right) {
      const newSize = matched.size + 1
      setMatched((m) => new Set(m).add(selLeft))
      setSelLeft(null)
      if (newSize === deck.pairs.length) {
        recordDrill('Zuordnung', deck.pairs.length, deck.pairs.length + mistakes)
      }
    } else {
      setMistakes((n) => n + 1)
      setWrong({ li })
      window.setTimeout(() => setWrong(null), 500)
    }
  }

  if (done) {
    const acc = Math.round((deck.pairs.length / (deck.pairs.length + mistakes)) * 100)
    return (
      <section className="panel center">
        <h2><Icon name="check" size={20} className="done-ico" /> Geschafft</h2>
        <p className="big">{deck.pairs.length} Paare · {mistakes} Fehlversuche</p>
        <p className="muted">Trefferquote {acc} %</p>
        <button className="btn primary" onClick={onExit}>Zurück</button>
      </section>
    )
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><span className="pill">{deck.title}</span></div>
        <span className="counter">{matched.size}/{deck.pairs.length}</span>
      </header>
      <p className="muted small">{deck.instruction} Fehlversuche: {mistakes}</p>

      <div className="match-cols">
        <div className="match-col">
          {deck.pairs.map((p, i) => (
            <button
              key={i}
              className={`match-item ${matched.has(i) ? 'done' : ''} ${selLeft === i ? 'sel' : ''}`}
              disabled={matched.has(i)}
              aria-pressed={selLeft === i}
              onClick={() => setSelLeft(i)}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="match-col">
          {rights.map(({ right, li }) => (
            <button
              key={li}
              className={`match-item ${matched.has(li) ? 'done' : ''} ${wrong?.li === li ? 'wrong' : ''}`}
              disabled={matched.has(li)}
              onClick={() => clickRight(li, right)}
            >
              {right}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function MatchDrill({ onExit }: { onExit: () => void }) {
  const [deck, setDeck] = useState<MatchDeck | null>(null)
  if (deck) return <Game deck={deck} onExit={() => setDeck(null)} />

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>Zuordnung</h2>
      </header>
      <p className="muted small">Wähle einen Satz. Erst links einen Begriff antippen, dann rechts den passenden Wert.</p>
      <div className="deck-list">
        {MATCH_DECKS.map((d) => (
          <button key={d.id} className="deck-card" onClick={() => setDeck(d)}>
            <span className="deck-title">{d.title}</span>
            <span className="deck-meta">
              <Pill>{d.pairs.length} Paare</Pill>
              <span className="muted small">{TOPIC_BY_ID[d.topicId]?.label ?? d.topicId}</span>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
