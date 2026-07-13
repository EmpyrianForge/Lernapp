// Datums-Helfer auf Tages-Granularität (ISO YYYY-MM-DD, lokale Zeit).
// Bewusst ohne Bibliothek — der Bedarf ist minimal (YAGNI, 05-Lernstrategie).

/** Fixer Prüfungstermin AP1 (harter Deadline-Cap für den Scheduler). */
export const EXAM_DATE = '2026-09-30'

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n)
}

/** Heutiges lokales Datum als ISO YYYY-MM-DD. */
export function todayISO(): string {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function toDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** iso + days (kann negativ sein) → ISO YYYY-MM-DD. */
export function addDays(iso: string, days: number): string {
  const d = toDate(iso)
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Ganze Tage von a nach b (b − a). Negativ, wenn b vor a liegt. */
export function daysBetween(a: string, b: string): number {
  const MS = 24 * 60 * 60 * 1000
  return Math.round((toDate(b).getTime() - toDate(a).getTime()) / MS)
}

/** Verbleibende Tage bis zur Prüfung (ab heute). Nie negativ dargestellt < 0 möglich. */
export function daysUntilExam(from: string = todayISO()): number {
  return daysBetween(from, EXAM_DATE)
}

/** true, wenn die Karte an oder vor `today` fällig ist. */
export function isDue(due: string, today: string = todayISO()): boolean {
  return due <= today
}

/** Deutsches Kurzformat TT.MM.JJJJ für die Anzeige. */
export function formatDE(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}
