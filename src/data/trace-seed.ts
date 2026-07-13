import type { TraceItem } from '../types'

// Schreibtischtest-/Pseudocode-Aufgaben (type: "trace"). In AP1 Frühjahr 2025 war der
// Schreibtischtest die zweitgrößte Aufgabe (14 P, 4-fach verschachteltes If) —
// 02-Aufgabentypen-Operatoren.md / 03-Rechenschemata.md §8. Der Lerner führt eine
// Wertetabelle Zeile für Zeile mit und vergleicht mit der Musterlösung.

const base = {
  type: 'trace' as const,
  topicId: 'softwareentwicklung',
  operator: 'entwickeln' as const,
  afb: 'II',
  ap1Status: 'core' as const,
  examFrequency: 0.88,
  tags: ['ap1', 'softwareentwicklung', 'pseudocode', 'schreibtischtest'],
  source: 'Lernapp/03-Rechenschemata.md',
}

export const TRACE_ITEMS: TraceItem[] = [
  {
    ...base,
    id: 'trace--durchschnitt-schleife',
    points: 4,
    prompt:
      'Führe einen Schreibtischtest durch. Eingabe: zahlen = [4, 8, 2, 6]. Trage summe und durchschnitt Schritt für Schritt in die Wertetabelle ein und gib das Endergebnis an.',
    pseudocode: [
      'summe = 0',
      'FÜR i VON 0 BIS 3',
      '    summe = summe + zahlen[i]',
      'ENDE FÜR',
      'durchschnitt = summe / 4',
      'AUSGABE durchschnitt',
    ],
    columns: ['Durchlauf i', 'zahlen[i]', 'summe'],
    rows: [
      ['0', '4', '4'],
      ['1', '8', '12'],
      ['2', '2', '14'],
      ['3', '6', '20'],
    ],
    output: 'durchschnitt = 20 / 4 = 5',
    rubric: [
      { criterion: 'summe nach jedem Durchlauf korrekt (4/12/14/20)', points: 2 },
      { criterion: 'Endsumme 20', points: 1 },
      { criterion: 'durchschnitt = 5', points: 1 },
    ],
    pitfalls: ['Schleife läuft von 0 bis 3 = 4 Durchläufe', 'summe wird fortgeschrieben, nicht zurückgesetzt'],
  },
  {
    ...base,
    id: 'trace--maximum-finden',
    points: 3,
    prompt:
      'Schreibtischtest. Eingabe: werte = [3, 7, 2, 9, 5]. Verfolge max über alle Durchläufe und gib das Maximum aus.',
    pseudocode: [
      'max = werte[0]',
      'FÜR i VON 1 BIS 4',
      '    WENN werte[i] > max DANN',
      '        max = werte[i]',
      '    ENDE WENN',
      'ENDE FÜR',
      'AUSGABE max',
    ],
    columns: ['Durchlauf i', 'werte[i]', 'werte[i] > max?', 'max'],
    rows: [
      ['Start', '3', '—', '3'],
      ['1', '7', 'ja', '7'],
      ['2', '2', 'nein', '7'],
      ['3', '9', 'ja', '9'],
      ['4', '5', 'nein', '9'],
    ],
    output: 'max = 9',
    rubric: [
      { criterion: 'max startet mit werte[0] = 3', points: 1 },
      { criterion: 'Vergleiche korrekt (ja/nein) je Durchlauf', points: 1 },
      { criterion: 'Endergebnis max = 9', points: 1 },
    ],
    pitfalls: ['max mit dem ersten Element initialisieren, nicht mit 0', 'Schleife startet bei i = 1'],
  },
  {
    ...base,
    id: 'trace--rabattstaffel-if',
    points: 4,
    prompt:
      'Verschachteltes If: Bestimme den Rabatt in Prozent für bestellwert = 850 €. Trage die geprüften Bedingungen und das Ergebnis in die Wertetabelle ein.',
    pseudocode: [
      'WENN bestellwert >= 1000 DANN',
      '    rabatt = 15',
      'SONST WENN bestellwert >= 500 DANN',
      '    rabatt = 10',
      'SONST WENN bestellwert >= 100 DANN',
      '    rabatt = 5',
      'SONST',
      '    rabatt = 0',
      'ENDE WENN',
      'AUSGABE rabatt',
    ],
    columns: ['geprüfte Bedingung', 'erfüllt?', 'rabatt'],
    rows: [
      ['bestellwert >= 1000', 'nein (850 < 1000)', '—'],
      ['bestellwert >= 500', 'ja (850 >= 500)', '10'],
    ],
    output: 'rabatt = 10 (%)',
    rubric: [
      { criterion: 'erste Bedingung (>=1000) als nicht erfüllt erkannt', points: 1 },
      { criterion: 'zweite Bedingung (>=500) als erfüllt erkannt', points: 1 },
      { criterion: 'Abbruch der Kette nach dem ersten Treffer', points: 1 },
      { criterion: 'rabatt = 10 %', points: 1 },
    ],
    pitfalls: ['Bei SONST-WENN wird nach dem ersten Treffer abgebrochen — nicht weiterprüfen', 'Reihenfolge der Bedingungen (von groß nach klein) beachten'],
  },
  {
    ...base,
    id: 'trace--fakultaet',
    points: 3,
    prompt:
      'Schreibtischtest. Berechne 4! (Fakultät). Verfolge fakultaet über alle Durchläufe und gib das Ergebnis an.',
    pseudocode: [
      'fakultaet = 1',
      'FÜR i VON 1 BIS 4',
      '    fakultaet = fakultaet * i',
      'ENDE FÜR',
      'AUSGABE fakultaet',
    ],
    columns: ['Durchlauf i', 'fakultaet = fakultaet · i'],
    rows: [
      ['1', '1 · 1 = 1'],
      ['2', '1 · 2 = 2'],
      ['3', '2 · 3 = 6'],
      ['4', '6 · 4 = 24'],
    ],
    output: 'fakultaet = 24',
    rubric: [
      { criterion: 'Zwischenwerte korrekt (1/2/6/24)', points: 2 },
      { criterion: 'Endergebnis 24', points: 1 },
    ],
    pitfalls: ['fakultaet mit 1 initialisieren (nicht 0 — sonst bleibt alles 0)', 'Produkt fortschreiben, nicht neu setzen'],
  },
  {
    ...base,
    id: 'trace--kapitalwachstum-while',
    points: 3,
    prompt:
      'Schreibtischtest (kopfgesteuerte Schleife). Ein Kapital von 1000 € wächst jährlich um 10 %. Verfolge kapital, bis es 1300 € übersteigt, und gib die Anzahl der Jahre an.',
    pseudocode: [
      'kapital = 1000',
      'jahre = 0',
      'SOLANGE kapital <= 1300',
      '    kapital = kapital * 1.1',
      '    jahre = jahre + 1',
      'ENDE SOLANGE',
      'AUSGABE jahre',
    ],
    columns: ['jahre', 'kapital (nach ·1,1)', 'kapital <= 1300?'],
    rows: [
      ['1', '1100', 'ja (weiter)'],
      ['2', '1210', 'ja (weiter)'],
      ['3', '1331', 'nein (Abbruch)'],
    ],
    output: 'jahre = 3 (kapital = 1331 €)',
    rubric: [
      { criterion: 'Zwischenwerte 1100 / 1210 / 1331', points: 2 },
      { criterion: 'Ergebnis 3 Jahre', points: 1 },
    ],
    pitfalls: ['kopfgesteuert: Bedingung wird VOR jedem Durchlauf geprüft', 'Abbruch, sobald kapital > 1300 (nach dem Erhöhen prüfen)'],
  },
]
