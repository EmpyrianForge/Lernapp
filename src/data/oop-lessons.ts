// OOP-Kurs: Grundlagen der objektorientierten Programmierung mit Erklärung, Merksätzen
// und Code in drei Formen: Pseudocode (AP1-Prüfungsform), Java (Berufsschule/IHK), Python.
// Lauffähige Beispiele tragen eine geprüfte Konsolenausgabe (output).
// Scope: AP1-Kern (Grundlagen/Struktur) + klar markierte Vertiefung (AP2: Vererbung/Polymorphie/…).
// Durchgängiges Beispiel: eine Klasse "Konto" (plus Artikel/Fahrzeug für Listen & Polymorphie).

export type OopLevel = 'ap1' | 'vertiefung'

export interface OopLesson {
  id: string
  title: string
  section: string
  level: OopLevel
  explanation: string // Markdown (**fett**, `code`)
  keyPoints: string[]
  pseudocode: string
  java: string
  python: string
  output?: string // Konsolenausgabe (bei lauffähigem Programm)
}

const S_GRUND = 'Grundlagen'
const S_STRUKTUR = 'Struktur & Beziehungen'
const S_VERTIEF = 'Vertiefung (AP2)'

export const OOP_LESSONS: OopLesson[] = [
  {
    id: 'klasse-objekt',
    title: 'Klasse vs. Objekt',
    section: S_GRUND,
    level: 'ap1',
    explanation:
      'Eine **Klasse** ist der Bauplan (die Vorlage): Sie legt fest, welche Attribute und Methoden es gibt. Ein **Objekt** (Instanz) ist ein konkretes Exemplar mit eigenen Werten. Aus einer Klasse lassen sich beliebig viele Objekte erzeugen — `Konto` ist der Bauplan, `meinKonto` ein konkretes Konto.',
    keyPoints: ['Klasse = Bauplan, Objekt = konkrete Instanz', 'Objekt erzeugen = „instanziieren" (Schlüsselwort `new`/`NEU`)'],
    pseudocode: 'KLASSE Konto\n    // Bauplan: hier stehen Attribute und Methoden\nENDE KLASSE\n\n// Objekt (Instanz) aus dem Bauplan erzeugen:\nmeinKonto = NEU Konto()',
    java: 'class Konto {\n    // Bauplan: hier stehen Attribute und Methoden\n}\n\n// Objekt (Instanz) erzeugen:\nKonto meinKonto = new Konto();',
    python: 'class Konto:\n    pass  # Bauplan: hier stehen Attribute und Methoden\n\n# Objekt (Instanz) erzeugen:\nmein_konto = Konto()',
  },
  {
    id: 'attribute',
    title: 'Attribute (Zustand)',
    section: S_GRUND,
    level: 'ap1',
    explanation:
      '**Attribute** speichern den **Zustand** eines Objekts — seine Daten. Jedes Objekt hat eigene Attributwerte: Ein Konto von Anna und eines von Ben teilen denselben Bauplan, haben aber unterschiedliche Werte.',
    keyPoints: ['Attribute = die Daten/Eigenschaften eines Objekts', 'Jedes Objekt hält seine eigenen Werte'],
    pseudocode: 'KLASSE Konto\n    inhaber        // Attribut (Text)\n    kontostand     // Attribut (Zahl)\nENDE KLASSE',
    java: 'class Konto {\n    String inhaber;      // Attribut\n    double kontostand;   // Attribut\n}',
    python: 'class Konto:\n    def __init__(self):\n        self.inhaber = ""      # Attribut\n        self.kontostand = 0.0  # Attribut',
  },
  {
    id: 'methoden',
    title: 'Methoden (Verhalten)',
    section: S_GRUND,
    level: 'ap1',
    explanation:
      '**Methoden** definieren das **Verhalten** — was ein Objekt tun kann. Sie arbeiten mit den Attributen des Objekts. Hier erhöht `einzahlen` den `kontostand`. Zwei Einzahlungen (50 + 20) ergeben 70.',
    keyPoints: ['Methode = Funktion, die zum Objekt gehört', 'Methoden lesen/ändern den Zustand (Attribute)'],
    pseudocode: 'KLASSE Konto\n    kontostand\n\n    METHODE einzahlen(betrag)\n        kontostand = kontostand + betrag\n    ENDE METHODE\nENDE KLASSE\n\nk = NEU Konto()\nk.einzahlen(50)\nk.einzahlen(20)\nAUSGABE k.kontostand',
    java: 'class Konto {\n    double kontostand;\n\n    void einzahlen(double betrag) {\n        kontostand = kontostand + betrag;\n    }\n\n    public static void main(String[] args) {\n        Konto k = new Konto();\n        k.einzahlen(50);\n        k.einzahlen(20);\n        System.out.println(k.kontostand);\n    }\n}',
    python: 'class Konto:\n    def __init__(self):\n        self.kontostand = 0.0\n\n    def einzahlen(self, betrag):\n        self.kontostand += betrag\n\nk = Konto()\nk.einzahlen(50)\nk.einzahlen(20)\nprint(k.kontostand)',
    output: '70.0',
  },
  {
    id: 'konstruktor',
    title: 'Konstruktor & Instanziierung',
    section: S_GRUND,
    level: 'ap1',
    explanation:
      'Der **Konstruktor** initialisiert ein neues Objekt — er setzt die Startwerte der Attribute. Beim **Instanziieren** wird er automatisch aufgerufen, so bekommt jedes Konto direkt seinen Inhaber. In Java trägt er den Klassennamen, in Python heißt er `__init__`.',
    keyPoints: ['Konstruktor setzt die Startwerte beim Erzeugen', 'Java: gleicher Name wie Klasse · Python: `__init__`'],
    pseudocode: 'KLASSE Konto\n    inhaber\n    kontostand\n\n    KONSTRUKTOR Konto(name)\n        inhaber = name\n        kontostand = 0\n    ENDE KONSTRUKTOR\nENDE KLASSE\n\nmeinKonto = NEU Konto("Anna")',
    java: 'class Konto {\n    String inhaber;\n    double kontostand;\n\n    Konto(String name) {        // Konstruktor\n        inhaber = name;\n        kontostand = 0;\n    }\n}\n\nKonto meinKonto = new Konto("Anna");',
    python: 'class Konto:\n    def __init__(self, name):    # Konstruktor\n        self.inhaber = name\n        self.kontostand = 0\n\nmein_konto = Konto("Anna")',
  },
  {
    id: 'this-self',
    title: 'this / self (Objektreferenz)',
    section: S_GRUND,
    level: 'ap1',
    explanation:
      '`this` (Java) bzw. `self` (Python) ist die Referenz auf **das aktuelle Objekt**. Man braucht es, um innerhalb einer Methode auf die eigenen Attribute zuzugreifen — besonders, wenn Parameter genauso heißen wie ein Attribut (`this.inhaber = inhaber`).',
    keyPoints: ['`this`/`self` = „dieses Objekt"', 'Trennt Attribut von gleichnamigem Parameter', 'In Python ist `self` immer der erste Methodenparameter'],
    pseudocode: 'KLASSE Konto\n    inhaber\n\n    KONSTRUKTOR Konto(inhaber)\n        DIESES.inhaber = inhaber   // Attribut = Parameter\n    ENDE KONSTRUKTOR\nENDE KLASSE',
    java: 'class Konto {\n    String inhaber;\n\n    Konto(String inhaber) {\n        this.inhaber = inhaber;   // this.inhaber = Attribut\n    }\n}',
    python: 'class Konto:\n    def __init__(self, inhaber):\n        self.inhaber = inhaber   # self.inhaber = Attribut',
  },
  {
    id: 'kapselung',
    title: 'Kapselung & Sichtbarkeiten',
    section: S_GRUND,
    level: 'ap1',
    explanation:
      '**Kapselung** = Attribute nach außen verbergen (`private`) und Zugriff nur über definierte Methoden erlauben. **Sichtbarkeiten:** `private` = nur innerhalb der Klasse, `public` = überall. So ist der Zustand vor ungültigen Änderungen geschützt (hier: keine negative Einzahlung).\n\nHinweis: **Python** kennt kein echtes `private` — das führende `__` ist nur Konvention. Genau deshalb zeigt **Java** den Prüfungsbegriff deutlicher.',
    keyPoints: ['`private` schützt Attribute vor direktem Zugriff von außen', '`public` = überall nutzbar', 'Zugriff nur über Methoden = kontrolliert/validierbar'],
    pseudocode: 'KLASSE Konto\n    PRIVAT kontostand\n\n    ÖFFENTLICH METHODE einzahlen(betrag)\n        WENN betrag > 0 DANN\n            kontostand = kontostand + betrag\n        ENDE WENN\n    ENDE METHODE\nENDE KLASSE',
    java: 'class Konto {\n    private double kontostand;               // gekapselt\n\n    public void einzahlen(double betrag) {   // öffentlich\n        if (betrag > 0) {\n            kontostand += betrag;\n        }\n    }\n}',
    python: 'class Konto:\n    def __init__(self):\n        self.__kontostand = 0.0            # "private" (nur Konvention)\n\n    def einzahlen(self, betrag):          # öffentlich\n        if betrag > 0:\n            self.__kontostand += betrag',
  },
  {
    id: 'getter-setter',
    title: 'Getter & Setter (mit Validierung)',
    section: S_GRUND,
    level: 'ap1',
    explanation:
      'Da gekapselte (`private`) Attribute von außen nicht direkt lesbar/änderbar sind, bietet man **Getter** (Wert lesen) und **Setter** (Wert setzen) an. Der große Vorteil des Setters: Er kann **prüfen/validieren**, bevor er speichert — ungültige Werte werden abgewiesen.',
    keyPoints: ['Getter = lesen, Setter = schreiben (kontrolliert)', 'Setter kann Werte validieren (z. B. keine negativen)', 'Java-Konvention: `getX()` / `setX()`'],
    pseudocode: 'KLASSE Konto\n    PRIVAT kontostand\n\n    METHODE getKontostand()\n        RÜCKGABE kontostand\n    ENDE METHODE\n\n    METHODE setKontostand(wert)\n        WENN wert >= 0 DANN       // Validierung\n            kontostand = wert\n        ENDE WENN\n    ENDE METHODE\nENDE KLASSE',
    java: 'class Konto {\n    private double kontostand;\n\n    public double getKontostand() {          // Getter\n        return kontostand;\n    }\n\n    public void setKontostand(double wert) { // Setter\n        if (wert >= 0) {                     // Validierung\n            kontostand = wert;\n        }\n    }\n}',
    python: 'class Konto:\n    def __init__(self):\n        self.__kontostand = 0.0\n\n    def get_kontostand(self):            # Getter\n        return self.__kontostand\n\n    def set_kontostand(self, wert):      # Setter\n        if wert >= 0:                    # Validierung\n            self.__kontostand = wert',
  },
  {
    id: 'statisch',
    title: 'Statische Member (static)',
    section: S_GRUND,
    level: 'ap1',
    explanation:
      'Ein **statisches** Attribut/eine statische Methode gehört zur **Klasse selbst**, nicht zu einem einzelnen Objekt — alle Objekte teilen sich denselben Wert. Klassiker: ein Zähler, der mitzählt, wie viele Objekte erzeugt wurden. Zwei Konten → `anzahl` = 2.',
    keyPoints: ['Statisch = gehört der Klasse, nicht dem Objekt', 'Alle Objekte teilen sich den einen Wert', 'Zugriff über den Klassennamen (`Konto.anzahl`)'],
    pseudocode: 'KLASSE Konto\n    STATISCH anzahl = 0        // Klassenattribut\n\n    KONSTRUKTOR Konto()\n        anzahl = anzahl + 1\n    ENDE KONSTRUKTOR\nENDE KLASSE\n\na = NEU Konto()\nb = NEU Konto()\nAUSGABE Konto.anzahl',
    java: 'class Konto {\n    static int anzahl = 0;      // Klassenattribut\n\n    Konto() {\n        anzahl++;\n    }\n\n    public static void main(String[] args) {\n        new Konto();\n        new Konto();\n        System.out.println("Konten gesamt: " + Konto.anzahl);\n    }\n}',
    python: 'class Konto:\n    anzahl = 0                  # Klassenattribut (statisch)\n\n    def __init__(self):\n        Konto.anzahl += 1\n\nKonto()\nKonto()\nprint("Konten gesamt:", Konto.anzahl)',
    output: 'Konten gesamt: 2',
  },
  {
    id: 'objektlisten',
    title: 'Mehrere Objekte & Objektlisten',
    section: S_STRUKTUR,
    level: 'ap1',
    explanation:
      'In der Praxis arbeitet man mit **vielen Objekten** — z. B. einer Liste von Artikeln im Warenkorb. Man legt die Objekte in einem Array/einer Liste ab und verarbeitet sie in einer Schleife, etwa um die Gesamtsumme zu berechnen (15 + 25 + 5 = 45).',
    keyPoints: ['Objekte lassen sich in Listen/Arrays sammeln', 'Schleife über die Liste = alle Objekte verarbeiten', 'Zugriff aufs Attribut je Objekt: `a.preis`'],
    pseudocode: 'KLASSE Artikel\n    name\n    preis\n    KONSTRUKTOR Artikel(name, preis)\n        DIESES.name = name\n        DIESES.preis = preis\n    ENDE KONSTRUKTOR\nENDE KLASSE\n\nwarenkorb = [NEU Artikel("Maus", 15), NEU Artikel("Tastatur", 25), NEU Artikel("Kabel", 5)]\nsumme = 0\nFÜR JEDES a IN warenkorb\n    summe = summe + a.preis\nENDE FÜR\nAUSGABE summe',
    java: 'class Artikel {\n    String name;\n    double preis;\n    Artikel(String name, double preis) {\n        this.name = name;\n        this.preis = preis;\n    }\n\n    public static void main(String[] args) {\n        Artikel[] warenkorb = {\n            new Artikel("Maus", 15), new Artikel("Tastatur", 25), new Artikel("Kabel", 5)\n        };\n        double summe = 0;\n        for (Artikel a : warenkorb) {\n            summe += a.preis;\n        }\n        System.out.println("Summe: " + summe + " EUR");\n    }\n}',
    python: 'class Artikel:\n    def __init__(self, name, preis):\n        self.name = name\n        self.preis = preis\n\nwarenkorb = [Artikel("Maus", 15.0), Artikel("Tastatur", 25.0), Artikel("Kabel", 5.0)]\nsumme = 0\nfor a in warenkorb:\n    summe += a.preis\nprint("Summe:", summe, "EUR")',
    output: 'Summe: 45.0 EUR',
  },
  {
    id: 'beziehungen',
    title: 'Assoziation / Aggregation / Komposition',
    section: S_STRUKTUR,
    level: 'ap1',
    explanation:
      'Objekte stehen in **Beziehungen** zueinander:\n**Assoziation** = allgemeine „kennt/nutzt"-Beziehung.\n**Aggregation** = Teil-Ganzes, die Teile leben unabhängig weiter (schwache „hat"-Beziehung, z. B. Kunde ↔ Konten).\n**Komposition** = starke Teil-Ganzes-Beziehung, die Teile sterben mit dem Ganzen (z. B. Rechnung ↔ Rechnungsposten).',
    keyPoints: ['Assoziation: kennt/nutzt', 'Aggregation: „hat", Teile existieren unabhängig', 'Komposition: existenzabhängig — Teil stirbt mit dem Ganzen'],
    pseudocode: '// Aggregation: ein Kunde HAT mehrere Konten (Konten existieren unabhängig)\nKLASSE Kunde\n    name\n    konten    // Liste von Konto-Objekten\nENDE KLASSE',
    java: '// Aggregation: ein Kunde HAT mehrere Konten\nclass Kunde {\n    String name;\n    List<Konto> konten = new ArrayList<>();\n}',
    python: '# Aggregation: ein Kunde HAT mehrere Konten\nclass Kunde:\n    def __init__(self, name):\n        self.name = name\n        self.konten = []          # Liste von Konto-Objekten',
  },
  {
    id: 'uml',
    title: 'UML-Klassendiagramm → Code',
    section: S_STRUKTUR,
    level: 'ap1',
    explanation:
      'Ein **UML-Klassendiagramm** beschreibt eine Klasse in drei Feldern: Name, Attribute, Methoden. Die Sichtbarkeit steht als Zeichen davor: `-` = private, `+` = public. Aus dem Diagramm lässt sich der Code direkt ableiten — genau das wird in der AP1 verlangt.',
    keyPoints: ['3 Felder: Name · Attribute · Methoden', '`-` = private, `+` = public, `#` = protected', 'Diagramm ↔ Code ist beidseitig ableitbar'],
    pseudocode: '+---------------------+\n|        Konto        |   <- Klassenname\n+---------------------+\n| - kontostand: Zahl  |   <- Attribute (- = privat)\n| + inhaber: Text     |\n+---------------------+\n| + einzahlen(betrag) |   <- Methoden (+ = öffentlich)\n| + getKontostand()   |\n+---------------------+',
    java: 'class Konto {\n    private double kontostand;   // - kontostand\n    public String inhaber;       // + inhaber\n\n    public void einzahlen(double betrag) { /* ... */ }\n    public double getKontostand() { return kontostand; }\n}',
    python: 'class Konto:\n    def __init__(self):\n        self.__kontostand = 0.0   # - kontostand (privat)\n        self.inhaber = ""         # + inhaber (öffentlich)\n\n    def einzahlen(self, betrag): ...\n    def get_kontostand(self):\n        return self.__kontostand',
  },
  {
    id: 'komplettbeispiel',
    title: 'Komplettbeispiel: lauffähiges Konto-Programm',
    section: S_STRUKTUR,
    level: 'ap1',
    explanation:
      'Alles zusammen in einem **vollständigen, lauffähigen Programm**: Konstruktor, gekapselter Kontostand, Ein-/Auszahlen mit Prüfung, Getter — und ein Hauptprogramm, das das Objekt benutzt. Anna zahlt 100 ein, hebt 30 ab → 70.',
    keyPoints: ['Konstruktor + Kapselung + Methoden + Getter im Zusammenspiel', 'auszahlen prüft: nicht mehr als vorhanden', 'Das Hauptprogramm (main) erzeugt und nutzt das Objekt'],
    pseudocode: 'KLASSE Konto\n    inhaber\n    PRIVAT kontostand\n\n    KONSTRUKTOR Konto(inhaber)\n        DIESES.inhaber = inhaber\n        kontostand = 0\n    ENDE KONSTRUKTOR\n\n    METHODE einzahlen(betrag)\n        WENN betrag > 0 DANN kontostand = kontostand + betrag\n    ENDE METHODE\n\n    METHODE auszahlen(betrag)\n        WENN betrag > 0 UND betrag <= kontostand DANN\n            kontostand = kontostand - betrag\n        ENDE WENN\n    ENDE METHODE\n\n    METHODE getKontostand()\n        RÜCKGABE kontostand\n    ENDE METHODE\nENDE KLASSE\n\nHAUPTPROGRAMM\n    k = NEU Konto("Anna")\n    k.einzahlen(100)\n    k.auszahlen(30)\n    AUSGABE k.inhaber, ":", k.getKontostand(), "EUR"\nENDE',
    java: 'public class Konto {\n    String inhaber;\n    private double kontostand;\n\n    Konto(String inhaber) {\n        this.inhaber = inhaber;\n        this.kontostand = 0.0;\n    }\n\n    void einzahlen(double betrag) {\n        if (betrag > 0) kontostand += betrag;\n    }\n\n    boolean auszahlen(double betrag) {\n        if (betrag > 0 && betrag <= kontostand) {\n            kontostand -= betrag;\n            return true;\n        }\n        return false;\n    }\n\n    double getKontostand() { return kontostand; }\n\n    public static void main(String[] args) {\n        Konto k = new Konto("Anna");\n        k.einzahlen(100);\n        k.auszahlen(30);\n        System.out.println(k.inhaber + ": " + k.getKontostand() + " EUR");\n    }\n}',
    python: 'class Konto:\n    def __init__(self, inhaber):\n        self.inhaber = inhaber\n        self.__kontostand = 0.0\n\n    def einzahlen(self, betrag):\n        if betrag > 0:\n            self.__kontostand += betrag\n\n    def auszahlen(self, betrag):\n        if 0 < betrag <= self.__kontostand:\n            self.__kontostand -= betrag\n            return True\n        return False\n\n    def get_kontostand(self):\n        return self.__kontostand\n\n\nk = Konto("Anna")\nk.einzahlen(100)\nk.auszahlen(30)\nprint(k.inhaber, ":", k.get_kontostand(), "EUR")',
    output: 'Anna : 70.0 EUR',
  },
  {
    id: 'vererbung',
    title: 'Vererbung',
    section: S_VERTIEF,
    level: 'vertiefung',
    explanation:
      '*(Über AP1 hinaus — für AP2.)* Eine **Unterklasse** erbt Attribute und Methoden einer **Oberklasse** und ergänzt sie. „ist-ein"-Beziehung: Ein `Sparkonto` **ist ein** `Konto` und fügt nur den Zinssatz hinzu. So wird Code wiederverwendet statt kopiert.',
    keyPoints: ['„ist-ein"-Beziehung (Sparkonto ist ein Konto)', 'Unterklasse erbt alles der Oberklasse', 'Java: `extends` · Python: `class Sub(Super)`'],
    pseudocode: 'KLASSE Sparkonto ERBT VON Konto\n    zinssatz\n\n    METHODE zinsenGutschreiben()\n        einzahlen(getKontostand() * zinssatz)\n    ENDE METHODE\nENDE KLASSE',
    java: 'class Sparkonto extends Konto {\n    double zinssatz;\n\n    void zinsenGutschreiben() {\n        einzahlen(getKontostand() * zinssatz);\n    }\n}',
    python: 'class Sparkonto(Konto):\n    def __init__(self, inhaber):\n        super().__init__(inhaber)   # Oberklasse initialisieren\n        self.zinssatz = 0.0\n\n    def zinsen_gutschreiben(self):\n        self.einzahlen(self.get_kontostand() * self.zinssatz)',
  },
  {
    id: 'polymorphie',
    title: 'Polymorphie (Overriding)',
    section: S_VERTIEF,
    level: 'vertiefung',
    explanation:
      '*(Über AP1 hinaus — für AP2.)* **Polymorphie** („Vielgestaltigkeit"): Derselbe Methodenaufruf führt je nach konkretem Objekttyp zu unterschiedlichem Verhalten — meist durch **Überschreiben** (Overriding) in der Unterklasse. Man kann verschiedene Objekte in einer Liste einheitlich behandeln und bekommt trotzdem je Typ das passende Ergebnis.',
    keyPoints: ['Gleicher Aufruf, je nach Objekttyp anderes Verhalten', 'Umsetzung: Methode in der Unterklasse überschreiben', 'Ermöglicht einheitliche Behandlung verschiedener Typen'],
    pseudocode: 'KLASSE Konto\n    METHODE beschreibung()\n        RÜCKGABE "Konto"\n    ENDE METHODE\nENDE KLASSE\n\nKLASSE Sparkonto ERBT VON Konto\n    METHODE beschreibung()      // überschreibt\n        RÜCKGABE "Sparkonto"\n    ENDE METHODE\nENDE KLASSE\n\nFÜR JEDES k IN [NEU Konto(), NEU Sparkonto()]\n    AUSGABE k.beschreibung()\nENDE FÜR',
    java: 'class Konto {\n    String beschreibung() { return "Konto"; }\n}\n\nclass Sparkonto extends Konto {\n    @Override\n    String beschreibung() { return "Sparkonto"; }\n}\n\n// Aufruf:\n// for (Konto k : new Konto[]{ new Konto(), new Sparkonto() })\n//     System.out.println(k.beschreibung());',
    python: 'class Konto:\n    def beschreibung(self):\n        return "Konto"\n\nclass Sparkonto(Konto):\n    def beschreibung(self):      # überschreibt\n        return "Sparkonto"\n\nfor k in [Konto(), Sparkonto()]:\n    print(k.beschreibung())',
    output: 'Konto\nSparkonto',
  },
  {
    id: 'abstrakt-interface',
    title: 'Abstrakte Klasse & Interface',
    section: S_VERTIEF,
    level: 'vertiefung',
    explanation:
      '*(Über AP1 hinaus — für AP2.)* Eine **abstrakte Klasse** gibt eine Methode nur vor, ohne sie auszuprogrammieren — die Unterklassen **müssen** sie ausfüllen. Ein **Interface** ist ein reiner „Vertrag" aus Methoden ohne Implementierung. Beides erzwingt eine gemeinsame Schnittstelle für Polymorphie.',
    keyPoints: ['Abstrakte Klasse: Methode vorgegeben, aber nicht implementiert', 'Interface: reiner Methoden-Vertrag', 'Unterklassen müssen die Methoden ausfüllen'],
    pseudocode: 'ABSTRAKTE KLASSE Form\n    ABSTRAKTE METHODE flaeche()   // ohne Rumpf\nENDE KLASSE\n\nKLASSE Kreis ERBT VON Form\n    radius\n    METHODE flaeche()\n        RÜCKGABE 3.14159 * radius * radius\n    ENDE METHODE\nENDE KLASSE',
    java: 'abstract class Form {\n    abstract double flaeche();   // ohne Rumpf\n}\n\nclass Kreis extends Form {\n    double radius;\n    Kreis(double r) { radius = r; }\n    double flaeche() {           // muss implementiert werden\n        return Math.PI * radius * radius;\n    }\n}',
    python: 'from abc import ABC, abstractmethod\n\nclass Form(ABC):\n    @abstractmethod\n    def flaeche(self): ...\n\nclass Kreis(Form):\n    def __init__(self, radius):\n        self.radius = radius\n    def flaeche(self):           # muss implementiert werden\n        return 3.14159 * self.radius ** 2',
  },
]
