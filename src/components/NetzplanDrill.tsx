import { useMemo, useState } from 'react'
import {
  NETZPLAENE,
  computeNetzplan,
  type Netzplan,
  type NodeCalc,
} from '../lib/netzplan'
import { useAppState } from '../state/AppState'
import { Pill } from './ui'
import { Icon } from './Icon'

// Interaktiver Netzplan: der Lerner füllt je Knoten FAZ/FEZ/SAZ/SEZ/GP, prüft gegen
// die berechnete Lösung; kritischer Pfad (GP = 0) wird hervorgehoben.

type FieldKey = 'faz' | 'fez' | 'saz' | 'sez' | 'gp'
type Ans = Record<string, Partial<Record<FieldKey, string>>>

const parse = (s: string | undefined) => (s === undefined || s.trim() === '' ? NaN : Number(s.trim()))

function NodeBox({
  id,
  dauer,
  vorgaenger,
  ans,
  calc,
  checked,
  set,
}: {
  id: string
  dauer: number
  vorgaenger: string[]
  ans: Partial<Record<FieldKey, string>>
  calc: NodeCalc
  checked: boolean
  set: (f: FieldKey, v: string) => void
}) {
  const cls = (f: FieldKey) =>
    checked ? (parse(ans[f]) === calc[f] ? 'nz-ok' : 'nz-bad') : ''
  const field = (f: FieldKey) => (
    <input
      className={`nz-input ${cls(f)}`}
      value={ans[f] ?? ''}
      onChange={(e) => set(f, e.target.value)}
      disabled={checked}
      inputMode="numeric"
      aria-label={`${id} ${f.toUpperCase()}`}
    />
  )
  return (
    <div className={`nz-node ${checked && calc.critical ? 'critical' : ''}`}>
      <div className="nz-row">
        {field('faz')}
        <span className="nz-fixed" title="Dauer">{dauer}</span>
        {field('fez')}
      </div>
      <div className="nz-label">
        {id}
        {vorgaenger.length > 0 && <span className="nz-vorg"> ← {vorgaenger.join(', ')}</span>}
      </div>
      <div className="nz-row">
        {field('saz')}
        {field('gp')}
        {field('sez')}
      </div>
    </div>
  )
}

function Game({ plan, onExit }: { plan: Netzplan; onExit: () => void }) {
  const { recordDrill } = useAppState()
  const calc = useMemo(() => computeNetzplan(plan.activities), [plan])
  const [ans, setAns] = useState<Ans>({})
  const [checked, setChecked] = useState(false)

  const set = (id: string, f: FieldKey, v: string) =>
    setAns((a) => ({ ...a, [id]: { ...a[id], [f]: v } }))

  const fieldsCorrect = plan.activities.reduce((n, a) => {
    const fields: FieldKey[] = ['faz', 'fez', 'saz', 'sez', 'gp']
    return n + fields.filter((f) => parse(ans[a.id]?.[f]) === calc[a.id][f]).length
  }, 0)
  const totalFields = plan.activities.length * 5
  const allOk = fieldsCorrect === totalFields
  const projectEnd = Math.max(...plan.activities.map((a) => calc[a.id].fez))
  const critPath = plan.activities.filter((a) => calc[a.id].critical).map((a) => a.id)

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Beenden</button>
        <h2>{plan.title}</h2>
      </header>
      <p className="muted small">
        Fülle je Knoten oben <strong>FAZ · Dauer · FEZ</strong>, unten <strong>SAZ · GP · SEZ</strong>.
        FEZ = FAZ + Dauer · FAZ = max(FEZ Vorgänger) · SAZ = SEZ − Dauer · GP = SAZ − FAZ.
      </p>

      <div className="nz-grid">
        {plan.activities.map((a) => (
          <NodeBox
            key={a.id}
            id={a.id}
            dauer={a.dauer}
            vorgaenger={a.vorgaenger}
            ans={ans[a.id] ?? {}}
            calc={calc[a.id]}
            checked={checked}
            set={(f, v) => set(a.id, f, v)}
          />
        ))}
      </div>

      {!checked ? (
        <button
          className="btn primary wide"
          onClick={() => {
            setChecked(true)
            recordDrill('Netzplan', fieldsCorrect, totalFields)
          }}
        >
          Prüfen
        </button>
      ) : (
        <>
          <div className={`feedback ${allOk ? 'ok' : 'bad'}`} aria-live="polite">
            <Icon name={allOk ? 'check' : 'x'} size={16} className="fb-ico" />
            <div>
            {allOk ? 'Alle Werte korrekt!' : `${fieldsCorrect}/${totalFields} Felder richtig — falsche sind rot markiert.`}
            <div className="mt">
              Projektdauer: <strong>{projectEnd}</strong> · Kritischer Pfad: <strong>{critPath.join(' → ')}</strong> (GP = 0)
            </div>
            </div>
          </div>
          <button className="btn primary wide" onClick={onExit}>Zurück zur Auswahl</button>
        </>
      )}
    </section>
  )
}

export function NetzplanDrill({ onExit }: { onExit: () => void }) {
  const [plan, setPlan] = useState<Netzplan | null>(null)
  if (plan) return <Game plan={plan} onExit={() => setPlan(null)} />

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>Netzplan / kritischer Pfad</h2>
      </header>
      <p className="muted small">Wähle ein Projekt. Berechne FAZ/FEZ (vorwärts) und SAZ/SEZ (rückwärts) sowie den Gesamtpuffer.</p>
      <div className="deck-list">
        {NETZPLAENE.map((n) => (
          <button key={n.id} className="deck-card" onClick={() => setPlan(n)}>
            <span className="deck-title">{n.title}</span>
            <span className="deck-meta"><Pill>{n.activities.length} Vorgänge</Pill></span>
          </button>
        ))}
      </div>
    </section>
  )
}
