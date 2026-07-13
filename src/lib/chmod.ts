// Linux-Rechte (ugo+rwx) ↔ Oktal. Reine Funktionen, damit sie testbar sind.
// Grid = 3 Zeilen (user, group, others) × 3 Spalten (r, w, x) als boolean.

export type PermRow = [boolean, boolean, boolean]
export type PermGrid = [PermRow, PermRow, PermRow]

export function rowToDigit(row: PermRow): number {
  return (row[0] ? 4 : 0) + (row[1] ? 2 : 0) + (row[2] ? 1 : 0)
}

export function gridToOctal(grid: PermGrid): string {
  return grid.map(rowToDigit).join('')
}

export function rowToSymbol(row: PermRow): string {
  return (row[0] ? 'r' : '-') + (row[1] ? 'w' : '-') + (row[2] ? 'x' : '-')
}

export function gridToSymbolic(grid: PermGrid): string {
  return grid.map(rowToSymbol).join('')
}

export function digitToRow(d: number): PermRow {
  return [(d & 4) !== 0, (d & 2) !== 0, (d & 1) !== 0]
}

export function octalToGrid(oct: string): PermGrid {
  const [u, g, o] = oct.split('').map(Number)
  return [digitToRow(u), digitToRow(g), digitToRow(o)]
}

export const emptyGrid = (): PermGrid => [
  [false, false, false],
  [false, false, false],
  [false, false, false],
]

// Realistische Zielwerte für den Drill mit knapper Alltagsbedeutung.
export const CHMOD_TARGETS: { octal: string; hint: string }[] = [
  { octal: '755', hint: 'ausführbares Skript / Verzeichnis (Eigentümer alles, Rest lesen+ausführen)' },
  { octal: '644', hint: 'normale Datei (Eigentümer lesen+schreiben, Rest nur lesen)' },
  { octal: '600', hint: 'private Datei (nur Eigentümer lesen+schreiben, z. B. SSH-Key)' },
  { octal: '777', hint: 'alle Rechte für alle (unsicher!)' },
  { octal: '700', hint: 'nur der Eigentümer darf alles, sonst nichts' },
  { octal: '640', hint: 'Eigentümer lesen+schreiben, Gruppe nur lesen, andere nichts' },
  { octal: '750', hint: 'Eigentümer alles, Gruppe lesen+ausführen, andere nichts' },
  { octal: '664', hint: 'Eigentümer & Gruppe lesen+schreiben, andere nur lesen' },
]

export function randomTarget(exclude?: string): { octal: string; hint: string } {
  const pool = exclude ? CHMOD_TARGETS.filter((t) => t.octal !== exclude) : CHMOD_TARGETS
  return pool[Math.floor(Math.random() * pool.length)]
}
