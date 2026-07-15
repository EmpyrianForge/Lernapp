import { useState } from 'react'
import { OOP_LESSONS, type OopLesson } from '../data/oop-lessons'
import { MarkdownText } from './markdown'
import { Pill } from './ui'

// OOP-Kurs mit Erklärung, Merksätzen und Code in drei Formen (Pseudocode/Java/Python).
type Lang = 'pseudocode' | 'java' | 'python'
const LANGS: [Lang, string][] = [
  ['pseudocode', 'Pseudocode'],
  ['java', 'Java'],
  ['python', 'Python'],
]

function LessonView({ idx, onExit, onNav }: { idx: number; onExit: () => void; onNav: (d: -1 | 1) => void }) {
  const lesson: OopLesson = OOP_LESSONS[idx]
  const [lang, setLangState] = useState<Lang>(
    () => ((typeof localStorage !== 'undefined' && (localStorage.getItem('oop-lang') as Lang)) || 'pseudocode'),
  )
  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('oop-lang', l) } catch { /* ignore */ }
  }

  return (
    <section className="panel study">
      <header className="study-head">
        <button className="btn ghost" onClick={onExit}>← Übersicht</button>
        <div className="study-meta">
          <Pill>{lesson.section}</Pill>
          {lesson.level === 'vertiefung' && <Pill tone="var(--muted-bg)">AP2 · Vertiefung</Pill>}
        </div>
        <span className="counter">{idx + 1} / {OOP_LESSONS.length}</span>
      </header>

      <h2 className="oop-title">{lesson.title}</h2>
      <p className="oop-explain"><MarkdownText text={lesson.explanation} /></p>

      {lesson.keyPoints.length > 0 && (
        <ul className="oop-keypoints">
          {lesson.keyPoints.map((k, i) => (
            <li key={i}><MarkdownText text={k} /></li>
          ))}
        </ul>
      )}

      <div className="lang-toggle" role="tablist" aria-label="Code-Sprache">
        {LANGS.map(([l, label]) => (
          <button
            key={l}
            role="tab"
            aria-selected={lang === l}
            className={`seg-btn ${lang === l ? 'on' : ''}`}
            onClick={() => setLang(l)}
          >
            {label}
          </button>
        ))}
      </div>

      <pre className="code-block" aria-label={`Code (${lang})`}><code>{lesson[lang]}</code></pre>

      {lesson.output && (
        <div className="code-output">
          <span className="co-label">Ausgabe (Konsole)</span>
          <pre>{lesson.output}</pre>
        </div>
      )}

      {lang === 'pseudocode' && (
        <p className="muted small">💡 Pseudocode ist die Form, die in der AP1 verlangt wird.</p>
      )}

      <div className="exam-foot">
        <button className="btn ghost" disabled={idx === 0} onClick={() => onNav(-1)}>← Zurück</button>
        <button className="btn" disabled={idx === OOP_LESSONS.length - 1} onClick={() => onNav(1)}>Weiter →</button>
      </div>
    </section>
  )
}

export function OopMode({ onExit }: { onExit: () => void }) {
  const [idx, setIdx] = useState<number | null>(null)

  if (idx !== null) {
    return (
      <LessonView
        idx={idx}
        onExit={() => setIdx(null)}
        onNav={(d) => setIdx((i) => Math.min(OOP_LESSONS.length - 1, Math.max(0, (i ?? 0) + d)))}
      />
    )
  }

  const sections = [...new Set(OOP_LESSONS.map((l) => l.section))]

  return (
    <section className="panel">
      <header className="panel-head">
        <button className="btn ghost" onClick={onExit}>← Zurück</button>
        <h2>OOP-Grundlagen</h2>
      </header>
      <p className="muted small">
        Objektorientierung mit Code-Beispielen. Je Konzept umschaltbar: <strong>Pseudocode</strong> (AP1-Prüfungsform),
        <strong> Java</strong> (Berufsschule/IHK) und <strong>Python</strong>. Lauffähige Beispiele zeigen die geprüfte Konsolen-Ausgabe.
      </p>

      {sections.map((sec) => (
        <div key={sec} className="oop-section">
          <h3 className="section-title">{sec}</h3>
          <div className="deck-list">
            {OOP_LESSONS.map((l, i) =>
              l.section === sec ? (
                <button key={l.id} className="deck-card" onClick={() => setIdx(i)}>
                  <span className="deck-title">{l.title}</span>
                  <span className="deck-meta">
                    <Pill>{i + 1}</Pill>
                    {l.level === 'vertiefung' && <Pill tone="var(--muted-bg)">AP2</Pill>}
                    {l.output && <span className="muted small">mit Ausgabe</span>}
                  </span>
                </button>
              ) : null,
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
