import raw from './drill-guides.json'

// Vollständige Lösungs-Anleitungen zu jeder interaktiven Übung ("So löst du das").
// Pro Thema: Grundidee, Schritt-für-Schritt-Methode, durchgerechnetes Musterbeispiel,
// Merksätze und typische Punktefallen. Generiert und fachlich gegengeprüft.

export interface GuideStep {
  title: string
  body: string
}

export interface DrillGuideData {
  title: string
  intro: string
  steps: GuideStep[]
  example: { task: string; solution: string[]; result: string }
  facts: string[]
  pitfalls: string[]
}

export const DRILL_GUIDES: Record<string, DrillGuideData> = raw as Record<string, DrillGuideData>

export function guideFor(id: string): DrillGuideData | undefined {
  return DRILL_GUIDES[id]
}
