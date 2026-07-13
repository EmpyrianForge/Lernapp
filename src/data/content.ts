import rawSeed from './content.generated.json'
import { CALC_ITEMS } from './calc-seed'
import { TRACE_ITEMS } from './trace-seed'
import type { CalcItem, FlashcardItem, Item, TraceItem } from '../types'

// Bündelt die Content-Quellen: die aus dem Vault generierten Karteikarten
// (content.generated.json), die handkuratierten Rechenaufgaben (calc-seed.ts) und
// die Schreibtischtest-/Pseudocode-Aufgaben (trace-seed.ts).

interface Seed {
  generatedAt: string | null
  count?: number
  items: FlashcardItem[]
}

const seed = rawSeed as Seed

export const USER_CARD_PREFIX = 'user--'

// Geteilte, in-place gepflegte Pools: Scheduler/Statistik lesen dieselben Referenzen,
// registerUserCards() aktualisiert sie zur Laufzeit ohne Neuimport.
export const FLASHCARDS: FlashcardItem[] = [...seed.items]
export const CALCS: CalcItem[] = CALC_ITEMS
export const TRACES: TraceItem[] = TRACE_ITEMS
export const ALL_ITEMS: Item[] = [...FLASHCARDS, ...CALCS, ...TRACES]

export const ITEM_BY_ID: Map<string, Item> = new Map(ALL_ITEMS.map((i) => [i.id, i]))

export const CONTENT_GENERATED_AT = seed.generatedAt

function removeUserCardsFrom(arr: { id: string }[]) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].id.startsWith(USER_CARD_PREFIX)) arr.splice(i, 1)
  }
}

/** Selbst erstellte Karten in die geteilten Pools einpflegen (ersetzt vorige User-Karten). */
export function registerUserCards(cards: FlashcardItem[]): void {
  removeUserCardsFrom(FLASHCARDS)
  removeUserCardsFrom(ALL_ITEMS)
  FLASHCARDS.push(...cards)
  ALL_ITEMS.push(...cards)
  ITEM_BY_ID.clear()
  for (const i of ALL_ITEMS) ITEM_BY_ID.set(i.id, i)
}

export function itemsByTopic(topicId: string): Item[] {
  return ALL_ITEMS.filter((i) => i.topicId === topicId)
}

export function flashcardsByTopic(topicId: string): FlashcardItem[] {
  return FLASHCARDS.filter((i) => i.topicId === topicId)
}
