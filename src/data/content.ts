import rawSeed from './content.generated.json'
import { CALC_ITEMS } from './calc-seed'
import { TRACE_ITEMS } from './trace-seed'
import { HYDRA_FLASHCARDS } from './hydra-content'
import type { CalcItem, FlashcardItem, Item, TraceItem, Track } from '../types'

// Bündelt die Content-Quellen: die aus dem Vault generierten Karteikarten
// (content.generated.json), die handkuratierten Rechenaufgaben (calc-seed.ts), die
// Schreibtischtest-/Pseudocode-Aufgaben (trace-seed.ts) und die Hydra-Lernkarten
// (hydra-content.ts, track 'hydra').
//
// Track-Trennung: Die von den Modi/Scheduler gelesenen Pools (FLASHCARDS, ALL_ITEMS …)
// sind eine GEFILTERTE Sicht auf die Master-Pools — je aktivem Track. Umschalten per
// setActiveTrack() pflegt dieselben Array-/Map-Referenzen in-place (kein Neuimport nötig),
// exakt wie registerUserCards. So zeigen ALLE Modi automatisch nur den passenden Stoff.

interface Seed {
  generatedAt: string | null
  count?: number
  items: FlashcardItem[]
}

const seed = rawSeed as Seed

export const USER_CARD_PREFIX = 'user--'

// --- Master-Pools (ALLE Tracks) ------------------------------------------------
const MASTER_FLASHCARDS: FlashcardItem[] = [...seed.items, ...HYDRA_FLASHCARDS]
const MASTER_CALCS: CalcItem[] = CALC_ITEMS
const MASTER_TRACES: TraceItem[] = TRACE_ITEMS

// --- Sichtbare Pools (aktiver Track) — dieselben Referenzen, in-place gepflegt --
export const FLASHCARDS: FlashcardItem[] = []
export const CALCS: CalcItem[] = []
export const TRACES: TraceItem[] = []
export const ALL_ITEMS: Item[] = []
export const ITEM_BY_ID: Map<string, Item> = new Map()

export const CONTENT_GENERATED_AT = seed.generatedAt

const trackOf = (i: Item): Track => ('track' in i && i.track ? i.track : 'ap1')

function matchesTrack(i: Item, track: Track): boolean {
  if (track === 'hydra') return trackOf(i) === 'hydra'
  if (track === 'ap2') return trackOf(i) !== 'hydra' && i.ap1Status === 'ap2-grundlagen'
  return trackOf(i) === 'ap1' // 'ap1' = FIAE-Standard-Bestand; dedizierter 'ap2'-Track bleibt separat
}

let activeTrack: Track = 'ap1'

/** Baut die sichtbaren Pools aus den Master-Pools für den aktiven Track (in-place). */
function rebuild(): void {
  const fc = MASTER_FLASHCARDS.filter((i) => matchesTrack(i, activeTrack))
  const ca = MASTER_CALCS.filter((i) => matchesTrack(i, activeTrack))
  const tr = MASTER_TRACES.filter((i) => matchesTrack(i, activeTrack))
  FLASHCARDS.splice(0, FLASHCARDS.length, ...fc)
  CALCS.splice(0, CALCS.length, ...ca)
  TRACES.splice(0, TRACES.length, ...tr)
  ALL_ITEMS.splice(0, ALL_ITEMS.length, ...fc, ...ca, ...tr)
  ITEM_BY_ID.clear()
  for (const i of ALL_ITEMS) ITEM_BY_ID.set(i.id, i)
}

/** Aktiven Track setzen (AP1 / AP2 / Hydra) und die Pools neu aufbauen. */
export function setActiveTrack(track: Track): void {
  activeTrack = track
  rebuild()
}

export function getActiveTrack(): Track {
  return activeTrack
}

function removeUserCardsFrom(arr: { id: string }[]) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].id.startsWith(USER_CARD_PREFIX)) arr.splice(i, 1)
  }
}

/** Selbst erstellte Karten in den Master-Pool einpflegen (ersetzt vorige User-Karten). */
export function registerUserCards(cards: FlashcardItem[]): void {
  removeUserCardsFrom(MASTER_FLASHCARDS)
  MASTER_FLASHCARDS.push(...cards)
  rebuild()
}

export function itemsByTopic(topicId: string): Item[] {
  return ALL_ITEMS.filter((i) => i.topicId === topicId)
}

export function flashcardsByTopic(topicId: string): FlashcardItem[] {
  return FLASHCARDS.filter((i) => i.topicId === topicId)
}

rebuild() // initialer Track: 'ap1' (Bestand unverändert)
