// Prüfungsaufgaben aus dem Nachtrag zur Prüfungsvorbereitung PV1, Tag 1 (Klassendiagramm, 15.09.2026).
// Eigene Szenarien (Musikschule, Mobilitätsstation, Betriebskantine) — bewusst NICHT die IHK-/WBS-Originale
// (AP1 Frühjahr 2026: Einzelklasse mit Attributen, Datentypen, Sichtbarkeit; WBS-Sammlung: Vererbung,
// Aggregation/Komposition, Datentypen zuordnen, OOP-Begriffe), sondern gleiche Aufgabentypen mit anderem Fachkontext.
// Scope laut Abgleich mit Katalog Okt. 2024 (Gegenüberstellung it-berufe-podcast #190): Einzelklasse, Datentypen,
// Klasse/Objekt/Methode = AP1-Kern; Vererbung = [AP2] (aus 04.06 gestrichen), abstrakt = [AP2] (hängt an Vererbung);
// Assoziation/Aggregation/Komposition = [RAND]. AP2-Stoff steht im Titel („(Vertiefung AP2)“), Randstoff im Titel
// („(Randstoff)“); gemischte Teilaufgaben tragen die Marker [AP2]/[RAND] direkt an den Begriffen.
// part.figure verweist auf ein Musterlösungs-Diagramm in components/UmlFigure.tsx.

import type { ExamTask } from './exam-tasks'

const IND = '  ' // geschütztes Leerzeichen: Einrückung im Pseudocode bleibt beim Rendern erhalten

