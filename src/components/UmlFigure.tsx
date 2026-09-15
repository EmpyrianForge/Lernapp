// Musterlösungs-Diagramme für die UML-Prüfungsaufgaben (data/exam-uml.ts) als inline-SVG.
// Alle Linien/Texte nutzen currentColor → funktionieren im hellen und dunklen Theme.
// Aufruf über die ID aus ExamPart.figure; unbekannte IDs rendern nichts.

const T = { fontSize: 11, fill: 'currentColor', textAnchor: 'middle' as const, dominantBaseline: 'middle' as const }
const SMALL = { ...T, fontSize: 9.5 }
const LINE = { stroke: 'currentColor', strokeWidth: 1.4, fill: 'none' }
const DASH = { ...LINE, strokeDasharray: '5 4' }
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

/** Pfeilspitzen je Diagramm mit eigenem Präfix (IDs müssen im Dokument eindeutig sein). */
function Markers({ p }: { p: string }) {
  return (
    <defs>
      <marker id={`${p}-open`} viewBox="0 0 10 10" refX="9.5" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto">
        <path d="M0,0.5 L10,5 L0,9.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </marker>
      <marker id={`${p}-tri`} viewBox="0 0 12 12" refX="11.5" refY="6" markerWidth="13" markerHeight="13" markerUnits="userSpaceOnUse" orient="auto">
        <path d="M0,0.5 L12,6 L0,11.5 Z" stroke="currentColor" strokeWidth="1.2" style={{ fill: 'var(--panel-2)' }} />
      </marker>
    </defs>
  )
}

function Actor({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <circle cx={x} cy={y - 22} r={7} {...LINE} />
      <line x1={x} y1={y - 15} x2={x} y2={y + 5} {...LINE} />
      <line x1={x - 12} y1={y - 8} x2={x + 12} y2={y - 8} {...LINE} />
      <line x1={x} y1={y + 5} x2={x - 10} y2={y + 22} {...LINE} />
      <line x1={x} y1={y + 5} x2={x + 10} y2={y + 22} {...LINE} />
      <text x={x} y={y + 36} {...T}>{label}</text>
    </g>
  )
}

function UseCase({ x, y, label, ep }: { x: number; y: number; label: string; ep?: string }) {
  if (!ep) {
    return (
      <g>
        <ellipse cx={x} cy={y} rx={72} ry={19} {...LINE} />
        <text x={x} y={y} {...T}>{label}</text>
      </g>
    )
  }
  // Basisfall mit Erweiterungspunkt: Name oben, Trennstrich, extension point darunter.
  return (
    <g>
      <ellipse cx={x} cy={y} rx={72} ry={30} {...LINE} />
      <text x={x} y={y - 14} {...T}>{label}</text>
      <line x1={x - 71} y1={y - 4} x2={x + 71} y2={y - 4} {...LINE} />
      <text x={x} y={y + 6} {...SMALL}>extension points:</text>
      <text x={x} y={y + 20} {...SMALL}>{ep}</text>
    </g>
  )
}

function UseCaseBibliothek() {
  const p = 'uc'
  return (
    <svg viewBox="0 0 660 400" role="img" aria-label="Musterlösung: Anwendungsfalldiagramm Ausleihsystem Stadtbibliothek">
      <Markers p={p} />
      <rect x={150} y={12} width={390} height={380} {...LINE} />
      <text x={345} y={30} {...T} fontWeight={700}>Ausleihsystem Stadtbibliothek</text>

      <UseCase x={250} y={72} label="Katalog durchsuchen" />
      <UseCase x={250} y={132} label="Medium ausleihen" />
      <UseCase x={250} y={192} label="Ausleihe verlängern" />
      <UseCase x={450} y={162} label="Leserausweis prüfen" />
      <UseCase x={250} y={262} label="Medium zurückgeben" ep="Fristprüfung" />
      <UseCase x={450} y={322} label="Mahngebühr berechnen" />
      <UseCase x={250} y={352} label="Medienbestand pflegen" />

      <Actor x={70} y={130} label="Leser" />
      <Actor x={70} y={320} label="Bibliothekar" />
      <Actor x={605} y={322} label="Bezahlsystem" />

      {/* Generalisierung: Bibliothekar erbt alle Anwendungsfälle des Lesers */}
      <line x1={70} y1={289} x2={70} y2={176} {...LINE} markerEnd={`url(#${p}-tri)`} />

      {/* Assoziationen */}
      <line x1={84} y1={120} x2={179} y2={76} {...LINE} />
      <line x1={84} y1={122} x2={178} y2={132} {...LINE} />
      <line x1={84} y1={124} x2={179} y2={188} {...LINE} />
      <line x1={84} y1={126} x2={179} y2={256} {...LINE} />
      <line x1={84} y1={312} x2={180} y2={350} {...LINE} />
      <line x1={522} y1={322} x2={591} y2={314} {...LINE} />

      {/* «include»: Basisfall → eingebundener Fall */}
      <line x1={322} y1={132} x2={383} y2={156} {...DASH} markerEnd={`url(#${p}-open)`} />
      <text x={344} y={129} {...SMALL}>«include»</text>
      <line x1={322} y1={192} x2={383} y2={168} {...DASH} markerEnd={`url(#${p}-open)`} />
      <text x={346} y={199} {...SMALL}>«include»</text>

      {/* «extend»: erweiternder Fall → Basisfall */}
      <line x1={390} y1={311} x2={319} y2={273} {...DASH} markerEnd={`url(#${p}-open)`} />
      <text x={332} y={305} {...SMALL}>«extend»</text>
      {/* Bedingung als Notiz am «extend»-Pfeil (der Erweiterungspunkt benennt nur die Stelle) */}
      <path d="M398,232 H526 L534,240 V266 H398 Z M526,232 V240 H534" {...LINE} />
      <text x={466} y={244} {...SMALL}>condition:</text>
      <text x={466} y={257} {...SMALL}>{'{Leihfrist überschritten}'}</text>
      <line x1={400} y1={266} x2={356} y2={291} {...LINE} strokeDasharray="2 3" />

    </svg>
  )
}

