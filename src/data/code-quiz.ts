// "Was gibt der Code aus?" — Code-Schnipsel in Pseudocode/Java/Python, der Lerner
// tippt die Konsolenausgabe ein. Trainiert den Schreibtischtest (AP1-Kernstoff).
// Alle Ausgaben wurden durch echtes Ausführen der Python-Variante geprüft.

export interface CodeQuizTask {
  id: string
  title: string
  pseudocode: string
  java: string
  python: string
  output: string
}

export const CODE_QUIZ: CodeQuizTask[] = [
  {
    id: 'cq-summe',
    title: 'Summe 1 bis 5',
    pseudocode: 'summe = 0\nFÜR i VON 1 BIS 5\n    summe = summe + i\nENDE FÜR\nAUSGABE summe',
    java: 'int summe = 0;\nfor (int i = 1; i <= 5; i++) {\n    summe = summe + i;\n}\nSystem.out.println(summe);',
    python: 'summe = 0\nfor i in range(1, 6):\n    summe += i\nprint(summe)',
    output: '15',
  },
  {
    id: 'cq-fakultaet',
    title: 'Fakultät von 4',
    pseudocode: 'f = 1\nFÜR i VON 1 BIS 4\n    f = f * i\nENDE FÜR\nAUSGABE f',
    java: 'int f = 1;\nfor (int i = 1; i <= 4; i++) {\n    f = f * i;\n}\nSystem.out.println(f);',
    python: 'f = 1\nfor i in range(1, 5):\n    f *= i\nprint(f)',
    output: '24',
  },
  {
    id: 'cq-rabatt',
    title: 'Rabattstaffel (Wert 650)',
    pseudocode: 'bestellwert = 650\nWENN bestellwert >= 1000 DANN\n    rabatt = 15\nSONST WENN bestellwert >= 500 DANN\n    rabatt = 10\nSONST WENN bestellwert >= 100 DANN\n    rabatt = 5\nSONST\n    rabatt = 0\nENDE WENN\nAUSGABE rabatt',
    java: 'int bestellwert = 650;\nint rabatt;\nif (bestellwert >= 1000) {\n    rabatt = 15;\n} else if (bestellwert >= 500) {\n    rabatt = 10;\n} else if (bestellwert >= 100) {\n    rabatt = 5;\n} else {\n    rabatt = 0;\n}\nSystem.out.println(rabatt);',
    python: 'bestellwert = 650\nif bestellwert >= 1000:\n    rabatt = 15\nelif bestellwert >= 500:\n    rabatt = 10\nelif bestellwert >= 100:\n    rabatt = 5\nelse:\n    rabatt = 0\nprint(rabatt)',
    output: '10',
  },
  {
    id: 'cq-maximum',
    title: 'Maximum finden',
    pseudocode: 'werte = [3, 7, 2, 9, 5]\nmaximum = werte[0]\nFÜR JEDES w IN werte\n    WENN w > maximum DANN\n        maximum = w\n    ENDE WENN\nENDE FÜR\nAUSGABE maximum',
    java: 'int[] werte = {3, 7, 2, 9, 5};\nint maximum = werte[0];\nfor (int w : werte) {\n    if (w > maximum) {\n        maximum = w;\n    }\n}\nSystem.out.println(maximum);',
    python: 'werte = [3, 7, 2, 9, 5]\nmaximum = werte[0]\nfor w in werte:\n    if w > maximum:\n        maximum = w\nprint(maximum)',
    output: '9',
  },
  {
    id: 'cq-gerade',
    title: 'Gerade Zahlen zählen',
    pseudocode: 'zahlen = [4, 7, 10, 3, 6]\nanzahl = 0\nFÜR JEDES z IN zahlen\n    WENN z MOD 2 == 0 DANN\n        anzahl = anzahl + 1\n    ENDE WENN\nENDE FÜR\nAUSGABE anzahl',
    java: 'int[] zahlen = {4, 7, 10, 3, 6};\nint anzahl = 0;\nfor (int z : zahlen) {\n    if (z % 2 == 0) {\n        anzahl++;\n    }\n}\nSystem.out.println(anzahl);',
    python: 'zahlen = [4, 7, 10, 3, 6]\nanzahl = 0\nfor z in zahlen:\n    if z % 2 == 0:\n        anzahl += 1\nprint(anzahl)',
    output: '3',
  },
  {
    id: 'cq-rueckwaerts',
    title: 'Zähler rückwärts',
    pseudocode: 'ergebnis = ""\nFÜR i VON 3 BIS 1 SCHRITT -1\n    ergebnis = ergebnis + i\nENDE FÜR\nAUSGABE ergebnis',
    java: 'String ergebnis = "";\nfor (int i = 3; i >= 1; i--) {\n    ergebnis = ergebnis + i;\n}\nSystem.out.println(ergebnis);',
    python: 'ergebnis = ""\nfor i in range(3, 0, -1):\n    ergebnis += str(i)\nprint(ergebnis)',
    output: '321',
  },
  {
    id: 'cq-verschachtelt',
    title: 'Verschachtelte Schleife',
    pseudocode: 'summe = 0\nFÜR i VON 1 BIS 3\n    FÜR j VON 1 BIS 2\n        summe = summe + 1\n    ENDE FÜR\nENDE FÜR\nAUSGABE summe',
    java: 'int summe = 0;\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 2; j++) {\n        summe++;\n    }\n}\nSystem.out.println(summe);',
    python: 'summe = 0\nfor i in range(1, 4):\n    for j in range(1, 3):\n        summe += 1\nprint(summe)',
    output: '6',
  },
  {
    id: 'cq-konto',
    title: 'Konto (OOP)',
    pseudocode: 'KLASSE Konto\n    kontostand\n    METHODE einzahlen(b)\n        kontostand = kontostand + b\n    ENDE METHODE\nENDE KLASSE\n\nk = NEU Konto()\nk.einzahlen(50)\nk.einzahlen(20)\nAUSGABE k.kontostand',
    java: 'class Konto {\n    int kontostand = 0;\n    void einzahlen(int b) { kontostand += b; }\n}\n// ...\nKonto k = new Konto();\nk.einzahlen(50);\nk.einzahlen(20);\nSystem.out.println(k.kontostand);',
    python: 'class Konto:\n    def __init__(self):\n        self.kontostand = 0\n    def einzahlen(self, b):\n        self.kontostand += b\n\nk = Konto()\nk.einzahlen(50)\nk.einzahlen(20)\nprint(k.kontostand)',
    output: '70',
  },
]
