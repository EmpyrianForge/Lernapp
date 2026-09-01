// Strukturierte Verkabelung: Streckenberechnung (Permanent Link / Channel) und
// Medienwahl. Normbezug EN 50173 / ISO IEC 11801:
//   Channel        = gesamte Strecke Aktivkomponente -> Endgerät, max. 100 m
//   Permanent Link = fest verlegtes Installationskabel (Massivleiter), max. 90 m
// Die Differenz steht für Rangier- und Anschlusskabel (Litze, höhere Dämpfung).

export const MAX_PERMANENT_LINK = 90
export const MAX_CHANNEL = 100

export interface Segment {
  label: string
  m: number
}

export type Medium = 'cat6a' | 'om4' | 'os2'

export interface MediumOption {
  key: Medium
  label: string
  kurz: string
}

export const MEDIA: MediumOption[] = [
  { key: 'cat6a', label: 'Twisted Pair Cat 6A (Kupfer)', kurz: 'Cat 6A' },
  { key: 'om4', label: 'Lichtwellenleiter Multimode OM4', kurz: 'OM4' },
  { key: 'os2', label: 'Lichtwellenleiter Singlemode OS2', kurz: 'OS2' },
]

export interface MediumCase {
  text: string
  distanceM: number
  correct: Medium
  begruendung: string
}

export interface CablingTask {
  ort: string
  segments: Segment[]
  zuschlagPct: number
  patchVerteiler: number
  patchArbeitsplatz: number
  /** fest verlegte Länge inkl. Verlegezuschlag, auf 2 Nachkommastellen gerundet */
  permanentLink: number
  /** Permanent Link + beide Rangierkabel */
  channel: number
  linkOk: boolean
  channelOk: boolean
  medium: MediumCase
}

const round2 = (n: number) => Math.round(n * 100) / 100
const rnd = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1))
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const ORTE = ['Bürogebäude', 'Verwaltungsgebäude', 'Schulungszentrum', 'Praxisgebäude', 'Lagerverwaltung']

/**
 * Medienwahl-Fälle. Die Regel dahinter:
 *  - bis 90 m im Gebäude ohne Störquellen -> Kupfer (günstig, PoE möglich)
 *  - starke elektromagnetische Störung ODER > 100 m im Gebäude -> Multimode-LWL
 *  - Gebäudeübergang (Potentialunterschied/Blitzschutz) oder große Distanz -> Singlemode
 */
function randomMediumCase(): MediumCase {
  const faelle: MediumCase[] = [
    {
      text: 'Ein Arbeitsplatz im 2. OG soll an den Etagenverteiler angebunden werden. Die Trasse ist 62 m lang, verläuft im Bürobereich ohne besondere Störquellen. Gefordert sind 10 Gbit/s und Power over Ethernet für ein IP-Telefon.',
      distanceM: 62,
      correct: 'cat6a',
      begruendung:
        'Cat 6A trägt 10 Gbit/s über die vollen 100 m, 62 m liegen klar darunter. Nur Kupfer kann Power over Ethernet übertragen — über LWL ist PoE nicht möglich. LWL wäre hier unnötig teuer.',
    },
    {
      text: 'Zwei Gebäude auf dem Werksgelände liegen 380 m auseinander und sollen mit 10 Gbit/s gekoppelt werden. Die Trasse verläuft im Erdreich.',
      distanceM: 380,
      correct: 'os2',
      begruendung:
        'Bei einem Gebäudeübergang bestehen Potentialunterschiede und Blitzschlagrisiko — LWL ist galvanisch getrennt. 380 m überschreiten die 100-m-Grenze von Kupfer deutlich. OM4 trüge 10 Gbit/s zwar bis ca. 400 m, läge damit aber am Limit; OS2 bietet Reserve und ist auf 40/100 Gbit/s aufrüstbar.',
    },
    {
      text: 'In einer Fertigungshalle soll eine Maschinensteuerung 45 m entfernt vom Verteiler angebunden werden. Entlang der Trasse verlaufen Starkstromleitungen und Frequenzumrichter.',
      distanceM: 45,
      correct: 'om4',
      begruendung:
        'Die Distanz allein spräche für Kupfer, aber Frequenzumrichter und Starkstrom erzeugen starke elektromagnetische Störungen. LWL ist völlig unempfindlich dagegen und strahlt selbst nicht ab. Multimode (OM4) genügt auf 45 m und ist günstiger als Singlemode.',
    },
    {
      text: 'Der Gebäudeverteiler im Keller soll mit dem Etagenverteiler im 5. OG verbunden werden. Die Steigstrecke misst 140 m, gefordert sind 10 Gbit/s im Backbone.',
      distanceM: 140,
      correct: 'om4',
      begruendung:
        '140 m überschreiten die 100-m-Grenze von Twisted Pair, ein aktiver Zwischenverteiler wäre aufwendig. Im Sekundärbereich (Steigbereich) innerhalb eines Gebäudes ist Multimode-LWL Standard: OM4 trägt 10 Gbit/s bis ca. 400 m bei günstigeren Transceivern als OS2.',
    },
    {
      text: 'Eine Außenstelle ist 6 km vom Hauptstandort entfernt und soll über eine eigene Faserstrecke angebunden werden.',
      distanceM: 6000,
      correct: 'os2',
      begruendung:
        'Multimode ist durch Modendispersion auf einige hundert Meter begrenzt. Nur Singlemode (OS2) erreicht mit Lasern bei 1310/1550 nm Reichweiten von 10 km und mehr. Kupfer scheidet vollständig aus.',
    },
    {
      text: 'In einem Großraumbüro werden 24 Arbeitsplätze mit je 55 m Trassenlänge an den Etagenverteiler angebunden. Gefordert sind 1 Gbit/s, das Budget ist knapp.',
      distanceM: 55,
      correct: 'cat6a',
      begruendung:
        'Im Tertiärbereich bis 90 m ist Twisted-Pair-Kupfer das Standardmedium: deutlich günstiger in Material und Konfektionierung, PoE-fähig und für 1 Gbit/s weit überdimensioniert. Cat 6A ist zudem für spätere 10 Gbit/s vorbereitet.',
    },
  ]
  return pick(faelle)
}

/** Erzeugt eine Streckenaufgabe, die die Grenzwerte mal einhält und mal reißt. */
export function randomCabling(): CablingTask {
  const knapp = Math.random() < 0.4 // gelegentlich eine Strecke, die die Grenze reißt
  const steig = rnd(6, 18)
  const etage = knapp ? rnd(62, 78) : rnd(35, 58)
  const wand = rnd(2, 5)
  const schrank = rnd(2, 4)
  const zuschlagPct = pick([5, 10])
  const patchVerteiler = pick([2, 3])
  const patchArbeitsplatz = pick([3, 5])

  const segments: Segment[] = [
    { label: 'Steigschacht', m: steig },
    { label: 'Etagentrasse', m: etage },
    { label: 'Wandabgang zur Dose', m: wand },
    { label: 'Führung im Verteilerschrank', m: schrank },
  ]
  const fest = segments.reduce((a, s) => a + s.m, 0)
  const permanentLink = round2(fest * (1 + zuschlagPct / 100))
  const channel = round2(permanentLink + patchVerteiler + patchArbeitsplatz)

  return {
    ort: pick(ORTE),
    segments,
    zuschlagPct,
    patchVerteiler,
    patchArbeitsplatz,
    permanentLink,
    channel,
    linkOk: permanentLink <= MAX_PERMANENT_LINK,
    channelOk: channel <= MAX_CHANNEL,
    medium: randomMediumCase(),
  }
}
