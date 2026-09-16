// Musterlösungs-Diagramme für die ERM-Prüfungsaufgaben (data/exam-erm.ts) als inline-SVG.
// ERM in Chen-Notation: Entitätstyp = Rechteck, Beziehung = Raute mit Verb, Attribut = Ellipse,
// Primärschlüssel unterstrichen, Kardinalitäten 1/n/m als kleine Texte am Linienende beim Entitätstyp,
// von dem es 1 bzw. viele gibt („1 Kunde – n Fahrräder“: n steht am Fahrrad). Keine Fremdschlüssel im ERM.
// Tabellenmodell: Kasten je Tabelle, PK unterstrichen und mit „PK“ markiert, FK mit „FK“, Beziehungslinien
// verbinden Primär- und Fremdschlüsselzeile (1 am PK, n am FK); Datentypen klein und blass = [RAND].
// Alle Linien/Texte nutzen currentColor → funktionieren im hellen und dunklen Theme. Keine <defs>/IDs nötig,
// daher keine Kollision mit components/UmlFigure.tsx. Aufruf über die ID aus ExamPart.figure (Präfix „erm-“):
// UmlFigure schlägt unbekannte IDs hier nach (ErmFigure importiert nichts aus UmlFigure, also kein Zyklus).

const T = { fontSize: 11, fill: 'currentColor', textAnchor: 'middle' as const, dominantBaseline: 'middle' as const }
const SMALL = { ...T, fontSize: 9.5 }
const LINE = { stroke: 'currentColor', strokeWidth: 1.4, fill: 'none' }
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
const CARD = { ...T, fontSize: 11, fontWeight: 700 }

// ---------------------------------------------------------------------------------------------
// ERM (Chen)
// ---------------------------------------------------------------------------------------------

type Kind = 'ent' | 'rel' | 'att'

interface ErmNode {
  id: string
  kind: Kind
  x: number // Mittelpunkt
  y: number
  label: string
  pk?: boolean
}

/** Kante: a = Entitätstyp (bzw. Beziehung bei Attributen), b = Beziehung (bzw. Attribut). card steht am Ende a. */
interface ErmEdge {
  a: string
  b: string
  card?: string
}

const ENT_W = 100
const ENT_H = 34
const REL_HW = 50 // halbe Breite der Raute
const REL_HH = 22 // halbe Höhe der Raute
const ATT_RY = 13
/** Ellipsenradius aus der Textlänge (~6,5 px je Zeichen bei fontSize 11, plus Rand). */
const attRx = (label: string) => Math.max(30, label.length * 3.25 + 12)

/** Faktor t, mit dem Mitte + t·(dx, dy) genau auf dem Rand der Form liegt. */
function edgeFactor(n: ErmNode, dx: number, dy: number): number {
  const ax = Math.abs(dx)
  const ay = Math.abs(dy)
  if (n.kind === 'ent') return Math.min(ax ? ENT_W / 2 / ax : Infinity, ay ? ENT_H / 2 / ay : Infinity)
  if (n.kind === 'rel') return 1 / (ax / REL_HW + ay / REL_HH)
  return 1 / Math.sqrt((dx / attRx(n.label)) ** 2 + (dy / ATT_RY) ** 2)
}

function Shape({ n }: { n: ErmNode }) {
  if (n.kind === 'ent') {
    return (
      <g>
        <rect x={n.x - ENT_W / 2} y={n.y - ENT_H / 2} width={ENT_W} height={ENT_H} {...LINE} />
        <text x={n.x} y={n.y} {...T} fontSize={12} fontWeight={700}>{n.label}</text>
      </g>
    )
  }
  if (n.kind === 'rel') {
    const pts = `${n.x},${n.y - REL_HH} ${n.x + REL_HW},${n.y} ${n.x},${n.y + REL_HH} ${n.x - REL_HW},${n.y}`
    return (
      <g>
        <polygon points={pts} {...LINE} />
        <text x={n.x} y={n.y} {...T}>{n.label}</text>
      </g>
    )
  }
  return (
    <g>
      <ellipse cx={n.x} cy={n.y} rx={attRx(n.label)} ry={ATT_RY} {...LINE} />
      <text x={n.x} y={n.y} {...T} textDecoration={n.pk ? 'underline' : undefined}>{n.label}</text>
    </g>
  )
}

