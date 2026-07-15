// OOP-Grundlagen als Lern-Lektionen mit Erklärung + Code in drei Formen:
// Pseudocode (AP1-Prüfungsform), Java (Berufsschule/IHK) und Python (zum Vergleich).
// Scope: AP1-Kern = Klasse/Objekt, Attribute, Methoden, Konstruktor, Kapselung/Sichtbarkeiten.
// Vererbung/Polymorphie = Vertiefung (über AP1 hinaus, für AP2).
// Durchgängiges Beispiel: eine Klasse "Konto".

export type OopLevel = 'ap1' | 'vertiefung'

export interface OopLesson {
  id: string
  title: string
  level: OopLevel
  explanation: string // Markdown (**fett**, `code`)
  pseudocode: string
  java: string
  python: string
}

export const OOP_LESSONS: OopLesson[] = [
  {
    id: 'klasse-objekt',
    title: 'Klasse vs. Objekt',
    level: 'ap1',
    explanation:
      'Eine **Klasse** ist der Bauplan (die Vorlage): Sie legt fest, welche Attribute und Methoden es gibt. Ein **Objekt** (Instanz) ist ein konkretes Exemplar dieser Klasse mit eigenen Werten. Beispiel: `Konto` ist der Bauplan, `meinKonto` ein konkretes Konto. Aus einer Klasse lassen sich beliebig viele Objekte erzeugen.',
    pseudocode:
      'KLASSE Konto\n    // Bauplan: hier stehen Attribute und Methoden\nENDE KLASSE\n\n// Objekt (Instanz) aus dem Bauplan erzeugen:\nmeinKonto = NEU Konto()',
    java:
      'class Konto {\n    // Bauplan: hier stehen Attribute und Methoden\n}\n\n// Objekt (Instanz) erzeugen:\nKonto meinKonto = new Konto();',
    python:
      'class Konto:\n    pass  # Bauplan: hier stehen Attribute und Methoden\n\n# Objekt (Instanz) erzeugen:\nmein_konto = Konto()',
  },
  {
    id: 'attribute',
    title: 'Attribute (Eigenschaften / Zustand)',
    level: 'ap1',
    explanation:
      '**Attribute** speichern den **Zustand** eines Objekts, also seine Daten. Jedes Objekt hat eigene Attributwerte: Ein Konto von Anna und eines von Ben haben denselben Bauplan, aber unterschiedliche Werte.',
    pseudocode:
      'KLASSE Konto\n    inhaber        // Attribut (Text)\n    kontostand     // Attribut (Zahl)\nENDE KLASSE',
    java:
      'class Konto {\n    String inhaber;      // Attribut\n    double kontostand;   // Attribut\n}',
    python:
      'class Konto:\n    def __init__(self):\n        self.inhaber = ""      # Attribut\n        self.kontostand = 0.0  # Attribut',
  },
  {
    id: 'methoden',
    title: 'Methoden (Verhalten)',
    level: 'ap1',
    explanation:
      '**Methoden** definieren das **Verhalten** — was ein Objekt tun kann. Sie arbeiten mit den Attributen des Objekts. Beispiel: Die Methode `einzahlen` erhöht den `kontostand`.',
    pseudocode:
      'KLASSE Konto\n    kontostand\n\n    METHODE einzahlen(betrag)\n        kontostand = kontostand + betrag\n    ENDE METHODE\nENDE KLASSE',
    java:
      'class Konto {\n    double kontostand;\n\n    void einzahlen(double betrag) {\n        kontostand = kontostand + betrag;\n    }\n}',
    python:
      'class Konto:\n    def __init__(self):\n        self.kontostand = 0.0\n\n    def einzahlen(self, betrag):\n        self.kontostand += betrag',
  },
  {
    id: 'konstruktor',
    title: 'Konstruktor & Instanziierung',
    level: 'ap1',
    explanation:
      'Der **Konstruktor** initialisiert ein neues Objekt — er setzt die Startwerte der Attribute. Beim **Instanziieren** (Objekt erzeugen) wird er automatisch aufgerufen. So bekommt jedes Konto direkt seinen Inhaber.',
    pseudocode:
      'KLASSE Konto\n    inhaber\n    kontostand\n\n    KONSTRUKTOR Konto(name)\n        inhaber = name\n        kontostand = 0\n    ENDE KONSTRUKTOR\nENDE KLASSE\n\nmeinKonto = NEU Konto("Anna")',
    java:
      'class Konto {\n    String inhaber;\n    double kontostand;\n\n    Konto(String name) {        // Konstruktor\n        inhaber = name;\n        kontostand = 0;\n    }\n}\n\nKonto meinKonto = new Konto("Anna");',
    python:
      'class Konto:\n    def __init__(self, name):    # Konstruktor\n        self.inhaber = name\n        self.kontostand = 0\n\nmein_konto = Konto("Anna")',
  },
  {
    id: 'kapselung',
    title: 'Kapselung & Sichtbarkeiten',
    level: 'ap1',
    explanation:
      '**Kapselung** = die Attribute nach außen verbergen (`private`) und den Zugriff nur über definierte Methoden (Getter/Setter) erlauben. **Sichtbarkeiten:** `private` = nur innerhalb der Klasse, `public` = überall nutzbar. Vorteil: Der Zustand ist vor unkontrollierten/ungültigen Änderungen geschützt (hier: keine negative Einzahlung).\n\nHinweis: In **Python** gibt es kein echtes `private` — das führende `__` ist nur Konvention. Genau deshalb zeigt **Java** den Prüfungsbegriff deutlicher.',
    pseudocode:
      'KLASSE Konto\n    PRIVAT kontostand\n\n    ÖFFENTLICH METHODE einzahlen(betrag)\n        WENN betrag > 0 DANN\n            kontostand = kontostand + betrag\n        ENDE WENN\n    ENDE METHODE\n\n    ÖFFENTLICH METHODE getKontostand()\n        RÜCKGABE kontostand\n    ENDE METHODE\nENDE KLASSE',
    java:
      'class Konto {\n    private double kontostand;               // gekapselt\n\n    public void einzahlen(double betrag) {   // öffentlich\n        if (betrag > 0) {\n            kontostand += betrag;\n        }\n    }\n\n    public double getKontostand() {          // Getter\n        return kontostand;\n    }\n}',
    python:
      'class Konto:\n    def __init__(self):\n        self.__kontostand = 0.0            # "private" (nur Konvention)\n\n    def einzahlen(self, betrag):          # öffentlich\n        if betrag > 0:\n            self.__kontostand += betrag\n\n    def get_kontostand(self):             # Getter\n        return self.__kontostand',
  },
  {
    id: 'vererbung',
    title: 'Vererbung',
    level: 'vertiefung',
    explanation:
      '*(Über AP1 hinaus — für AP2.)* Eine **Unterklasse** erbt Attribute und Methoden einer **Oberklasse** und kann sie erweitern. Es ist eine „ist-ein"-Beziehung: Ein `Sparkonto` **ist ein** `Konto` und ergänzt nur den Zinssatz. So wird Code wiederverwendet statt kopiert.',
    pseudocode:
      'KLASSE Sparkonto ERBT VON Konto\n    zinssatz\n\n    METHODE zinsenGutschreiben()\n        einzahlen(getKontostand() * zinssatz)\n    ENDE METHODE\nENDE KLASSE',
    java:
      'class Sparkonto extends Konto {\n    double zinssatz;\n\n    void zinsenGutschreiben() {\n        einzahlen(getKontostand() * zinssatz);\n    }\n}',
    python:
      'class Sparkonto(Konto):\n    def __init__(self):\n        super().__init__()      # Oberklasse initialisieren\n        self.zinssatz = 0.0\n\n    def zinsen_gutschreiben(self):\n        self.einzahlen(self.get_kontostand() * self.zinssatz)',
  },
  {
    id: 'polymorphie',
    title: 'Polymorphie',
    level: 'vertiefung',
    explanation:
      '*(Über AP1 hinaus — für AP2.)* **Polymorphie** („Vielgestaltigkeit"): Derselbe Methodenaufruf führt je nach konkretem Objekttyp zu unterschiedlichem Verhalten — meist durch **Überschreiben** (Overriding) einer Methode in der Unterklasse. So kann man verschiedene Objekte einheitlich behandeln.',
    pseudocode:
      'KLASSE Konto\n    METHODE beschreibung()\n        RÜCKGABE "Konto"\n    ENDE METHODE\nENDE KLASSE\n\nKLASSE Sparkonto ERBT VON Konto\n    METHODE beschreibung()      // überschreibt\n        RÜCKGABE "Sparkonto"\n    ENDE METHODE\nENDE KLASSE\n\n// gleicher Aufruf, je nach Objekt anderes Ergebnis',
    java:
      'class Konto {\n    String beschreibung() { return "Konto"; }\n}\n\nclass Sparkonto extends Konto {\n    @Override\n    String beschreibung() { return "Sparkonto"; }\n}',
    python:
      'class Konto:\n    def beschreibung(self):\n        return "Konto"\n\nclass Sparkonto(Konto):\n    def beschreibung(self):      # überschreibt\n        return "Sparkonto"',
  },
]
