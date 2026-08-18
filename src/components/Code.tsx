import { useMemo } from 'react'
import { tokenize, type Lang } from '../lib/highlight'

// Farbig hervorgehobener Code. Rendert Tokens als <span> (kein innerHTML → sicher).
// `lines` blendet zusätzlich Zeilennummern ein; `markLine` hebt eine Zeile hervor
// (für „Fehler finden"), `activeLine` markiert die gerade betrachtete Zeile.

function Tokens({ code, lang }: { code: string; lang: Lang }) {
  const tokens = useMemo(() => tokenize(code, lang), [code, lang])
  return (
    <>
      {tokens.map((t, i) => (t.kind === 'txt' ? t.text : <span key={i} className={`t-${t.kind}`}>{t.text}</span>))}
    </>
  )
}

export function Code({
  code,
  lang,
  lines = false,
  markLine,
  activeLine,
  label,
  className = '',
}: {
  code: string
  lang: Lang
  lines?: boolean
  markLine?: number
  activeLine?: number
  label?: string
  className?: string
}) {
  if (!lines) {
    return (
      <pre className={`code-block ${className}`} aria-label={label}>
        <code><Tokens code={code} lang={lang} /></code>
      </pre>
    )
  }
  const rows = code.split('\n')
  return (
    <div className={`code-block code-numbered ${className}`} aria-label={label}>
      {rows.map((line, i) => {
        const no = i + 1
        const cls = ['code-row', markLine === no ? 'mark' : '', activeLine === no ? 'active' : '']
          .filter(Boolean)
          .join(' ')
        return (
          <div key={i} className={cls}>
            <span className="code-no" aria-hidden="true">{no}</span>
            <code className="code-src"><Tokens code={line || ' '} lang={lang} /></code>
          </div>
        )
      })}
    </div>
  )
}