export const EXAM_PV1: ExamTask[] = [
  {
    id: 'task-pv1-klasse-unterrichtsvertrag',
    title: 'Klassendiagramm: Unterrichtsvertrag der Musikschule (Datentypen & Pseudocode)',
    topicId: 'softwareentwicklung',
    scenario:
      'Eine Musikschule lässt ihre Vertragsverwaltung neu programmieren. Für jeden Unterrichtsvertrag soll ein Objekt der Klasse `Unterrichtsvertrag` den monatlichen Beitrag ermitteln. ' +
      'Im Klassendiagramm steht bisher nur die öffentliche Methode `berechneMonatsbeitrag()`, die den Beitrag in Euro als Kommazahl zurückliefert. Die Klasse soll außerdem folgende Daten speichern:\n\n' +
      '- das unterrichtete Instrument, z. B. „Querflöte“\n' +
      '- den Preis einer Unterrichtsstunde in Euro, z. B. 22,50\n' +
      '- die vereinbarte Anzahl Unterrichtsstunden pro Monat\n' +
      '- einen Rabatt in Prozent, z. B. 7,5 bei Geschwisterkindern\n' +
      '- ob ein Leihinstrument der Schule genutzt wird\n' +
      '- die monatliche Leihgebühr in Euro\n\n' +
      'Auf diese Daten darf nur innerhalb der Klasse direkt zugegriffen werden. Der Rabatt gilt nur für den Unterricht, nicht für die Leihgebühr. Die Leihgebühr fällt nur an, wenn ein Leihinstrument genutzt wird.',
    parts: [
      {
        label: 'a)',
        operator: 'vervollständigen',
        points: 6,
        prompt:
          'Vervollständigen Sie das UML-Klassendiagramm: Tragen Sie den Klassennamen sowie alle Attribute mit geeigneten Namen, Datentypen und Sichtbarkeiten ein. Die vorgegebene Methode bleibt erhalten (auf Papier skizzieren, dann mit der Musterlösung vergleichen).',
        modelAnswer:
          '**Name:** Unterrichtsvertrag\n' +
          '**Attribute:** `- instrument : String`, `- preisProStunde : double`, `- stundenProMonat : int`, `- rabattProzent : double`, `- leihinstrument : boolean`, `- leihgebuehr : double`\n' +
          '**Methode (vorgegeben):** `+ berechneMonatsbeitrag() : double`\n' +
          'Alle Attribute sind **private** (`-`), die Methode ist **public** (`+`). Schreibweise je Zeile: `Sichtbarkeit name : Datentyp`. Attributnamen beginnen klein (lowerCamelCase) und enthalten keine Leerzeichen oder Umlaute.',
        figure: 'class-unterrichtsvertrag',
        rubric: [
          'Klassenname im oberen Bereich, drei Bereiche (1 P)',
          'sechs Attribute mit sinnvollen Namen (1 P)',
          'Datentypen fachlich passend: String, double, int, double, boolean, double (2 P)',
          'alle Attribute private (-) (1 P)',
          'Methode unverändert public (+) mit leeren Klammern und Rückgabetyp double (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'begründen',
        points: 4,
        prompt:
          'Begründen Sie Ihre Datentypen für die Stundenanzahl, den Stundenpreis und das Leihinstrument. Die Schule möchte zusätzlich die Postleitzahl des Wohnorts speichern (z. B. 01067). Geben Sie dafür einen geeigneten Datentyp an und begründen Sie ihn.',
        modelAnswer:
          '**stundenProMonat : int** – eine Anzahl ist immer ganzzahlig; man zählt und rechnet damit.\n' +
          '**preisProStunde : double** – Geldbeträge haben Nachkommastellen (Cent), deshalb eine Gleitkommazahl. In der Praxis nimmt man für Geld oft einen exakten Dezimaltyp (z. B. `BigDecimal` in Java), weil double Rundungsfehler haben kann; in der AP1 ist double üblich.\n' +
          '**leihinstrument : boolean** – es gibt nur zwei Zustände (ja/nein), ein Wahrheitswert genügt.\n' +
          '**postleitzahl : String** – eine Postleitzahl ist ein Kennzeichen, keine Rechengröße: Man rechnet nicht damit, und als Ganzzahl ginge die führende Null verloren (01067 würde zu 1067).',
        rubric: [
          'Stundenanzahl als Ganzzahl (int), weil zählbar/ganzzahlig (1 P)',
          'Stundenpreis als Kommazahl (double oder Dezimaltyp), weil Cent-Beträge (1 P)',
          'Leihinstrument als boolean, weil nur ja/nein (1 P)',
          'Postleitzahl als String, weil führende Null und kein Rechnen (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'erstellen',
        points: 4,
        prompt:
          'Formulieren Sie die Methode `berechneMonatsbeitrag()` in Pseudocode. Die Methode arbeitet mit den Attributen des Objekts und gibt den Monatsbeitrag zurück.',
        modelAnswer:
          '`FUNKTION berechneMonatsbeitrag() : double`\n' +
          `\`${IND}unterricht = preisProStunde * stundenProMonat\`\n` +
          `\`${IND}unterricht = unterricht - unterricht * rabattProzent / 100\`\n` +
          `\`${IND}betrag = unterricht\`\n` +
          `\`${IND}WENN leihinstrument = wahr DANN\`\n` +
          `\`${IND}${IND}betrag = betrag + leihgebuehr\`\n` +
          `\`${IND}ENDE WENN\`\n` +
          `\`${IND}RÜCKGABE betrag\`\n` +
          '`ENDE FUNKTION`\n' +
          'Kontrolle: 4 Stunden zu je 22,50 €, 10 % Rabatt, Leihinstrument für 15 € → 90,00 − 9,00 + 15,00 = **96,00 €**. Wer den Rabatt erst nach der Leihgebühr abzieht, kommt auf 94,50 € – das widerspricht der Vorgabe.',
        rubric: [
          'Unterrichtskosten als Stundenpreis mal Stundenanzahl (1 P)',
          'Rabatt prozentual und nur auf die Unterrichtskosten angewendet (1 P)',
          'Leihgebühr nur über eine Verzweigung bei genutztem Leihinstrument addiert (1 P)',
          'Rückgabe des Betrags; Zugriff direkt auf die Attribute, keine Parameter nötig (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-vererbung-mobilitaetsstation',
    title: 'Klassendiagramm: Mietobjekte der Mobilitätsstation (Vertiefung AP2)',
    topicId: 'algo-testing-oop',
    scenario:
      'Die Stadtwerke betreiben Mobilitätsstationen, an denen man Lastenräder und Elektroautos mieten kann. Für die Buchungssoftware liegen zwei Klassen vor:\n\n' +
      '- **Lastenrad:** `inventarNr : String`, `tagespreis : double`, `kaufjahr : int`, `zuladungKg : int`; Methoden `reservieren() : void` und `mietpreisBerechnen(tage : int) : double`\n' +
      '- **Elektroauto:** `inventarNr : String`, `tagespreis : double`, `kaufjahr : int`, `kennzeichen : String`, `reichweiteKm : int`; Methoden `reservieren() : void`, `mietpreisBerechnen(tage : int) : double` und `ladestandAbfragen() : int`\n\n' +
      'Das Reservieren läuft bei beiden gleich ab. Der Mietpreis wird dagegen unterschiedlich berechnet: Lastenräder werden ab dem dritten Tag günstiger, bei Elektroautos kommt eine Ladepauschale hinzu. Vermietet werden nur konkrete Lastenräder und Elektroautos, nie ein „allgemeines“ Mietobjekt.\n\n' +
      '**Einordnung:** [AP2] – Vererbung ist laut der Gegenüberstellung des Katalogs 2025 (it-berufe-podcast #190) aus der AP1 gestrichen; abstrakte Klassen setzen Vererbung voraus und zählen deshalb ebenfalls zu AP2. Beides kam aber in älteren Prüfungen vor. Die Beziehungen der Station (Aggregation/Komposition) sind Randstoff und stehen in der eigenen Aufgabe „Beziehungen der Mobilitätsstation (Randstoff)“.',
    parts: [
      {
        label: 'a)',
        operator: 'erstellen',
        points: 7,
        prompt:
          'Erstellen Sie ein UML-Klassendiagramm mit der gemeinsamen Oberklasse `Mietobjekt` und den Unterklassen `Lastenrad` und `Elektroauto`. Jedes Attribut und jede Methode soll nur so oft wie nötig vorkommen. Kennzeichnen Sie abstrakte Elemente. Sichtbarkeiten und Konstruktoren sind nicht verlangt.',
        modelAnswer:
          '**Oberklasse Mietobjekt (abstrakt):** Name kursiv oder mit `{abstract}`\n' +
          'Attribute: `inventarNr : String`, `tagespreis : double`, `kaufjahr : int`\n' +
          'Methoden: `reservieren() : void` und `mietpreisBerechnen(tage : int) : double` – diese abstrakt (kursiv oder `{abstract}`)\n' +
          '**Unterklasse Lastenrad:** `zuladungKg : int`; `mietpreisBerechnen(tage : int) : double` (überschreibt)\n' +
          '**Unterklasse Elektroauto:** `kennzeichen : String`, `reichweiteKm : int`; `mietpreisBerechnen(tage : int) : double` (überschreibt), `ladestandAbfragen() : int`\n' +
          '**Generalisierung:** Lastenrad —▷ Mietobjekt und Elektroauto —▷ Mietobjekt, durchgezogene Linie mit **hohlem Dreieck an der Oberklasse**; beide Linien dürfen in ein gemeinsames Dreieck münden.\n' +
          'Typische Fehler: gemeinsame Attribute in den Unterklassen wiederholen, Dreieck an der Unterklasse, offene Pfeilspitze oder Raute statt Dreieck.',
        figure: 'class-mietobjekt-hierarchie',
        rubric: [
          'Oberklasse mit den drei gemeinsamen Attributen, diese in den Unterklassen nicht wiederholt (2 P)',
          'reservieren() nur einmal in der Oberklasse (1 P)',
          'Oberklasse und mietpreisBerechnen() dort als abstrakt gekennzeichnet (kursiv oder {abstract}) (1 P)',
          'mietpreisBerechnen() in beiden Unterklassen erneut aufgeführt (Überschreiben) (1 P)',
          'eigene Attribute und ladestandAbfragen() nur in der jeweiligen Unterklasse (1 P)',
          'Generalisierung als durchgezogene Linie mit hohlem Dreieck an der Oberklasse (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'begründen',
        points: 3,
        prompt:
          'Begründen Sie, warum `Mietobjekt` als abstrakte Klasse und `mietpreisBerechnen()` als abstrakte Methode modelliert werden. Erläutern Sie, welchen Vorteil das für eine Methode hat, die den Umsatz aller Mietobjekte einer Station berechnet.',
        modelAnswer:
          '**Abstrakte Klasse:** Von Mietobjekt sollen nie Objekte entstehen – vermietet werden nur Lastenräder und Elektroautos. Die Oberklasse sammelt nur das Gemeinsame.\n' +
          '**Abstrakte Methode:** Jedes Mietobjekt muss seinen Mietpreis berechnen können, die Rechenregel ist aber je Unterklasse verschieden. Oben steht deshalb nur die Signatur ohne Rumpf; jede konkrete Unterklasse **muss** die Methode überschreiben.\n' +
          '**Vorteil (Polymorphie):** Die Umsatzmethode durchläuft eine Liste vom Typ `Mietobjekt` und ruft für jedes Element `mietpreisBerechnen(tage)` auf. Zur Laufzeit wird automatisch die passende Umsetzung von Lastenrad oder Elektroauto ausgeführt – ohne Fallunterscheidung nach dem Typ. Kommt später z. B. ein E-Roller hinzu, bleibt die Umsatzmethode unverändert.',
        rubric: [
          'abstrakte Klasse: keine eigenen Objekte, nur konkrete Unterklassen werden vermietet (1 P)',
          'abstrakte Methode: gemeinsame Signatur, Umsetzung je Unterklasse verschieden und dort verpflichtend (1 P)',
          'Polymorphie: Aufruf über den Typ Mietobjekt führt die passende Unterklassen-Methode aus (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-beziehungen-mobilitaetsstation',
    title: 'Klassendiagramm: Beziehungen der Mobilitätsstation (Randstoff)',
    topicId: 'softwareentwicklung',
    scenario:
      'Die Stadtwerke betreiben Mobilitätsstationen, an denen man Mietobjekte (Lastenräder und Elektroautos) mieten kann. Für die Buchungssoftware hat ein Kollege zwei Beziehungen modelliert: **Station ◆— Mietobjekt** (Komposition) und **Mietvertrag ◇— Mietposition** (Aggregation).\n\n' +
      'Mietobjekte werden bei der Schließung einer Station an eine andere Station umgesetzt oder zeitweise ohne Station in der Werkstatt geführt. Die Positionen eines Mietvertrags (z. B. „Lastenrad, 3 Tage“) werden gelöscht, sobald der Vertrag gelöscht wird.\n\n' +
      '**Einordnung:** [RAND] – Aggregation, Komposition und Multiplizitäten sind in der Gegenüberstellung des Katalogs 2025 (it-berufe-podcast #190) nicht als gestrichen aufgeführt, gehören aber nicht zum AP1-Kern. Vererbungswissen ist für diese Aufgabe nicht nötig.',
    parts: [
      {
        label: 'a)',
        operator: 'beurteilen',
        points: 4,
        prompt:
          'Beurteilen Sie die beiden Beziehungen des Kollegen. Begründen Sie jeweils, ob Aggregation oder Komposition richtig ist, und geben Sie die korrigierte Notation mit sinnvollen Multiplizitäten an.',
        modelAnswer:
          '**Station – Mietobjekt: Aggregation statt Komposition.** Ein Mietobjekt gehört zwar zu einer Station, existiert aber unabhängig von ihr: Wird die Station geschlossen, wird das Lastenrad umgesetzt und nicht gelöscht. Notation: **hohle Raute an Station**, Multiplizität `0..1` an Station (höchstens eine Station, in der Werkstatt keine) und `*` an Mietobjekt.\n' +
          '**Mietvertrag – Mietposition: Komposition statt Aggregation.** Die Positionen sind existenzabhängig: Sie gehören zu genau einem Vertrag und werden mit ihm gelöscht. Notation: **gefüllte Raute an Mietvertrag**, Multiplizität `1` an Mietvertrag und `1..*` an Mietposition.\n' +
          'Merkregel: „wird mitgelöscht / gehört exklusiv“ → Komposition; „besteht auch ohne das Ganze / wird weitergegeben“ → Aggregation. Die Raute sitzt immer am Ganzen.',
        figure: 'class-station-beziehungen',
        rubric: [
          'Station – Mietobjekt als Aggregation, begründet mit unabhängiger Existenz (Umsetzen statt Löschen) (1 P)',
          'Mietvertrag – Mietposition als Komposition, begründet mit Löschen samt Vertrag (1 P)',
          'Notation: hohle bzw. gefüllte Raute jeweils am Ganzen (1 P)',
          'sinnvolle Multiplizitäten, z. B. 0..1 zu * und 1 zu 1..* (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-oop-begriffe-kantine',
    title: 'OOP-Grundbegriffe: Bestellsystem der Betriebskantine',
    topicId: 'softwareentwicklung',
    scenario:
      'Für die Kantine eines Maschinenbauunternehmens wird ein Bestellsystem objektorientiert entwickelt. Mitarbeitende wählen Gerichte aus dem Wochenplan, bestellen sie vorab und bezahlen mit dem Guthaben auf ihrem Werksausweis. ' +
      'Ein neuer Kollege im Team hat bisher nur prozedural programmiert und bittet Sie um eine kurze Einführung.\n\n' +
      '**Einordnung:** Teil a) und b) sind AP1-Kern. Teil c) mischt zwei Stufen: Vererbung ist [AP2] (laut der Gegenüberstellung des Katalogs 2025, it-berufe-podcast #190, aus der AP1 gestrichen); Assoziation, Aggregation und Komposition sind [RAND] (nicht gestrichen, aber kein AP1-Kern). Alle vier kamen in älteren Prüfungen vor.',
    parts: [
      {
        label: 'a)',
        operator: 'erläutern',
        points: 3,
        prompt: 'Erläutern Sie die Begriffe Klasse, Objekt und Methode jeweils mit einem Beispiel aus dem Bestellsystem.',
        modelAnswer:
          '**Klasse:** Bauplan für gleichartige Objekte; legt Attribute (Daten) und Methoden (Verhalten) fest. Beispiel: Klasse `Gericht` mit `bezeichnung : String` und `preis : double`.\n' +
          '**Objekt:** konkrete Instanz einer Klasse zur Laufzeit mit eigenen Attributwerten, z. B. das Gericht „Linsen-Curry, 4,90 €“ vom Dienstag. Aus einer Klasse lassen sich beliebig viele Objekte erzeugen.\n' +
          '**Methode:** Operation einer Klasse, die das Verhalten beschreibt und meist mit den Attributen des eigenen Objekts arbeitet, z. B. `bestellung.summeBerechnen()`.',
        rubric: [
          'Klasse als Bauplan mit Attributen und Methoden, passendes Beispiel (1 P)',
          'Objekt als konkrete Instanz mit eigenen Werten, passendes Beispiel (1 P)',
          'Methode als Verhalten/Operation der Klasse, passendes Beispiel (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'erläutern',
        points: 2,
        prompt: 'Erläutern Sie dem Kollegen zwei Vorteile der objektorientierten gegenüber der prozeduralen Programmierung.',
        modelAnswer:
          'Prozedural sind Daten und Funktionen getrennt; objektorientiert bilden sie im Objekt eine Einheit. Daraus folgen z. B.:\n' +
          '**Kapselung:** Attribute sind private und nur über Methoden änderbar – das Guthaben auf dem Werksausweis kann nicht von beliebigem Code versehentlich negativ gesetzt werden.\n' +
          '**Wiederverwendbarkeit:** Eine Klasse wie `Gericht` lässt sich in einem anderen Programm (z. B. der Kiosk-App) wiederverwenden.\n' +
          '**Wartbarkeit und Übersicht:** Änderungen bleiben auf eine Klasse begrenzt; Klassen entsprechen realen Dingen (Gericht, Bestellung), das erleichtert die Abstimmung mit dem Fachbereich.\n' +
          'Zwei begründete Vorteile genügen.',
        rubric: [
          'erster Vorteil mit kurzer Begründung, z. B. Kapselung (1 P)',
          'zweiter Vorteil mit kurzer Begründung, z. B. Wiederverwendbarkeit oder Wartbarkeit (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'erläutern',
        points: 4,
        prompt: 'Erläutern Sie die Begriffe Vererbung [AP2], Assoziation [RAND], Aggregation [RAND] und Komposition [RAND] jeweils mit einem Beispiel aus dem Bestellsystem.',
        modelAnswer:
          '**Vererbung:** „ist-ein“-Beziehung; die Unterklasse übernimmt Attribute und Methoden der Oberklasse und kann sie ergänzen oder überschreiben. Beispiel: `Tagesgericht` ist ein `Gericht`. Notation: hohles Dreieck an der Oberklasse.\n' +
          '**Assoziation:** allgemeine Beziehung zwischen Klassen, deren Objekte sich kennen, aber unabhängig voneinander existieren. Beispiel: `Mitarbeiter` 1 — `0..*` `Bestellung`. Notation: durchgezogene Linie, ggf. mit Multiplizitäten.\n' +
          '**Aggregation:** schwache Teil-Ganzes-Beziehung, die Teile bestehen auch ohne das Ganze. Beispiel: `Wochenplan` ◇— `Gericht`; ein Gericht bleibt erhalten, wenn ein Wochenplan gelöscht wird, und kann in mehreren Plänen stehen. Notation: hohle Raute am Ganzen.\n' +
          '**Komposition:** starke Teil-Ganzes-Beziehung, die Teile hängen in ihrer Existenz vom Ganzen ab. Beispiel: `Bestellung` ◆— `Bestellposition`; wird die Bestellung gelöscht, verschwinden auch ihre Positionen. Notation: gefüllte Raute am Ganzen.',
        rubric: [
          '[AP2] Vererbung als ist-ein-Beziehung mit Übernahme der Merkmale, passendes Beispiel (1 P)',
          '[RAND] Assoziation als allgemeine Beziehung unabhängiger Objekte, passendes Beispiel (1 P)',
          '[RAND] Aggregation als Teil-Ganzes ohne Existenzabhängigkeit, passendes Beispiel (1 P)',
          '[RAND] Komposition als Teil-Ganzes mit Existenzabhängigkeit, passendes Beispiel (1 P)',
        ],
      },
    ],
  },
]
