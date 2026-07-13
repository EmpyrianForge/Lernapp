import Dexie, { type Table } from 'dexie'
import type { FlashcardItem, UserState } from '../types'

// Lokale Persistenz (IndexedDB via Dexie). KEIN Backend, KEINE personenbezogenen
// Daten → DSGVO-Aufwand entfällt (05-Lernstrategie.md). Einziges Backup: JSON-Export.

export interface KV {
  key: string
  value: unknown
}

export class LernDB extends Dexie {
  states!: Table<UserState, string>
  kv!: Table<KV, string>
  userCards!: Table<FlashcardItem, string>

  constructor() {
    super('ap1-lernapp')
    this.version(1).stores({
      states: 'itemId, due', // Primärschlüssel itemId, Index auf due für Fälligkeitsabfragen
      kv: 'key',
    })
    // v2: selbst erstellte Karteikarten (bleiben beim Re-Ingest erhalten).
    this.version(2).stores({
      states: 'itemId, due',
      kv: 'key',
      userCards: 'id, topicId',
    })
  }
}

export const db = new LernDB()

export async function loadAllStates(): Promise<Map<string, UserState>> {
  const rows = await db.states.toArray()
  return new Map(rows.map((s) => [s.itemId, s]))
}

export async function saveState(state: UserState): Promise<void> {
  await db.states.put(state)
}

export async function getKV<T>(key: string): Promise<T | undefined> {
  const row = await db.kv.get(key)
  return row?.value as T | undefined
}

export async function setKV(key: string, value: unknown): Promise<void> {
  await db.kv.put({ key, value })
}

export async function loadUserCards(): Promise<FlashcardItem[]> {
  return db.userCards.toArray()
}

export async function putUserCard(card: FlashcardItem): Promise<void> {
  await db.userCards.put(card)
}

export async function removeUserCard(id: string): Promise<void> {
  await db.userCards.delete(id)
  await db.states.delete(id) // zugehörigen Lernstand mit entfernen
}

/** Vollständiger Zustands-Export als JSON-String (einziges Backup). */
export async function exportJSON(): Promise<string> {
  const states = await db.states.toArray()
  const kv = await db.kv.toArray()
  const userCards = await db.userCards.toArray()
  return JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), states, kv, userCards }, null, 2)
}

/** Import eines zuvor exportierten Zustands (überschreibt bestehende Einträge per id). */
export async function importJSON(json: string): Promise<number> {
  const data = JSON.parse(json) as { states?: UserState[]; kv?: KV[]; userCards?: FlashcardItem[] }
  let n = 0
  if (Array.isArray(data.states)) {
    await db.states.bulkPut(data.states)
    n = data.states.length
  }
  if (Array.isArray(data.kv)) await db.kv.bulkPut(data.kv)
  if (Array.isArray(data.userCards)) await db.userCards.bulkPut(data.userCards)
  return n
}