/** Linie von Rand zu Rand; Kardinalität 11 px vom Rand entfernt, bei waagerechten Linien darüber, sonst rechts daneben. */
function Link({ a, b, card }: { a: ErmNode; b: ErmNode; card?: string }) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const ta = edgeFactor(a, dx, dy)
  const tb = edgeFactor(b, -dx, -dy)
  const x1 = a.x + ta * dx
  const y1 = a.y + ta * dy
  const x2 = b.x - tb * dx
  const y2 = b.y - tb * dy
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  const horizontal = Math.abs(ux) >= Math.abs(uy)
  const cx = x1 + ux * 11 + (horizontal ? 0 : 10)
  const cy = y1 + uy * 11 + (horizontal ? -10 : 0)
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} {...LINE} />
      {card && <text x={cx} y={cy} {...CARD}>{card}</text>}
    </g>
  )
}

function Chen({ nodes, edges }: { nodes: ErmNode[]; edges: ErmEdge[] }) {
  const byId = new Map(nodes.map((n) => [n.id, n] as const))
  return (
    <g>
      {edges.map((e) => {
        const a = byId.get(e.a)
        const b = byId.get(e.b)
        return a && b ? <Link key={`${e.a}-${e.b}`} a={a} b={b} card={e.card} /> : null
      })}
      {nodes.map((n) => <Shape key={n.id} n={n} />)}
    </g>
  )
}

const ent = (id: string, x: number, y: number, label: string): ErmNode => ({ id, kind: 'ent', x, y, label })
const rel = (id: string, x: number, y: number, label: string): ErmNode => ({ id, kind: 'rel', x, y, label })
const att = (id: string, x: number, y: number, label: string, pk?: boolean): ErmNode => ({ id, kind: 'att', x, y, label, pk })

function Legend({ x, y }: { x: number; y: number }) {
  return (
    <text x={x} y={y} {...SMALL}>
      Rechteck = Entitätstyp · Raute = Beziehung · Ellipse = Attribut · <tspan textDecoration="underline">unterstrichen</tspan> = Primärschlüssel
    </text>
  )
}

/** Aufgabe 1: vollständiges ERM der Fahrradwerkstatt (Vorgabe + Ergänzungen aus a bis c). */
function ErmFahrradwerkstatt() {
  const nodes: ErmNode[] = [
    ent('kunde', 130, 80, 'Kunde'),
    ent('fahrrad', 130, 260, 'Fahrrad'),
    ent('auftrag', 430, 260, 'Auftrag'),
    ent('mech', 430, 80, 'Mechaniker'),
    ent('teil', 430, 480, 'Ersatzteil'),
    rel('besitzt', 130, 170, 'besitzt'),
    rel('betrifft', 280, 260, 'betrifft'),
    rel('bearbeitet', 430, 170, 'bearbeitet'),
    rel('verbaut', 430, 370, 'verbaut'),
    att('kNr', 50, 22, 'Kundennr', true),
    att('kName', 130, 22, 'Name'),
    att('kTel', 210, 22, 'Telefon'),
    att('mNr', 375, 22, 'Personalnr', true),
    att('mName', 490, 22, 'Name'),
    att('fNr', 55, 335, 'Rahmennr', true),
    att('fMarke', 130, 365, 'Marke'),
    att('fTyp', 205, 335, 'Typ'),
    att('aNr', 585, 212, 'Auftragsnr', true),
    att('aDat', 600, 260, 'Annahmedatum'),
    att('aFehler', 585, 308, 'Fehlerbild'),
    att('menge', 560, 370, 'Menge'),
    att('tNr', 290, 480, 'Artikelnr', true),
    att('tBez', 580, 458, 'Bezeichnung'),
    att('tPreis', 570, 505, 'Preis'),
  ]
  const edges: ErmEdge[] = [
    { a: 'kunde', b: 'besitzt', card: '1' },
    { a: 'fahrrad', b: 'besitzt', card: 'n' },
    { a: 'fahrrad', b: 'betrifft', card: '1' },
    { a: 'auftrag', b: 'betrifft', card: 'n' },
    { a: 'mech', b: 'bearbeitet', card: '1' },
    { a: 'auftrag', b: 'bearbeitet', card: 'n' },
    { a: 'auftrag', b: 'verbaut', card: 'n' },
    { a: 'teil', b: 'verbaut', card: 'm' },
    { a: 'kunde', b: 'kNr' },
    { a: 'kunde', b: 'kName' },
    { a: 'kunde', b: 'kTel' },
    { a: 'mech', b: 'mNr' },
    { a: 'mech', b: 'mName' },
    { a: 'fahrrad', b: 'fNr' },
    { a: 'fahrrad', b: 'fMarke' },
    { a: 'fahrrad', b: 'fTyp' },
    { a: 'auftrag', b: 'aNr' },
    { a: 'auftrag', b: 'aDat' },
    { a: 'auftrag', b: 'aFehler' },
    { a: 'verbaut', b: 'menge' },
    { a: 'teil', b: 'tNr' },
    { a: 'teil', b: 'tBez' },
    { a: 'teil', b: 'tPreis' },
  ]
  return (
    <svg viewBox="0 0 660 562" style={{ maxWidth: 640 }} role="img" aria-label="Musterlösung: ERM der Fahrradwerkstatt mit Kunde, Fahrrad, Auftrag, Mechaniker und Ersatzteil">
      <Chen nodes={nodes} edges={edges} />
      <Legend x={330} y={548} />
    </svg>
  )
}

