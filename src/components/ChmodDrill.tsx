import { Fragment, useState } from 'react'
import { useAppState } from '../state/AppState'
import { Icon } from './Icon'
import {
  type PermGrid,
  emptyGrid,
  gridToOctal,
  gridToSymbolic,
  octalToGrid,
  randomTarget,
} from '../lib/chmod'

// Interaktiver chmod-Drill: rwx-Matrix anklicken, Oktal + symbolische Form live,
// gegen eine beschriebene Zielvorgabe prüfen. Betriebssysteme (03-Rechenschemata §7).

const ROWS = ['user', 'group', 'others'] as const
const COLS = ['r', 'w', 'x'] as const

export function ChmodDrill({ onExit }: { onExit: () => void }) {
  const { recordDrill } = useAppState()
  const [target, setTarget] = useState(() => randomTarget())
  const [grid, setGrid] = useState<PermGrid>(emptyGrid)
  const [checked, setChecked] = useState<null | boolean>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const octal = gridToOctal(grid)
  const symbolic = gridToSymbolic(grid)

  const toggle = (r: number, c: number) => {
    if (checked !== null) return
    setGrid((g) => g.map((row, ri) => (ri === r ? (row.map((v, ci) => (ci === c ? !v : v)) as PermGrid[number]) : row)) as PermGrid)
  }

  const check = () => {
    const ok = octal === target.octal
    setChecked(ok)
    setScore((s) => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }))
    recordDrill('chmod-Rechte', ok ? 1 : 0, 1)
  }

  const next = () => {
    setTarget((t) => randomTarget(t.octal))
    setGrid(emptyGrid())
    setChecked(null)
  }

  const solution = octalToGrid(target.octal)

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><span className="pill">chmod-Rechte</span></div>
        <span className="counter">{score.correct}/{score.total} ✓</span>
      </header>

      <div className="card">
        <p className="q">Setze die Rechte für:</p>
        <p className="drill-task">{target.hint}</p>

        <div className="perm-grid" role="group" aria-label="Rechte-Matrix">
          <div className="pg-corner" />
          {COLS.map((c) => (
            <div key={c} className="pg-colhead">{c}</div>
          ))}
          {ROWS.map((rowName, r) => (
            <Fragment key={rowName}>
              <div className="pg-rowhead">{rowName}</div>
              {COLS.map((c, ci) => (
                <button
                  key={c}
                  className={`pg-cell ${grid[r][ci] ? 'on' : ''}`}
                  aria-pressed={grid[r][ci]}
                  aria-label={`${rowName} ${c}`}
                  onClick={() => toggle(r, ci)}
                >
                  {grid[r][ci] ? c : '–'}
                </button>
              ))}
            </Fragment>
          ))}
        </div>

        <div className="chmod-readout">
          <span className="octal">{octal}</span>
          <span className="symbolic">{symbolic}</span>
        </div>
      </div>

      {checked === null ? (
        <button className="btn primary wide" onClick={check}>Prüfen</button>
      ) : (
        <>
          <div className={`feedback ${checked ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={checked ? 'check' : 'x'} size={16} className="fb-ico" />
            {checked ? (
              <span>Richtig! <strong>{target.octal}</strong> = {gridToSymbolic(solution)}</span>
            ) : (
              <span>Nicht ganz. Richtig wäre <strong>{target.octal}</strong> = {gridToSymbolic(solution)} (dein Wert: {octal}).</span>
            )}
          </div>
          <button className="btn primary wide" onClick={next}>Nächste Aufgabe</button>
        </>
      )}
    </section>
  )
}
