import { useState } from 'react'
import type { FlashcardItem } from '../types'
import { useAppState } from '../state/AppState'
import { ITEM_BY_ID } from '../data/content'
import { Reviewer } from './Reviewer'

// Schwachstellen-Training: zieht gezielt die schwächsten Karteikarten (oft „nicht
// gewusst", niedrige Easiness) in eine Session — unabhängig von der Fälligkeit.
export function WeakTraining({ onExit }: { onExit: () => void }) {
  const { states } = useAppState()
  const [items] = useState<FlashcardItem[]>(() => {
    return [...states.values()]
      .filter((s) => s.history.length > 0)
      .map((s) => ({ s, item: ITEM_BY_ID.get(s.itemId) }))
      .filter((x): x is { s: typeof x.s; item: FlashcardItem } => x.item?.type === 'flashcard')
      .sort((a, b) => {
        const la = a.s.history.filter((h) => h.grade === 1).length
        const lb = b.s.history.filter((h) => h.grade === 1).length
        return lb - la || a.s.ef - b.s.ef
      })
      .slice(0, 25)
      .map((x) => x.item)
  })

  return <Reviewer items={items} title="Schwachstellen-Training" onExit={onExit} />
}