/** Aufgabe 2a: ERM des Schulungsanbieters. */
function ErmSchulung() {
  const nodes: ErmNode[] = [
    ent('dozent', 70, 105, 'Dozent'),
    ent('kurs', 350, 105, 'Kurs'),
    ent('teiln', 630, 105, 'Teilnehmer'),
    rel('leitet', 210, 105, 'leitet'),
    rel('bucht', 490, 105, 'bucht'),
    att('dNr', 45, 25, 'DozentNr', true),
    att('dName', 130, 25, 'Name'),
    att('dFach', 70, 185, 'Fachgebiet'),
    att('kNr', 300, 25, 'KursNr', true),
    att('kTitel', 395, 25, 'Titel'),
    att('kStart', 300, 185, 'Startdatum'),
    att('kPreis', 395, 185, 'Preis'),
    att('bDatum', 490, 25, 'Buchungsdatum'),
    att('bBezahlt', 490, 185, 'bezahlt'),
    att('tNr', 640, 25, 'TeilnehmerNr', true),
    att('tName', 590, 185, 'Name'),
    att('tMail', 680, 185, 'Email'),
  ]
  const edges: ErmEdge[] = [
    { a: 'dozent', b: 'leitet', card: '1' },
    { a: 'kurs', b: 'leitet', card: 'n' },
    { a: 'kurs', b: 'bucht', card: 'n' },
    { a: 'teiln', b: 'bucht', card: 'm' },
    { a: 'dozent', b: 'dNr' },
    { a: 'dozent', b: 'dName' },
    { a: 'dozent', b: 'dFach' },
    { a: 'kurs', b: 'kNr' },
    { a: 'kurs', b: 'kTitel' },
    { a: 'kurs', b: 'kStart' },
    { a: 'kurs', b: 'kPreis' },
    { a: 'bucht', b: 'bDatum' },
    { a: 'bucht', b: 'bBezahlt' },
    { a: 'teiln', b: 'tNr' },
    { a: 'teiln', b: 'tName' },
    { a: 'teiln', b: 'tMail' },
  ]
  return (
    <svg viewBox="0 0 720 237" style={{ maxWidth: 700 }} role="img" aria-label="Musterlösung: ERM des Schulungsanbieters mit Dozent, Kurs und Teilnehmer">
      <Chen nodes={nodes} edges={edges} />
      <Legend x={360} y={225} />
    </svg>
  )
}

