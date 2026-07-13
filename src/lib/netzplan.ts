// Netzplantechnik: Vorwärts-/Rückwärtsrechnung, Gesamtpuffer, kritischer Pfad.
// FEZ = FAZ + Dauer · FAZ = max(FEZ der Vorgänger) · SAZ = SEZ − Dauer
// SEZ = min(SAZ der Nachfolger) bzw. Projektende · GP = SAZ − FAZ (= SEZ − FEZ)
// Kritischer Pfad = Vorgänge mit GP = 0. (04-Projektmanagement / 03-Rechenschemata)

export interface Activity {
  id: string
  dauer: number
  vorgaenger: string[]
}

export interface NodeCalc {
  id: string
  dauer: number
  faz: number
  fez: number
  saz: number
  sez: number
  gp: number
  critical: boolean
}

export interface Netzplan {
  id: string
  title: string
  topicId: string
  activities: Activity[]
}

export function computeNetzplan(acts: Activity[]): Record<string, NodeCalc> {
  const byId = new Map(acts.map((a) => [a.id, a]))
  const fez = new Map<string, number>()
  const faz = new Map<string, number>()

  // Vorwärtsrechnung (memoisiert)
  function calcFez(id: string): number {
    if (fez.has(id)) return fez.get(id)!
    const a = byId.get(id)!
    const start = a.vorgaenger.length === 0 ? 0 : Math.max(...a.vorgaenger.map(calcFez))
    faz.set(id, start)
    const finish = start + a.dauer
    fez.set(id, finish)
    return finish
  }
  acts.forEach((a) => calcFez(a.id))
  const projectEnd = Math.max(...acts.map((a) => fez.get(a.id)!))

  // Nachfolger-Index
  const successors = new Map<string, string[]>()
  acts.forEach((a) => successors.set(a.id, []))
  acts.forEach((a) => a.vorgaenger.forEach((v) => successors.get(v)!.push(a.id)))

  // Rückwärtsrechnung (memoisiert)
  const saz = new Map<string, number>()
  const sez = new Map<string, number>()
  function calcSaz(id: string): number {
    if (saz.has(id)) return saz.get(id)!
    const a = byId.get(id)!
    const succ = successors.get(id)!
    const late = succ.length === 0 ? projectEnd : Math.min(...succ.map(calcSaz))
    sez.set(id, late)
    const start = late - a.dauer
    saz.set(id, start)
    return start
  }
  acts.forEach((a) => calcSaz(a.id))

  const result: Record<string, NodeCalc> = {}
  for (const a of acts) {
    const gp = saz.get(a.id)! - faz.get(a.id)!
    result[a.id] = {
      id: a.id,
      dauer: a.dauer,
      faz: faz.get(a.id)!,
      fez: fez.get(a.id)!,
      saz: saz.get(a.id)!,
      sez: sez.get(a.id)!,
      gp,
      critical: gp === 0,
    }
  }
  return result
}

export function projectDuration(acts: Activity[]): number {
  const calc = computeNetzplan(acts)
  return Math.max(...acts.map((a) => calc[a.id].fez))
}

export const NETZPLAENE: Netzplan[] = [
  {
    id: 'np-klein',
    title: 'Kleines Projekt (4 Vorgänge)',
    topicId: 'projektmanagement',
    activities: [
      { id: 'A', dauer: 2, vorgaenger: [] },
      { id: 'B', dauer: 3, vorgaenger: ['A'] },
      { id: 'C', dauer: 1, vorgaenger: ['A'] },
      { id: 'D', dauer: 2, vorgaenger: ['B', 'C'] },
    ],
  },
  {
    id: 'np-mittel',
    title: 'Mittleres Projekt (6 Vorgänge)',
    topicId: 'projektmanagement',
    activities: [
      { id: 'A', dauer: 3, vorgaenger: [] },
      { id: 'B', dauer: 4, vorgaenger: ['A'] },
      { id: 'C', dauer: 2, vorgaenger: ['A'] },
      { id: 'D', dauer: 5, vorgaenger: ['B', 'C'] },
      { id: 'E', dauer: 3, vorgaenger: ['C'] },
      { id: 'F', dauer: 2, vorgaenger: ['D', 'E'] },
    ],
  },
]
