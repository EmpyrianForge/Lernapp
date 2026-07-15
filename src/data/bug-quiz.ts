// "Fehler finden" — Code mit genau einem Bug. Der Lerner erkennt die Fehlerart.
// AP1-Fehlerarten: Syntax (Sprachregel verletzt, Compiler meldet) · Laufzeit
// (Programm bricht zur Laufzeit ab) · Logik (läuft, liefert aber falsches Ergebnis).
// Beispiele in Java (Berufsschul-Sprache), da Syntaxfehler sprachgebunden sind.

export type ErrorType = 'syntax' | 'laufzeit' | 'logik'

export interface BugQuizTask {
  id: string
  title: string
  code: string
  errorType: ErrorType
  buggyLine: number // 1-indexiert
  explanation: string
}

export const BUG_QUIZ: BugQuizTask[] = [
  {
    id: 'bug-semikolon',
    title: 'Summenschleife',
    code: 'int summe = 0\nfor (int i = 1; i <= 5; i++) {\n    summe = summe + i;\n}\nSystem.out.println(summe);',
    errorType: 'syntax',
    buggyLine: 1,
    explanation: 'In Zeile 1 fehlt das Semikolon nach `int summe = 0`. Das verstößt gegen die Sprachregel — der Compiler meldet einen Syntaxfehler, das Programm lässt sich gar nicht erst übersetzen.',
  },
  {
    id: 'bug-div0',
    title: 'Division',
    code: 'int a = 10;\nint b = 0;\nint ergebnis = a / b;\nSystem.out.println(ergebnis);',
    errorType: 'laufzeit',
    buggyLine: 3,
    explanation: 'Zeile 3 teilt durch 0. Der Code ist syntaktisch korrekt und kompiliert, aber zur Laufzeit bricht das Programm ab (ArithmeticException) — ein Laufzeitfehler.',
  },
  {
    id: 'bug-offbyone',
    title: 'Summe 1 bis 5',
    code: 'int summe = 0;\nfor (int i = 1; i < 5; i++) {\n    summe = summe + i;\n}\nSystem.out.println(summe);',
    errorType: 'logik',
    buggyLine: 2,
    explanation: 'Zeile 2 nutzt `i < 5` statt `i <= 5`, dadurch wird die 5 nicht mitgezählt. Das Programm läuft fehlerfrei, liefert aber ein falsches Ergebnis (10 statt 15) — ein Logikfehler.',
  },
  {
    id: 'bug-index',
    title: 'Array-Zugriff',
    code: 'int[] werte = {1, 2, 3};\nSystem.out.println(werte[3]);',
    errorType: 'laufzeit',
    buggyLine: 2,
    explanation: 'Das Array hat die Indizes 0, 1, 2. Zeile 2 greift auf Index 3 zu, den es nicht gibt. Kompiliert problemlos, stürzt aber zur Laufzeit ab (ArrayIndexOutOfBoundsException) — ein Laufzeitfehler.',
  },
  {
    id: 'bug-string',
    title: 'Textausgabe',
    code: 'System.out.println("Hallo);',
    errorType: 'syntax',
    buggyLine: 1,
    explanation: 'Das Anführungszeichen am Ende des Strings fehlt (`"Hallo)` statt `"Hallo")`). Verstoß gegen die Sprachregel → Syntaxfehler, der Compiler bricht ab.',
  },
  {
    id: 'bug-maxstart',
    title: 'Maximum finden',
    code: 'int[] werte = {-3, -7, -2};\nint max = 0;\nfor (int w : werte) {\n    if (w > max) max = w;\n}\nSystem.out.println(max);',
    errorType: 'logik',
    buggyLine: 2,
    explanation: 'Zeile 2 setzt den Startwert auf 0. Bei lauter negativen Werten ist keiner größer als 0, das Ergebnis bleibt 0 statt -2. Korrekt wäre `max = werte[0]`. Läuft fehlerfrei, aber falsch — Logikfehler.',
  },
]
