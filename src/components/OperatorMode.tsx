import { OPERATORS } from '../data/topics'
import { Pill } from './ui'

// Operatoren-Training (02-Aufgabentypen-Operatoren.md): zeigt je Operator die
// erwartete Leistung für die volle Punktzahl. Referenz-/Nachschlage-Modus.
export function OperatorMode({ onExit }: { onExit: () => void }) {
  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>Operatoren-Training</h2>
      </header>

      <div className="rule">
        <strong>Goldene Regel:</strong> Punktzahl ≈ Anzahl der geforderten korrekten Aussagen.
        Eine 4-Punkte-Frage will vier belegbare Aussagen — zähl die Punkte, liefere so viele klare Aussagen.
      </div>

      <div className="op-list">
        {OPERATORS.map((op) => (
          <article key={op.operator} className="op-card">
            <div className="op-head">
              <h3>{op.operator}</h3>
              <Pill tone="var(--accent-dim)">AFB {op.afb}</Pill>
            </div>
            <p>{op.expectation}</p>
          </article>
        ))}
      </div>

      <p className="muted small">
        AFB I = Reproduktion · AFB II = Reorganisation/Transfer · AFB III = Reflexion/Problemlösung.
      </p>
    </section>
  )
}