function Action({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 16} width={w} height={32} rx={12} {...LINE} />
      <text x={x} y={y} {...T} fontSize={10.5}>{label}</text>
    </g>
  )
}

function Diamond({ x, y }: { x: number; y: number }) {
  return <polygon points={`${x},${y - 12} ${x + 12},${y} ${x},${y + 12} ${x - 12},${y}`} {...LINE} />
}

function Bar({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return <rect x={x1} y={y - 3} width={x2 - x1} height={6} fill="currentColor" />
}

function AktivitaetStoerungsticket() {
  const p = 'act'
  const flow = (d: string) => <path d={d} {...LINE} markerEnd={`url(#${p}-open)`} />
  return (
    <svg viewBox="0 0 500 685" style={{ maxWidth: 520 }} role="img" aria-label="Musterlösung: Aktivitätsdiagramm Störungsticket">
      <Markers p={p} />
      <circle cx={200} cy={22} r={7} fill="currentColor" />
      {flow('M200,29 V49')}
      <Action x={200} y={65} w={180} label="Störungsmeldung erfassen" />
      {flow('M200,81 V103')}
      <Diamond x={200} y={115} />
      {flow('M200,127 V144')}
      <Action x={200} y={160} w={180} label="Wissensdatenbank prüfen" />
      {flow('M200,176 V198')}
      <Diamond x={200} y={210} />

      {flow('M188,210 H100 V249')}
      <text x={134} y={200} {...SMALL}>[Lösung bekannt]</text>
      <Action x={100} y={265} w={160} label="Bekannte Lösung anwenden" />

      {flow('M212,210 H320 V249')}
      <text x={262} y={200} {...SMALL}>[sonst]</text>
      <Action x={320} y={265} w={180} label="An 2nd-Level weiterleiten" />
      {flow('M320,281 V304')}
      <Action x={320} y={320} w={180} label="Störung analysieren und beheben" />

      {flow('M100,281 V375 H188')}
      {flow('M320,336 V375 H212')}
      <Diamond x={200} y={375} />
      {flow('M200,387 V404')}
      <Action x={200} y={420} w={180} label="Behebung testen" />
      {flow('M200,436 V458')}
      <Diamond x={200} y={470} />

      {/* Rücksprung über die erste Zusammenführung */}
      {flow('M212,470 H460 V115 H212')}
      <text x={318} y={460} {...SMALL}>[nicht behoben]</text>

      {flow('M200,482 V517')}
      <text x={208} y={500} {...SMALL} textAnchor="start">[behoben]</text>
      <Bar x1={90} x2={330} y={520} />
      {flow('M140,523 V559')}
      {flow('M285,523 V559')}
      <Action x={140} y={575} w={120} label="Ticket schließen" />
      <Action x={285} y={575} w={150} label="Lösung dokumentieren" />
      {flow('M140,591 V617')}
      {flow('M285,591 V617')}
      <Bar x1={90} x2={330} y={620} />
      {flow('M200,623 V651')}
      <circle cx={200} cy={662} r={11} {...LINE} />
      <circle cx={200} cy={662} r={6.5} fill="currentColor" />
    </svg>
  )
}

function KlasseTicket() {
  const member = (y: number, text: string) => (
    <text x={30} y={y} fontSize={11} fontFamily={MONO} fill="currentColor" dominantBaseline="middle">{text}</text>
  )
  return (
    <svg viewBox="0 0 360 196" style={{ maxWidth: 480 }} role="img" aria-label="Musterlösung: Klassendiagramm Ticket">
      <rect x={20} y={8} width={320} height={180} {...LINE} />
      <text x={180} y={25} {...T} fontSize={12} fontWeight={700}>Ticket</text>
      <line x1={20} y1={42} x2={340} y2={42} {...LINE} />
      {member(58, '- ticketNr : int')}
      {member(73, '- titel : String')}
      {member(88, '- prioritaet : int')}
      {member(103, '- status : String')}
      <line x1={20} y1={116} x2={340} y2={116} {...LINE} />
      {member(132, '+ Ticket(titel : String, prioritaet : int)')}
      {member(147, '+ getStatus() : String')}
      {member(162, '+ schliessen() : void')}
      {member(177, '- pruefePrioritaet(p : int) : boolean')}
    </svg>
  )
}

const FIGURES: Record<string, () => JSX.Element> = {
  'uc-bibliothek': UseCaseBibliothek,
  'act-stoerungsticket': AktivitaetStoerungsticket,
  'class-ticket': KlasseTicket,
}

export function UmlFigure({ id }: { id: string }) {
  const Figure = FIGURES[id]
  if (!Figure) return null
  return (
    <figure className="uml-figure">
      <Figure />
    </figure>
  )
}
