import { useMemo, useState, type ReactNode } from 'react'
import { useAppState } from '../state/AppState'
import { shuffle } from '../lib/scheduler'
import { Pill } from './ui'
import { Icon } from './Icon'

// UML/BPMN-Symbol-Zuordnung: gezeichnetes Symbol ↔ Bedeutung, Tap-to-Pair.
// BPMN & UML-Aktivitätsdiagramm sind neu/verstärkt im Katalog 2025 (11-Neu-2025).

const S = 40
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 }

const SYMBOLS: Record<string, ReactNode> = {
  circleThin: <circle cx={20} cy={20} r={13} {...stroke} />,
  roundRect: <rect x={3} y={11} width={34} height={18} rx={8} {...stroke} />,
  diamond: <polygon points="20,4 36,20 20,36 4,20" {...stroke} />,
  arrow: (
    <>
      <line x1={5} y1={20} x2={31} y2={20} stroke="currentColor" strokeWidth={2} />
      <polyline points="26,14 34,20 26,26" fill="none" stroke="currentColor" strokeWidth={2} />
    </>
  ),
  dotFilled: <circle cx={20} cy={20} r={11} fill="currentColor" />,
  dotRing: (
    <>
      <circle cx={20} cy={20} r={15} {...stroke} />
      <circle cx={20} cy={20} r={8} fill="currentColor" />
    </>
  ),
  bar: <rect x={6} y={17} width={28} height={6} fill="currentColor" />,
}

function Sym({ id }: { id: string }) {
  return (
    <svg viewBox={`0 0 ${S} ${S}`} width={44} height={44} aria-hidden="true">
      {SYMBOLS[id]}
    </svg>
  )
}

interface SymDeck {
  id: string
  title: string
  pairs: { sym: string; meaning: string }[]
}

const DECKS: SymDeck[] = [
  {
    id: 'bpmn',
    title: 'BPMN-Grundelemente',
    pairs: [
      { sym: 'circleThin', meaning: 'Ereignis (Start / Zwischen / Ende)' },
      { sym: 'roundRect', meaning: 'Aktivität / Task' },
      { sym: 'diamond', meaning: 'Gateway (Verzweigung)' },
      { sym: 'arrow', meaning: 'Sequenzfluss' },
    ],
  },
  {
    id: 'uml-akt',
    title: 'UML-Aktivitätsdiagramm',
    pairs: [
      { sym: 'dotFilled', meaning: 'Startknoten' },
      { sym: 'dotRing', meaning: 'Endknoten' },
      { sym: 'roundRect', meaning: 'Aktion' },
      { sym: 'diamond', meaning: 'Entscheidung / Zusammenführung' },
      { sym: 'bar', meaning: 'Fork / Join (Parallelisierung)' },
    ],
  },
]

function Game({ deck, onExit }: { deck: SymDeck; onExit: () => void }) {
  const { recordDrill } = useAppState()
  const rights = useMemo(() => shuffle(deck.pairs.map((p, li) => ({ meaning: p.meaning, li }))), [deck])
  const [selLeft, setSelLeft] = useState<number | null>(null)
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [wrong, setWrong] = useState<number | null>(null)
  const [mistakes, setMistakes] = useState(0)

  const done = matched.size === deck.pairs.length

  const clickRight = (li: number, meaning: string) => {
    if (selLeft === null || matched.has(li)) return
    if (deck.pairs[selLeft].meaning === meaning) {
      const newSize = matched.size + 1
      setMatched((m) => new Set(m).add(selLeft))
      setSelLeft(null)
      if (newSize === deck.pairs.length) {
        recordDrill('UML/BPMN-Symbole', deck.pairs.length, deck.pairs.length + mistakes)
      }
    } else {
      setMistakes((n) => n + 1)
      setWrong(li)
      window.setTimeout(() => setWrong(null), 500)
    }
  }

  if (done) {
    const acc = Math.round((deck.pairs.length / (deck.pairs.length + mistakes)) * 100)
    return (
      <section className="panel center">
        <h2><Icon name="check" size={20} className="done-ico" /> Geschafft</h2>
        <p className="big">{deck.pairs.length} Symbole · {mistakes} Fehlversuche</p>
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
      <p className="muted small">Erst ein Symbol antippen, dann die passende Bedeutung. Fehlversuche: {mistakes}</p>

      <div className="match-cols">
        <div className="match-col sym-col">
          {deck.pairs.map((p, i) => (
            <button
              key={i}
              className={`match-item sym-item ${matched.has(i) ? 'done' : ''} ${selLeft === i ? 'sel' : ''}`}
              disabled={matched.has(i)}
              aria-pressed={selLeft === i}
              aria-label={`Symbol ${i + 1}`}
              onClick={() => setSelLeft(i)}
            >
              <Sym id={p.sym} />
            </button>
          ))}
        </div>
        <div className="match-col">
          {rights.map(({ meaning, li }) => (
            <button
              key={li}
              className={`match-item ${matched.has(li) ? 'done' : ''} ${wrong === li ? 'wrong' : ''}`}
              disabled={matched.has(li)}
              onClick={() => clickRight(li, meaning)}
            >
              {meaning}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export function SymbolDrill({ onExit }: { onExit: () => void }) {
  const [deck, setDeck] = useState<SymDeck | null>(null)
  if (deck) return <Game deck={deck} onExit={() => setDeck(null)} />

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>UML / BPMN-Symbole</h2>
      </header>
      <p className="muted small">Wähle einen Satz. Ordne jedes gezeichnete Symbol seiner Bedeutung zu.</p>
      <div className="deck-list">
        {DECKS.map((d) => (
          <button key={d.id} className="deck-card" onClick={() => setDeck(d)}>
            <span className="deck-title">{d.title}</span>
            <span className="deck-meta">
              <Pill>{d.pairs.length} Symbole</Pill>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
