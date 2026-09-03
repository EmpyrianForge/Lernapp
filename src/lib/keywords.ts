// Schlüsselbegriff-Abgleich für eingetippte Antworten: Welche Kernbegriffe der
// Musterlösung tauchen in der eigenen Antwort auf? Reiner HINWEIS zum Vergleichen —
// keine Bewertung. Die Note 1–4 vergibt der Lernende selbst (wie in der IHK-Prüfung
// gegen die Musterlösung). Bewusst simpel: Wortanfang-Vergleich fängt Beugungen ab
// („Verschlüsselung" ↔ „verschlüsselt"), ohne Sprachbibliothek.

const STOP = new Set([
  'aber', 'alle', 'allem', 'allen', 'aller', 'alles', 'also', 'andere', 'anderen', 'anders', 'auch',
  'bereits', 'besonders', 'bzw.', 'dabei', 'dadurch', 'dafür', 'dafuer', 'damit', 'danach', 'dann',
  'daran', 'darauf', 'daraus', 'darin', 'darum', 'davon', 'dazu', 'deren', 'dessen', 'diese', 'diesem',
  'diesen', 'dieser', 'dieses', 'durch', 'einem', 'einen', 'einer', 'eines', 'einmal', 'etwas',
  'gegen', 'genau', 'gleich', 'haben', 'heißt', 'heisst', 'hier', 'immer', 'indem', 'innerhalb', 'jede',
  'jedem', 'jeden', 'jeder', 'jedes', 'jedoch', 'kann', 'kannst', 'keine', 'keinem', 'keinen', 'keiner',
  'können', 'koennen', 'meist', 'meistens', 'muss', 'müssen', 'muessen', 'nach', 'neben', 'nicht',
  'nichts', 'noch', 'oder', 'ohne', 'schon', 'sehr', 'sein', 'seine', 'seinem', 'seinen', 'seiner',
  'sich', 'sind', 'soll', 'sollen', 'sollte', 'somit', 'sondern', 'sonst', 'sowie', 'sowohl', 'statt',
  'trotz', 'über', 'ueber', 'unter', 'viele', 'vielen', 'vieler', 'wenn', 'werden', 'wird', 'wobei',
  'wurde', 'wurden', 'zudem', 'zwischen', 'zwei', 'drei', 'vier', 'fünf', 'fuenf', 'sechs',
  'beispiel', 'beispielsweise', 'z.', 'b.', 'bzw', 'etc.', 'typischerweise', 'anschließend',
])

function looksLikeAbbrev(w: string): boolean {
  // Abkürzungen, Protokolle, Zahlen-Codes: TCP, IPv6, 2FA, SYN-ACK, 8760, SHA-256
  return /^[A-ZÄÖÜ0-9][A-Za-zÄÖÜäöü0-9\-/.]*$/.test(w) && /[A-Z0-9]/.test(w.slice(1)) && w.length >= 2
}

/** Bis zu `max` Kernbegriffe aus einem Text (Musterlösung), in Reihenfolge des Auftretens. */
export function keyTerms(text: string, max = 8): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of text.split(/[^\p{L}\p{N}\-/.]+/u)) {
    const w = raw.replace(/^[-/.]+|[-/.]+$/g, '')
    if (!w) continue
    const lower = w.toLowerCase()
    if (STOP.has(lower)) continue
    if (!looksLikeAbbrev(w) && lower.length < 5) continue
    if (seen.has(lower)) continue
    seen.add(lower)
    out.push(w)
    if (out.length >= max) break
  }
  return out
}

/** Welche Begriffe kommen in der Antwort vor (Wortanfang genügt), welche nicht. */
export function matchTerms(terms: string[], answer: string): { hit: string[]; miss: string[] } {
  const a = answer.toLowerCase()
  const hit: string[] = []
  const miss: string[] = []
  for (const t of terms) {
    const lower = t.toLowerCase()
    const stem = lower.slice(0, Math.max(Math.min(4, lower.length), Math.floor(lower.length * 0.75)))
    ;(a.includes(stem) ? hit : miss).push(t)
  }
  return { hit, miss }
}
