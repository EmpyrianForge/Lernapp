import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Grade, TraceItem } from '../types'
import { useAppState } from '../state/AppState'
import { TRACES } from '../data/content'
import { shuffle } from '../lib/scheduler'
import { GradeButtons, Pill, ProgressBar } from './ui'
import { Icon } from './Icon'

// Schreibtischtest: Pseudocode lesen, eigene Wertetabelle Zeile für Zeile führen,
// dann mit der Muster-Wertetabelle vergleichen. Selbstbewertung speist SM-2.

function emptyRow(cols: number): string[] {
  return Array.from({ length: cols }, () => '')
}

function TraceGrid({ item }: { item: TraceItem }) {
  const [rows, setRows] = useState<string[][]>(() => [
    emptyRow(item.columns.length),
    emptyRow(item.columns.length),
  ])

  const setCell = (r: number, c: number, v: string) =>
    setRows((prev) => prev.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? v : cell)) : row)))

  return (
    <div className="trace-grid">
      <table className="trace-table">
        <thead>
          <tr>
            {item.columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>
                  <input
                    value={cell}
                    onChange={(e) => setCell(ri, ci, e.target.value)}
                    aria-label={`${item.columns[ci]} Zeile ${ri + 1}`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn ghost sm" onClick={() => setRows((p) => [...p, emptyRow(item.columns.length)])}>
        + Zeile
      </button>
    </div>
  )
}

export function TraceMode({ onExit }: { onExit: () => void }) {
  const { review } = useAppState()
  const [items] = useState(() => shuffle(TRACES))
  const [idx, setIdx] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const item = items[idx]
  const done = idx >= items.length

  const next = useCallback(
    (g: Grade) => {
      if (!item) return
      void review(item.id, g)
      setRevealed(false)
      setIdx((i) => i + 1)
    },
    [item, review],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onExit()
      if (!done && revealed) {
        const el = e.target as HTMLElement
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return
        if (['1', '2', '3', '4'].includes(e.key)) next(Number(e.key) as Grade)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, revealed, next, onExit])

  // eigener Grid-Key pro Item, damit die Tabelle beim Weiterschalten resettet
  const gridKey = useMemo(() => item?.id ?? 'none', [item])

  if (done) {
    return (
      <section className="panel center">
        <h2><Icon name="check" size={20} className="done-ico" /> Schreibtischtest fertig</h2>
        <p className="muted">Alle {items.length} Aufgaben durch. Wertetabelle sauber geführt?</p>
        <button className="btn primary" onClick={onExit}>Zurück zum Dashboard</button>
      </section>
    )
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta">
          <Pill>Schreibtischtest</Pill>
          <Pill tone="var(--accent-dim)">{item.points} P</Pill>
          {item.peripheral && <Pill tone="var(--muted-bg)">Randstoff</Pill>}
        </div>
        <span className="counter">{idx + 1} / {items.length}</span>
      </header>

      <ProgressBar value={idx / items.length} label="Fortschritt" />

      <div className="card">
        <p className="q">{item.prompt}</p>
        <pre className="pseudocode" aria-label="Pseudocode">{item.pseudocode.join('\n')}</pre>
        <p className="muted small">Deine Wertetabelle (mitführen, dann vergleichen):</p>
        <TraceGrid key={gridKey} item={item} />
      </div>

      {!revealed ? (
        <button className="btn primary wide" onClick={() => setRevealed(true)}>Musterlösung zeigen</button>
      ) : (
        <>
          <div className="solution" aria-live="polite">
            <h3>Muster-Wertetabelle</h3>
            <table className="trace-table model">
              <thead>
                <tr>
                  {item.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="result"><strong>Ausgabe:</strong> {item.output}</p>

            <h3>Teilpunkte (Rubric)</h3>
            <ul className="rubric">
              {item.rubric.map((r, i) => (
                <li key={i}><span className="pts">{r.points} P</span> {r.criterion}</li>
              ))}
            </ul>

            <h3 className="h3-ico"><Icon name="alert" size={15} /> Typische Fallen</h3>
            <ul className="pitfalls">
              {item.pitfalls.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <p className="muted small">Wie sicher warst du?</p>
          <GradeButtons onGrade={next} />
        </>
      )}
    </section>
  )
}
