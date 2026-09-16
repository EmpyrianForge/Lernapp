import { useMemo, useState, type ReactNode } from 'react'
import { useAppState } from '../state/AppState'
import { shuffle } from '../lib/scheduler'
import { Pill } from './ui'
import { Icon } from './Icon'
import { Confetti } from './Confetti'
import { useGuide } from './DrillGuide'

// UML/BPMN-Symbol-Zuordnung: gezeichnetes Symbol ↔ Bedeutung, Tap-to-Pair.
// BPMN & UML-Aktivitätsdiagramm sind neu/verstärkt im Katalog 2025 (11-Neu-2025).
// Anwendungsfall-Satz und Klassenbeziehungen ergänzt nach PV1 Tag 1 (UML, 15.09.2026).
// ERM-Sätze (Chen, Krähenfuß) ergänzt nach dem Lückencheck AP1 (16.09.2026).

const S = 40
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2 }
const dashed = { ...stroke, strokeDasharray: '4 3' }

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
  flowFinal: (
    <>
      <circle cx={20} cy={20} r={14} {...stroke} />
      <line x1={10.1} y1={10.1} x2={29.9} y2={29.9} {...stroke} />
      <line x1={29.9} y1={10.1} x2={10.1} y2={29.9} {...stroke} />
    </>
  ),
  objectNode: <rect x={4} y={12} width={32} height={16} {...stroke} />,
  partition: (
    <>
      <rect x={4} y={4} width={32} height={32} {...stroke} />
      <line x1={20} y1={4} x2={20} y2={36} {...stroke} />
      <line x1={4} y1={12} x2={36} y2={12} {...stroke} />
    </>
  ),
  note: <path d="M6,5 H26 L34,13 V35 H6 Z M26,5 V13 H34" {...stroke} />,
  actor: (
    <>
      <circle cx={20} cy={8} r={4.5} {...stroke} />
      <line x1={20} y1={12.5} x2={20} y2={26} {...stroke} />
      <line x1={11} y1={18} x2={29} y2={18} {...stroke} />
      <line x1={20} y1={26} x2={13} y2={37} {...stroke} />
      <line x1={20} y1={26} x2={27} y2={37} {...stroke} />
    </>
  ),
  ellipse: <ellipse cx={20} cy={20} rx={17} ry={10} {...stroke} />,
  boundary: (
    <>
      <rect x={3} y={4} width={34} height={32} {...stroke} />
      <line x1={11} y1={10} x2={29} y2={10} {...stroke} />
    </>
  ),
  line: <line x1={4} y1={20} x2={36} y2={20} {...stroke} />,
  generalization: (
    <>
      <line x1={4} y1={20} x2={25} y2={20} {...stroke} />
      <polygon points="25,13 36,20 25,27" {...stroke} />
    </>
  ),
  dashedArrow: (
    <>
      <line x1={4} y1={20} x2={34} y2={20} {...dashed} />
      <polyline points="27,14 35,20 27,26" {...stroke} />
    </>
  ),
  directedAssoc: (
    <>
      <line x1={4} y1={20} x2={34} y2={20} {...stroke} />
      <polyline points="27,14 35,20 27,26" {...stroke} />
    </>
  ),
  aggregation: (
    <>
      <polygon points="3,20 10,15 17,20 10,25" {...stroke} />
      <line x1={17} y1={20} x2={37} y2={20} {...stroke} />
    </>
  ),
  composition: (
    <>
      <polygon points="3,20 10,15 17,20 10,25" fill="currentColor" stroke="currentColor" strokeWidth={2} />
      <line x1={17} y1={20} x2={37} y2={20} {...stroke} />
    </>
  ),
  realization: (
    <>
      <line x1={4} y1={20} x2={25} y2={20} {...dashed} />
      <polygon points="25,13 36,20 25,27" {...stroke} />
    </>
  ),
  // ERM (16.09.2026): Chen-Notation und Krähenfuß zum Lesen
  ermKeyAttr: <><ellipse cx={20} cy={20} rx={17} ry={10} {...stroke} /><text x={20} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">ID</text><line x1={12} y1={26.5} x2={28} y2={26.5} stroke="currentColor" strokeWidth={1.5} /></>,
  ermCardinality: <><line x1={4} y1={27} x2={36} y2={27} {...stroke} /><text x={8} y={21} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">1</text><text x={32} y={21} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">n</text></>,
  ermRelAttr: <><polygon points="5,28 14,20 23,28 14,36" {...stroke} /><line x1={1} y1={28} x2={5} y2={28} {...stroke} /><line x1={23} y1={28} x2={39} y2={28} {...stroke} /><line x1={14} y1={20} x2={22} y2={14.8} {...stroke} /><ellipse cx={28} cy={10} rx={10} ry={6} {...stroke} /></>,
  ermCfEntity: <><rect x={6} y={4} width={28} height={32} {...stroke} /><line x1={6} y1={13} x2={34} y2={13} {...stroke} /><line x1={10} y1={19} x2={27} y2={19} stroke="currentColor" strokeWidth={1.5} /><line x1={10} y1={25} x2={24} y2={25} stroke="currentColor" strokeWidth={1.5} /><line x1={10} y1={31} x2={28} y2={31} stroke="currentColor" strokeWidth={1.5} /></>,
  ermCfOne: <><line x1={2} y1={20} x2={35} y2={20} {...stroke} /><line x1={22} y1={12} x2={22} y2={28} {...stroke} /><line x1={28} y1={12} x2={28} y2={28} {...stroke} /><path d="M40,5 H35 V35 H40" {...stroke} /></>,
  ermCfZeroOne: <><line x1={2} y1={20} x2={11} y2={20} {...stroke} /><circle cx={16} cy={20} r={5} {...stroke} /><line x1={21} y1={20} x2={35} y2={20} {...stroke} /><line x1={28} y1={12} x2={28} y2={28} {...stroke} /><path d="M40,5 H35 V35 H40" {...stroke} /></>,
  ermCfOneMany: <><line x1={2} y1={20} x2={35} y2={20} {...stroke} /><line x1={18} y1={12} x2={18} y2={28} {...stroke} /><path d="M25,20 L35,12 M25,20 L35,28" {...stroke} /><path d="M40,5 H35 V35 H40" {...stroke} /></>,
  ermCfZeroMany: <><line x1={2} y1={20} x2={9} y2={20} {...stroke} /><circle cx={14} cy={20} r={5} {...stroke} /><line x1={19} y1={20} x2={35} y2={20} {...stroke} /><path d="M25,20 L35,12 M25,20 L35,28" {...stroke} /><path d="M40,5 H35 V35 H40" {...stroke} /></>,
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
  scope?: string // Einordnung außerhalb des AP1-Kerns (Randstoff/AP2) — sichtbar markiert, nicht ausgeblendet
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
      { sym: 'dotRing', meaning: 'Aktivitätsende (beendet die ganze Aktivität)' },
      { sym: 'flowFinal', meaning: 'Ablaufende (beendet nur diesen Pfad)' },
      { sym: 'roundRect', meaning: 'Aktion' },
      { sym: 'diamond', meaning: 'Verzweigung / Zusammenführung' },
      { sym: 'bar', meaning: 'Gabelung / Vereinigung (parallel)' },
      { sym: 'objectNode', meaning: 'Objektknoten (z. B. Rechnung [erstellt])' },
      { sym: 'partition', meaning: 'Partitionen (Swimlanes)' },
      { sym: 'note', meaning: 'Notiz' },
    ],
  },
  {
    id: 'uml-usecase',
    title: 'UML-Anwendungsfalldiagramm',
    pairs: [
      { sym: 'actor', meaning: 'Akteur (Rolle außerhalb des Systems)' },
      { sym: 'ellipse', meaning: 'Anwendungsfall' },
      { sym: 'boundary', meaning: 'Systemgrenze (mit Systemname)' },
      { sym: 'line', meaning: 'Assoziation Akteur – Anwendungsfall' },
      { sym: 'generalization', meaning: 'Generalisierung (Dreieck zeigt auf das Allgemeine)' },
      { sym: 'dashedArrow', meaning: '«include»- oder «extend»-Beziehung' },
    ],
  },
  {
    id: 'uml-klasse',
    title: 'UML-Klassenbeziehungen',
    // Scope-Abgleich 15.09. (PV1 Tag 1 Nachtrag): Assoziation/Aggregation/Komposition = Randstoff,
    // Vererbung/Realisierung = AP2 (Vererbung laut Katalog 2025 aus der AP1 gestrichen).
    scope: 'Randstoff · Vererbung AP2',
    pairs: [
      { sym: 'line', meaning: 'Assoziation' },
      { sym: 'directedAssoc', meaning: 'gerichtete Assoziation (Navigierbarkeit)' },
      { sym: 'aggregation', meaning: 'Aggregation (Teile auch allein existenzfähig)' },
      { sym: 'composition', meaning: 'Komposition (Teile existenzabhängig)' },
      { sym: 'generalization', meaning: 'Vererbung / Generalisierung' },
      { sym: 'realization', meaning: 'Realisierung (Interface implementieren)' },
      { sym: 'dashedArrow', meaning: 'Abhängigkeit (z. B. «create»)' },
    ],
  },
  {
    id: "erm-chen",
    title: "ERM – Chen-Notation",
    pairs: [
      { sym: "objectNode", meaning: "Entitätstyp (z. B. Kunde)" },
      { sym: "ellipse", meaning: "Attribut" },
      { sym: "ermKeyAttr", meaning: "Schlüsselattribut (Primärschlüssel)" },
      { sym: "diamond", meaning: "Beziehung (mit einem Verb beschriftet)" },
      { sym: "line", meaning: "Verbindungslinie (Rechteck zu Raute oder Ellipse)" },
      { sym: "ermCardinality", meaning: "Kardinalität an den Linienenden (hier 1:n)" },
      { sym: "ermRelAttr", meaning: "Beziehungsattribut (z. B. Menge)" },
    ],
  },
  {
    id: "erm-kraehenfuss",
    title: "ERM – Krähenfuß-Notation (lesen)",
    // Scope 16.09.: Chen = Kern, Krähenfuß nur lesen können = Randstoff (17-Lueckencheck, Workflow-Scope).
    scope: "Randstoff",
    pairs: [
      { sym: "ermCfEntity", meaning: "Entitätstyp als Kasten (Name oben, Attribute darunter)" },
      { sym: "line", meaning: "Beziehung (einfache Linie ohne Raute)" },
      { sym: "ermCfOne", meaning: "am Kasten: genau eins" },
      { sym: "ermCfZeroOne", meaning: "am Kasten: keins oder eins (optional)" },
      { sym: "ermCfOneMany", meaning: "am Kasten: eins oder viele (mindestens eins); gezählt wird der Kasten, an dem das Zeichen steht" },
      { sym: "ermCfZeroMany", meaning: "am Kasten: keins oder viele (beliebig viele)" },
    ],
  },
]