// ---------------------------------------------------------------------------------------------
// Tabellenmodell
// ---------------------------------------------------------------------------------------------

type KeyTag = 'PK' | 'FK' | 'PK, FK'

interface Col {
  name: string
  key?: KeyTag
  type?: string
}

const HEAD = 28
const TROW = 16
/** Mittellinie der Spaltenzeile i in einem Kasten, der bei y beginnt. */
const rowY = (y: number, i: number) => y + HEAD + 14 + TROW * i
const tableHeight = (n: number) => HEAD + n * TROW + 12

/** Tabellenkasten: Name oben, darunter je Spalte Schlüsselkennung, Spaltenname (PK unterstrichen), ggf. Datentyp. */
function TableBox({ x, y, w, name, cols }: { x: number; y: number; w: number; name: string; cols: Col[] }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={tableHeight(cols.length)} {...LINE} />
      <text x={x + w / 2} y={y + HEAD / 2} {...T} fontSize={12} fontWeight={700}>{name}</text>
      <line x1={x} y1={y + HEAD} x2={x + w} y2={y + HEAD} {...LINE} />
      {cols.map((c, i) => (
        <g key={c.name}>
          {c.key && <text x={x + 8} y={rowY(y, i)} {...SMALL} textAnchor="start" fontWeight={700}>{c.key}</text>}
          <text
            x={x + 50} y={rowY(y, i)} fontSize={11} fontFamily={MONO} fill="currentColor" dominantBaseline="middle"
            textDecoration={c.key === 'PK' || c.key === 'PK, FK' ? 'underline' : undefined}
          >
            {c.name}
          </text>
          {c.type && <text x={x + w - 8} y={rowY(y, i)} {...SMALL} textAnchor="end" fontFamily={MONO} opacity={0.7}>{c.type}</text>}
        </g>
      ))}
    </g>
  )
}

/** Winkelverbindung zwischen zwei Zeilen; c1 steht am Start (PK-Seite), c2 am Ende (FK-Seite). */
function RowLink({ x1, y1, xm, x2, y2, c1, c2 }: { x1: number; y1: number; xm: number; x2: number; y2: number; c1: string; c2: string }) {
  const s1 = x1 < xm ? 1 : -1 // Richtung, in die die Linie den Startkasten verlässt
  const s2 = x2 < xm ? 1 : -1 // Richtung, aus der sie in den Zielkasten läuft
  return (
    <g>
      <path d={`M${x1},${y1} H${xm} V${y2} H${x2}`} {...LINE} />
      <text x={x1 + s1 * 7} y={y1 - 8} {...CARD} textAnchor={s1 > 0 ? 'start' : 'end'}>{c1}</text>
      <text x={x2 + s2 * 7} y={y2 - 8} {...CARD} textAnchor={s2 > 0 ? 'start' : 'end'}>{c2}</text>
    </g>
  )
}

