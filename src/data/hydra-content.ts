import raw from './hydra-content.generated.json'
import type { FlashcardItem } from '../types'

// Hydra-Lernkarten (Track 'hydra') — Wissen & Fachgespräch-Fragen zum IHK-AP2-
// Abschlussprojekt Hydra. Erzeugt aus dem Hydra-Wiki + dem IHK-annotierten V2-Code
// (Multi-Agenten-Lauf über 10 Themenbereiche), dedupliziert, abgelegt in
// hydra-content.generated.json. Diese Datei bildet die Rohkarten nur auf das
// FlashcardItem-Format ab.
//
// ap1Status:'core' hält die Karten immer sichtbar (der „Nur Kernthemen"-Filter
// stammt aus AP1); track:'hydra' trennt Content UND Lernstand sauber von AP1/AP2.

interface RawCard {
  topic: string
  slug: string
  front: string
  back: string
  tags?: string[]
}

function toCard(c: RawCard): FlashcardItem {
  return {
    id: `hydra-${c.topic}-${c.slug}`,
    topicId: `hydra-${c.topic}`,
    type: 'flashcard',
    tags: ['hydra', ...(c.tags ?? [])],
    examFrequency: 0.8,
    ap1Status: 'core',
    track: 'hydra',
    operator: null,
    afb: null,
    points: null,
    front: c.front,
    back: c.back,
    source: 'Hydra-Wiki / V2-Code',
  }
}

export const HYDRA_FLASHCARDS: FlashcardItem[] = (raw as { cards: RawCard[] }).cards.map(toCard)
