import { useState } from 'react'
import { useAppState } from '../state/AppState'
import { buildFlashcardSession } from '../lib/scheduler'
import { Reviewer } from './Reviewer'

// Karteikarten-Modus: fällige + neue Karten im Spaced-Repetition-Verfahren, interleaved.
export function FlashcardMode({ onExit }: { onExit: () => void }) {
  const { states, today, coreOnly } = useAppState()
  // Session einmalig beim Betreten aufbauen (stabile Item-Liste über die Session).
  const [items] = useState(() => buildFlashcardSession(states, 40, today, coreOnly))
  return (
    <Reviewer
      items={items}
      title={coreOnly ? 'Karteikarten — fällig (nur Kernthemen)' : 'Karteikarten — fällig'}
      onExit={onExit}
    />
  )
}
