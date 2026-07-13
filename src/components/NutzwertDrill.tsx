import { useMemo, useState } from 'react'
import { useAppState } from '../state/AppState'
import { shuffle } from '../lib/scheduler'
import { Icon } from './Icon'

// Nutzwertanalyse-Trainer: gewichtete Bewertungsmatrix ist gegeben, der Lerner berechnet
// die Nutzwerte je Alternative und benennt den Sieger. Häufigste „große" AP1-Aufgabe
// (02-Aufgabentypen-Operatoren / 03-Rechenschemata §4).

const CRITERIA_POOL = ['Preis', 'Qualität', 'Lieferzeit', 'Support', 'Erweiterbarkeit', 'Energieeffizienz']
const WEIGHT_SETS = [
  [0.5, 0.3, 0.2],
  [0.4, 0.35, 0.25],
  [0.4, 0.4, 0.2],
  [0.5, 0.25, 0.25],
  [0.6, 0.25, 0.15],
]

interface Scenario {
  criteria: string[]
  weights: number[]
  pointsA: number[]
  pointsB: number[]
  nutzwertA: number
  nutzwertB: number
  winner: 'A' | 'B'
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function genScenario(): Scenario {
  const criteria = shuffle(CRITERIA_POOL).slice(0, 3)
  const weights = shuffle(WEIGHT_SETS)[0]
  const rndPts = () => 1 + Math.floor(Math.random() * 10) // 1..10
  let pointsA: number[], pointsB: number[], nA: number, nB: number
  do {
    pointsA = [rndPts(), rndPts(), rndPts()]
    pointsB = [rndPts(), rndPts(), rndPts()]
    nA = round2(weights.reduce((s, w, i) => s + w * pointsA[i], 0))
    nB = round2(weights.reduce((s, w, i) => s + w * pointsB[i], 0))
  } while (nA === nB) // Gleichstand vermeiden
  return { criteria, weights, pointsA, pointsB, nutzwertA: nA, nutzwertB: nB, winner: nA > nB ? 'A' : 'B' }
}

const fmt = (n: number) => n.toFixed(2).replace('.', ',')
const parse = (s: string) => parseFloat(s.replace(',', '.').trim())

export function NutzwertDrill({ onExit }: { onExit: () => void }) {
  const { recordDrill } = useAppState()
  const [sc, setSc] = useState<Scenario>(genScenario)
  const [ansA, setAnsA] = useState('')
  const [ansB, setAnsB] = useState('')
  const [winner, setWinner] = useState<'A' | 'B' | null>(null)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const okA = useMemo(() => Math.abs(parse(ansA) - sc.nutzwertA) < 0.005, [ansA, sc])
  const okB = useMemo(() => Math.abs(parse(ansB) - sc.nutzwertB) < 0.005, [ansB, sc])
  const okWinner = winner === sc.winner
  const allOk = okA && okB && okWinner

  const check = () => {
    if (checked) return
    setChecked(true)
    setScore((s) => ({ correct: s.correct + (allOk ? 1 : 0), total: s.total + 1 }))
    recordDrill('Nutzwertanalyse', allOk ? 1 : 0, 1)
  }
  const next = () => {
    setSc(genScenario())
    setAnsA('')
    setAnsB('')
    setWinner(null)
    setChecked(false)
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <div className="study-meta"><span className="pill">Nutzwertanalyse</span></div>
        <span className="counter">{score.correct}/{score.total} ✓</span>
      </header>

      <div className="card">
        <p className="q">Berechne die Nutzwerte beider Alternativen und benenne den Sieger. (Bewertung 1–10, höher = besser)</p>
        <div className="nw-table-wrap">
          <table className="nw-table">
            <thead>
              <tr>
                <th>Kriterium</th>
                <th>Gewicht</th>
                <th>A</th>
                <th>B</th>
              </tr>
            </thead>
            <tbody>
              {sc.criteria.map((c, i) => (
                <tr key={c}>
                  <td>{c}</td>
                  <td>{fmt(sc.weights[i])}</td>
                  <td>{sc.pointsA[i]}</td>
                  <td>{sc.pointsB[i]}</td>
                </tr>
              ))}
              <tr className="nw-sum">
                <td>Σ Gewichte</td>
                <td>{fmt(sc.weights.reduce((s, w) => s + w, 0))}</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="nw-inputs">
          <label className={`sf ${checked ? (okA ? 'ok' : 'bad') : ''}`}>
            <span className="sf-label">Nutzwert A</span>
            <input value={ansA} onChange={(e) => setAnsA(e.target.value)} disabled={checked} inputMode="decimal" aria-label="Nutzwert A" />
            {checked && !okA && <span className="sf-correct">→ {fmt(sc.nutzwertA)}</span>}
          </label>
          <label className={`sf ${checked ? (okB ? 'ok' : 'bad') : ''}`}>
            <span className="sf-label">Nutzwert B</span>
            <input value={ansB} onChange={(e) => setAnsB(e.target.value)} disabled={checked} inputMode="decimal" aria-label="Nutzwert B" />
            {checked && !okB && <span className="sf-correct">→ {fmt(sc.nutzwertB)}</span>}
          </label>
        </div>

        <div className="nw-winner">
          <span>Sieger:</span>
          {(['A', 'B'] as const).map((w) => (
            <button
              key={w}
              className={`nw-win-btn ${winner === w ? 'sel' : ''} ${checked && sc.winner === w ? 'correct' : ''}`}
              disabled={checked}
              aria-pressed={winner === w}
              onClick={() => setWinner(w)}
            >
              Alternative {w}
            </button>
          ))}
        </div>
      </div>

      {!checked ? (
        <button className="btn primary wide" onClick={check} disabled={winner === null}>Prüfen</button>
      ) : (
        <>
          <div className={`feedback ${allOk ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={allOk ? 'check' : 'x'} size={16} className="fb-ico" />
            <div>
            {allOk ? 'Alles korrekt!' : 'Schau dir die Zwischenschritte an:'}
            <ul className="steps mt">
              {sc.criteria.map((c, i) => (
                <li key={c}>{c}: A {sc.pointsA[i]}·{fmt(sc.weights[i])} = {fmt(sc.pointsA[i] * sc.weights[i])} · B {sc.pointsB[i]}·{fmt(sc.weights[i])} = {fmt(sc.pointsB[i] * sc.weights[i])}</li>
              ))}
              <li><strong>Nutzwert A = {fmt(sc.nutzwertA)} · Nutzwert B = {fmt(sc.nutzwertB)} → Sieger {sc.winner}</strong></li>
            </ul>
            </div>
          </div>
          <button className="btn primary wide" onClick={next}>Nächste Aufgabe</button>
        </>
      )}
    </section>
  )
}