function Game({ deck, onExit }: { deck: SymDeck; onExit: () => void }) {
  const { recordDrill } = useAppState()
  const guide = useGuide('symbols')
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
        // ERM-Sätze getrennt zählen, damit die bestehende UML/BPMN-Statistik unverändert bleibt.
        recordDrill(deck.id.startsWith('erm-') ? 'ERM-Symbole' : 'UML/BPMN-Symbole', deck.pairs.length, deck.pairs.length + mistakes)
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
        {acc >= 70 && <Confetti />}
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
        <div className="study-meta"><span className="pill">{deck.title}</span>{guide.button}</div>
        <span className="counter">{matched.size}/{deck.pairs.length}</span>
      </header>
      {guide.panel}
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
        <h2>Diagramm-Symbole (UML, BPMN, ERM)</h2>
      </header>
      <p className="muted small">Wähle einen Satz. Ordne jedes gezeichnete Symbol seiner Bedeutung zu.</p>
      <div className="deck-list">
        {DECKS.map((d) => (
          <button key={d.id} className="deck-card" onClick={() => setDeck(d)}>
            <span className="deck-title">{d.title}</span>
            <span className="deck-meta">
              <Pill>{d.pairs.length} Symbole</Pill>
              {d.scope && <Pill tone="var(--muted-bg)">{d.scope}</Pill>}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