/** Aufgabe 2b: Tabellenmodell des Schulungsanbieters (mit Datentypen als [RAND]). */
function TabellenSchulung() {
  const L = 20 // linke Spalte
  const R = 320 // rechte Spalte
  const W = 200
  const TOP = 20
  const BOTTOM = 200
  return (
    <svg viewBox="0 0 560 334" style={{ maxWidth: 580 }} role="img" aria-label="Musterlösung: Tabellenmodell Dozent, Kurs, Teilnehmer und Buchung">
      <TableBox
        x={L} y={TOP} w={W} name="Dozent"
        cols={[
          { name: 'DozentNr', key: 'PK', type: 'INTEGER' },
          { name: 'Name', type: 'VARCHAR' },
          { name: 'Fachgebiet', type: 'VARCHAR' },
        ]}
      />
      <TableBox
        x={R} y={TOP} w={W} name="Kurs"
        cols={[
          { name: 'KursNr', key: 'PK', type: 'INTEGER' },
          { name: 'Titel', type: 'VARCHAR' },
          { name: 'Startdatum', type: 'DATE' },
          { name: 'Preis', type: 'DECIMAL' },
          { name: 'DozentNr', key: 'FK', type: 'INTEGER' },
        ]}
      />
      <TableBox
        x={L} y={BOTTOM} w={W} name="Teilnehmer"
        cols={[
          { name: 'TeilnehmerNr', key: 'PK', type: 'INTEGER' },
          { name: 'Name', type: 'VARCHAR' },
          { name: 'Email', type: 'VARCHAR' },
        ]}
      />
      <TableBox
        x={R} y={BOTTOM} w={W} name="Buchung"
        cols={[
          { name: 'KursNr', key: 'PK, FK', type: 'INTEGER' },
          { name: 'TeilnehmerNr', key: 'PK, FK', type: 'INTEGER' },
          { name: 'Buchungsdatum', type: 'DATE' },
          { name: 'bezahlt', type: 'BOOLEAN' },
        ]}
      />
      {/* Dozent.DozentNr (1) → Kurs.DozentNr (n) */}
      <RowLink x1={L + W} y1={rowY(TOP, 0)} xm={270} x2={R} y2={rowY(TOP, 4)} c1="1" c2="n" />
      {/* Kurs.KursNr (1) → Buchung.KursNr (n), außen rechts herum */}
      <RowLink x1={R + W} y1={rowY(TOP, 0)} xm={545} x2={R + W} y2={rowY(BOTTOM, 0)} c1="1" c2="n" />
      {/* Teilnehmer.TeilnehmerNr (1) → Buchung.TeilnehmerNr (n) */}
      <RowLink x1={L + W} y1={rowY(BOTTOM, 0)} xm={270} x2={R} y2={rowY(BOTTOM, 1)} c1="1" c2="n" />
      <text x={280} y={322} {...SMALL}>PK = Primärschlüssel (unterstrichen) · FK = Fremdschlüssel · Datentypen [RAND]</text>
    </svg>
  )
}

/** Aufgabe 3d: Tabellenmodell des Werkzeugverleihs nach dem Aufteilen der Liste. */
function TabellenWerkzeugverleih() {
  const W = 150
  const Y = 20
  const K = 20 // Kunde
  const A = 240 // Ausleihe
  const WZ = 460 // Werkzeug
  return (
    <svg viewBox="0 0 630 160" style={{ maxWidth: 640 }} role="img" aria-label="Musterlösung: Tabellenmodell Kunde, Ausleihe und Werkzeug">
      <TableBox
        x={K} y={Y} w={W} name="Kunde"
        cols={[{ name: 'KundenNr', key: 'PK' }, { name: 'Name' }, { name: 'Email' }]}
      />
      <TableBox
        x={A} y={Y} w={W} name="Ausleihe"
        cols={[{ name: 'AusleihNr', key: 'PK' }, { name: 'Datum' }, { name: 'KundenNr', key: 'FK' }, { name: 'InventarNr', key: 'FK' }]}
      />
      <TableBox
        x={WZ} y={Y} w={W} name="Werkzeug"
        cols={[{ name: 'InventarNr', key: 'PK' }, { name: 'Bezeichnung' }, { name: 'Tagespreis' }]}
      />
      {/* Kunde.KundenNr (1) → Ausleihe.KundenNr (n) */}
      <RowLink x1={K + W} y1={rowY(Y, 0)} xm={205} x2={A} y2={rowY(Y, 2)} c1="1" c2="n" />
      {/* Werkzeug.InventarNr (1) → Ausleihe.InventarNr (n) */}
      <RowLink x1={WZ} y1={rowY(Y, 0)} xm={425} x2={A + W} y2={rowY(Y, 3)} c1="1" c2="n" />
      <text x={315} y={148} {...SMALL}>PK = Primärschlüssel (unterstrichen) · FK = Fremdschlüssel · 1 am PK, n am FK</text>
    </svg>
  )
}

export const ERM_FIGURES: Record<string, () => JSX.Element> = {
  'erm-fahrradwerkstatt': ErmFahrradwerkstatt,
  'erm-schulung': ErmSchulung,
  'erm-schulung-tabellen': TabellenSchulung,
  'erm-werkzeugverleih-tabellen': TabellenWerkzeugverleih,
}
