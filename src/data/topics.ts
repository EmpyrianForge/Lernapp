import type { OperatorInfo, Topic } from '../types'

// Kanonische Themenliste, priorisiert nach examFrequency (Lern-Heuristik, kein IHK-Fakt).
// Muss zu den topicIds aus scripts/ingest.mjs passen.
export const TOPICS: Topic[] = [
  { id: 'hardware', label: 'Hardware', examFrequency: 1.0, ap1Status: 'core' },
  { id: 'wirtschaftlichkeit', label: 'Wirtschaftlichkeit', examFrequency: 1.0, ap1Status: 'core' },
  { id: 'neu-2025', label: 'Neu im Katalog 2025', examFrequency: 0.9, ap1Status: 'core' },
  { id: 'netzwerke', label: 'Netzwerke', examFrequency: 0.88, ap1Status: 'core' },
  { id: 'projektmanagement', label: 'Projektmanagement', examFrequency: 0.88, ap1Status: 'core' },
  { id: 'softwareentwicklung', label: 'Softwareentwicklung', examFrequency: 0.88, ap1Status: 'core' },
  { id: 'it-sicherheit', label: 'IT-Sicherheit', examFrequency: 0.75, ap1Status: 'core' },
  { id: 'kommunikation', label: 'Kommunikation & Markt', examFrequency: 0.75, ap1Status: 'supporting' },
  { id: 'betriebssysteme', label: 'Betriebssysteme', examFrequency: 0.63, ap1Status: 'supporting' },
  { id: 'qs-vertraege', label: 'QS, Verträge & Leistung', examFrequency: 0.55, ap1Status: 'supporting' },
  { id: 'datenschutz', label: 'Datenschutz', examFrequency: 0.5, ap1Status: 'supporting' },
  { id: 'internet', label: 'Internet & Web', examFrequency: 0.45, ap1Status: 'supporting' },
  { id: 'software-lizenzen', label: 'Software & Lizenzen', examFrequency: 0.45, ap1Status: 'supporting' },
  { id: 'multimedia', label: 'Multimedia', examFrequency: 0.38, ap1Status: 'supporting' },
]

export const TOPIC_BY_ID: Record<string, Topic> = Object.fromEntries(
  TOPICS.map((t) => [t.id, t]),
)

// Operatoren & Anforderungsbereiche (02-Aufgabentypen-Operatoren.md). Für den
// Operatoren-Trainingsmodus: zeigt je Operator, was für die volle Punktzahl nötig ist.
export const OPERATORS: OperatorInfo[] = [
  { operator: 'nennen / aufzählen', afb: 'I', expectation: 'Reine Fachbegriffe, keine Prosa. 1 Begriff = 1 Punkt.' },
  { operator: 'beschreiben / darstellen', afb: 'I–II', expectation: 'Ablauf vollständig, neutral, chronologisch wiedergeben.' },
  { operator: 'erklären / erläutern', afb: 'II', expectation: 'Ursache → Wirkung, das „Warum" deutlich machen.' },
  { operator: 'begründen', afb: 'III', expectation: 'Aussage + Argument(e) mit „…, weil …" (2–3 Argumente).' },
  { operator: 'beurteilen / bewerten', afb: 'III', expectation: 'Kriterien + Pro/Contra + explizites Fazit (Entscheidung benennen!).' },
  { operator: 'vergleichen', afb: 'II', expectation: 'Gemeinsamkeiten UND Unterschiede — am besten als Tabelle.' },
  { operator: 'berechnen', afb: 'I–II', expectation: 'Formel + Rechenweg + Zwischenschritte + Einheit (Teilpunkte!).' },
  { operator: 'entwickeln / entwerfen', afb: 'II–III', expectation: 'Konstruktion (Diagramm/Pseudocode) + Beschriftung.' },
]
