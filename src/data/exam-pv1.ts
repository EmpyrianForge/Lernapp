// Prüfungsaufgaben zur Prüfungsvorbereitung PV1 (WBS). Tag 1: Klassendiagramm (Nachtrag 15.09.2026).
// Tag 2 (16.09.2026): USV (Klasse begründen, Scheinleistung mit Reserve, Shutdown-Zeitbudget) und
// Netzwerkdiagnose mit Windows-Befehlen (ipconfig /all, APIPA, ping von innen nach außen, nslookup,
// Gateway-Plausibilität). Eigene Szenarien (Planungsbüro, Physiotherapiepraxis) statt der WBS-Folien und
// -Übungen, alle Zahlen nachgerechnet. Einordnung Tag 2: USV-Klassen, Leistung und Überbrückungszeit = Kern;
// Shutdown-Software und Wartung = [RAND] (Marker direkt am Teil).
// Tag 3 (17.09.2026): Projektmanagement — Projektstart einer Kursbuchungs-App (Projektmerkmale, SMART-Ziel,
// Lasten-/Pflichtenheft, Stakeholder, magisches Dreieck klassisch/agil; Kick-off = [RAND]) und Terminplanung eines
// Kanzleiumzugs (PSP, Netzplan mit Gesamt- und freiem Puffer, Verzögerungen, Gantt mit Wochenende, Fehler finden).
// Eigene Szenarien (Fitnessstudio, Steuerkanzlei) statt der WBS-Folien; Scrum-Begriffe nach dem Scrum Guide 2020,
// weil die Kursfolien ältere bzw. falsche Angaben enthalten; alle Zahlen per Skript nachgerechnet.
// Tag 1 — eigene Szenarien (Musikschule, Mobilitätsstation, Betriebskantine) — bewusst NICHT die IHK-/WBS-Originale
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
  // ---------------------------------------------------------------------------------------------
  // PV1 Tag 2 (16.09.2026): USV und Netzwerkdiagnose mit Befehlen
  // ---------------------------------------------------------------------------------------------
  {
    id: 'task-pv1-usv-serverschrank-planungsbuero',
    title: 'USV für den Serverschrank eines Planungsbüros: Klasse, Scheinleistung, Shutdown',
    topicId: 'hardware',
    scenario:
      'Ein Planungsbüro für Haustechnik mit zwölf Mitarbeitenden betreibt im Abstellraum einen kleinen Serverschrank. Auf dem Virtualisierungshost laufen die Projektdatenbank und der Dateiserver; ein Absturz während des Speicherns hat schon einmal Projektdaten beschädigt. ' +
      'Das Büro liegt in einem Gewerbegebiet: Wenn der Nachbarbetrieb seine großen Maschinen anlaufen lässt, flackert das Licht, und die Netzspannung schwankt spürbar. Die Telefone werden über den PoE-Switch mit Strom versorgt.\n\n' +
      'An die geplante USV sollen folgende Geräte (gemessene Leistungsaufnahme):\n\n' +
      '- Virtualisierungshost: 420 W\n' +
      '- NAS für die Datensicherung: 70 W\n' +
      '- PoE-Switch einschließlich der Telefone: 110 W\n' +
      '- Firewall: 30 W\n' +
      '- Internet-Router: 20 W\n\n' +
      'Der Leistungsfaktor der gesamten Last beträgt cos φ = 0,9.\n\n' +
      '**Einordnung:** Teil a) bis d) sind AP1-Kern (Netzstörungen, USV-Klassen nach IEC 62040-3, Scheinleistung, Überbrückungszeit). Teil e) zu Shutdown-Software und Wartung ist [RAND].',
    parts: [
      {
        label: 'a)',
        operator: 'nennen',
        points: 3,
        prompt: 'Nennen Sie drei Netzstörungen, vor denen eine USV die angeschlossenen Geräte schützen kann.',
        modelAnswer:
          'Drei der folgenden Störungen:\n' +
          '**Netzausfall** (länger als etwa 10 ms)\n' +
          '**Spannungseinbruch** (kurzzeitig zu niedrige Spannung)\n' +
          '**kurzzeitige Überspannung** bzw. Spannungsspitze\n' +
          '**dauerhafte Unter- oder Überspannung**\n' +
          '**Frequenzschwankung**\n' +
          '**Transienten** und periodische Störimpulse (Burst)\n' +
          '**Oberschwingungen** (verzerrte Sinusform)\n' +
          'Zur Einordnung: VFD deckt Ausfall, Einbrüche und kurze Überspannungen ab, VI regelt zusätzlich dauerhafte Unter- und Überspannung aus, VFI schützt vor allen genannten Störungen. Gegen **Blitzeinwirkung** hilft auch eine VFI-USV nur zusammen mit einem zusätzlichen Überspannungsschutz.',
        rubric: [
          'erste Netzstörung fachlich richtig benannt (1 P)',
          'zweite Netzstörung (1 P)',
          'dritte Netzstörung; drei verschiedene Störungsarten, nicht dreimal „Stromausfall“ in anderen Worten (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'begründen',
        points: 4,
        prompt:
          'Wählen Sie für den Serverschrank eine USV-Klasse nach IEC 62040-3 (VFD, VI oder VFI). Begründen Sie Ihre Wahl mit Bezug auf die Situation und grenzen Sie sie von den beiden anderen Klassen ab.',
        modelAnswer:
          '**Empfehlung: VFI (Online-USV, Doppelwandler).**\n' +
          '**Funktion:** Die Last hängt ständig am Wechselrichter. Der Netzstrom wird dauernd gleichgerichtet (dabei wird der Akku geladen) und wieder zu Wechselspannung gewandelt. Fällt das Netz aus, speist der Akku ohne Umschaltung weiter – Umschaltzeit **0 ms**. Ausgangsspannung und -frequenz sind vom Netz unabhängig.\n' +
          '**Bezug zur Situation:** Das Netz im Gewerbegebiet schwankt durch den Nachbarbetrieb, und ein Absturz hat schon Daten beschädigt. Eine VFI-USV gleicht auch Spannungs- und Frequenzschwankungen sowie Oberschwingungen aus, bevor sie den Server erreichen.\n' +
          '**Abgrenzung VI (Line-Interactive):** regelt die Spannung mit einem Spannungswandler (AVR) nach, schaltet bei Ausfall aber um (Richtwert 2–4 ms, herstellerabhängig); die Frequenz bleibt netzabhängig. Günstiger und effizienter – vertretbar bei stabilem Netz und weniger kritischer Last.\n' +
          '**Abgrenzung VFD (Offline/Standby):** reicht die Netzspannung nur gefiltert durch und schaltet erst bei Ausfall um (Richtwert 4–10 ms); dauerhafte Spannungsabweichungen regelt sie nicht aus. Nur für unkritische Einzelgeräte.\n' +
          '**Nachteil VFI:** höherer Preis, etwas geringerer Wirkungsgrad und mehr Abwärme – der Abstellraum muss belüftet sein.\n' +
          'Wer VI wählt und das schlüssig begründet (kleiner Einzelserver, Kosten), erhält Teilpunkte. Bei dem hier beschriebenen unruhigen Netz ist VFI die bessere Wahl.',
        rubric: [
          'VFI gewählt; VI nur mit tragfähiger Begründung als Teilleistung (1 P)',
          'Funktionsweise: Doppelwandlung, keine Umschaltzeit, netzunabhängige Ausgangsspannung (1 P)',
          'Bezug zur Situation: Spannungsschwankungen durch den Nachbarbetrieb, Datenschaden beim Absturz (1 P)',
          'Abgrenzung zu VI und VFD mit je einem Unterschied, z. B. Umschaltzeit oder Frequenzabhängigkeit (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'berechnen',
        points: 5,
        prompt:
          'Auf die Last soll eine Reserve von 30 % aufgeschlagen werden. Berechnen Sie die benötigte Wirk- und Scheinleistung. Der Händler bietet drei Geräte der gewählten Klasse an: **Modell X** 1000 VA / 800 W, **Modell Y** 1500 VA / 1350 W, **Modell Z** 3000 VA / 2400 W. Wählen Sie das kleinste geeignete Modell und begründen Sie die Wahl.',
        modelAnswer:
          '**Wirkleistung der Last:** 420 W + 70 W + 110 W + 30 W + 20 W = **650 W**\n' +
          '**Mit 30 % Reserve (Aufschlag):** 650 W × 1,3 = **845 W**\n' +
          '**Scheinleistung:** S = P / cos φ = 845 W / 0,9 = **938,89 VA**\n' +
          '**Modell X:** 1000 VA ≥ 938,89 VA, aber 800 W < 845 W → scheidet aus.\n' +
          '**Modell Y:** 1500 VA ≥ 938,89 VA und 1350 W ≥ 845 W → geeignet.\n' +
          '**Modell Z:** ebenfalls geeignet, aber deutlich überdimensioniert – teurer, und im niedrigen Teillastbereich arbeiten USVs meist weniger effizient.\n' +
          '**Ergebnis: Modell Y.** Eine USV hat zwei Grenzwerte (VA und W), und beide müssen reichen. Wer nur die VA prüft, wählt fälschlich Modell X.\n' +
          'Hinweis: Hieße die Vorgabe „die USV höchstens zu 70 % auslasten“, wäre durch 0,7 zu teilen: 650 W / 0,7 = 928,57 W und 928,57 W / 0,9 = 1.031,75 VA. Dann scheitert X an beiden Werten, das Ergebnis bleibt Y.',
        rubric: [
          'Wirkleistung der Last 650 W (1 P)',
          'Reserve als Aufschlag: 650 W × 1,3 = 845 W (1 P)',
          'Scheinleistung über S = P / cos φ: 938,89 VA (1 P)',
          'beide Nennwerte geprüft: X scheitert an 800 W < 845 W (1 P)',
          'Modell Y gewählt, Z als überdimensioniert verworfen (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'berechnen',
        points: 4,
        prompt:
          'Laut Datenblatt überbrückt Modell Y die aktuelle Last von 650 W für 14 Minuten. Wegen der Akkualterung sollen 25 % dieser Laufzeit als Sicherheitsreserve übrig bleiben. Das geordnete Herunterfahren dauert nacheinander 5 Minuten für die virtuellen Maschinen, 2 Minuten für den Host und 2 Minuten für das NAS. ' +
          'Berechnen Sie, wie lange die Shutdown-Software nach Beginn des Batteriebetriebs höchstens warten darf. Prüfen Sie außerdem, ob das Konzept noch aufgeht, wenn die Akkus nur noch 70 % ihrer ursprünglichen Kapazität haben (vereinfacht: Laufzeit proportional zur Kapazität), und nennen Sie eine Maßnahme.',
        modelAnswer:
          '**Nutzbare Laufzeit:** 14 min × 0,75 = **10,5 min**\n' +
          '**Dauer des Herunterfahrens:** 5 min + 2 min + 2 min = **9 min**\n' +
          '**Spätester Start:** 10,5 min − 9 min = 1,5 min = **90 s** nach Beginn des Batteriebetriebs.\n' +
          '**Gealterte Akkus:** 14 min × 0,7 = 9,8 min Laufzeit, davon 75 % nutzbar = **7,35 min** < 9 min → Das Herunterfahren passt nicht mehr in die nutzbare Zeit; selbst bei sofortigem Start fehlen 1,65 min.\n' +
          '**Maßnahme:** Akkus rechtzeitig tauschen oder ein Erweiterungsbatteriepaket nachrüsten. Kurzfristig hilft es, Host und NAS gleichzeitig herunterzufahren (5 min + 2 min = 7 min ≤ 7,35 min, Auslösung dann spätestens nach 0,35 min = 21 s) – das reicht aber nur knapp und ersetzt den Akkutausch nicht. Die Laufzeit regelmäßig testen.',
        rubric: [
          'nutzbare Laufzeit 10,5 min (1 P)',
          'spätester Auslösezeitpunkt 1,5 min = 90 s (1 P)',
          'gealterte Akkus: 7,35 min < 9 min → reicht nicht (1 P)',
          'passende Maßnahme, z. B. Akkutausch oder Erweiterungsbatterie (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'erläutern',
        points: 3,
        prompt:
          '[RAND] Erläutern Sie, wie die USV den Virtualisierungshost bei einem längeren Stromausfall automatisch und geordnet herunterfahren lässt. Nennen Sie außerdem eine regelmäßige Wartungsmaßnahme für die USV.',
        modelAnswer:
          '**Meldeweg:** Die USV meldet den Batteriebetrieb und die Restlaufzeit über **USB** bzw. eine serielle Schnittstelle direkt an einen Rechner oder über eine **Netzwerkmanagementkarte** (Weboberfläche, **SNMP**) an mehrere Systeme.\n' +
          '**Shutdown-Agent:** Eine Software auf dem Host wertet die Meldung aus. Nach einer eingestellten Zeit oder beim Unterschreiten einer Restlaufzeit fährt sie zuerst die VMs und dann den Host herunter, bevor der Akku leer ist; das NAS erhält den Befehl über das Netz. Zusätzlich benachrichtigt sie die Administration, z. B. per E-Mail oder SNMP-Trap.\n' +
          '**Wartung (eine genügt):** regelmäßigen Selbsttest bzw. Batterietest durchführen; Akkus vor Ablauf ihrer Designlebensdauer tauschen; die USV kühl aufstellen, weil Wärme die Lebensdauer der Blei-Gel-Akkus verkürzt; Altakkus fachgerecht entsorgen, nicht über den Restmüll.',
        rubric: [
          'Meldung des Batteriebetriebs über USB/seriell oder Netzwerkkarte bzw. SNMP (1 P)',
          'Shutdown-Software fährt VMs und Host rechtzeitig vor Akkuende geordnet herunter (1 P)',
          'eine sinnvolle Wartungsmaßnahme, z. B. Selbsttest oder rechtzeitiger Akkutausch (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-netzwerkstoerung-physiopraxis',
    title: 'Netzwerkstörung in der Physiotherapiepraxis: mit Befehlen eingrenzen',
    topicId: 'netzwerke',
    scenario:
      'Eine Physiotherapiepraxis nutzt das Netz 192.168.40.64/27. Der Router mit der Adresse 192.168.40.65 ist zugleich DHCP-Server, Standardgateway und DNS-Server der Praxis; der Netzwerkdrucker hat die feste Adresse 192.168.40.70. ' +
      'Am Montag nach Umbauarbeiten meldet der Empfang, dass der Windows-PC weder die Online-Terminsoftware noch den Drucker erreicht. Sie arbeiten im IT-Support und prüfen den PC mit der Eingabeaufforderung. Der Befehl aus Teil a) zeigt für den Ethernet-Adapter unter anderem:\n\n' +
      '`Physische Adresse . . . . . . . . : 3C-52-A1-07-4E-19`\n' +
      '`DHCP aktiviert. . . . . . . . . . : Ja`\n' +
      '`Autokonfiguration aktiviert . . . : Ja`\n' +
      '`IPv4-Adresse (Auto. Konfiguration): 169.254.83.12(Bevorzugt)`\n' +
      '`Subnetzmaske  . . . . . . . . . . : 255.255.0.0`\n' +
      '`Standardgateway . . . . . . . . . :`\n\n' +
      '**Einordnung:** IP-Konfiguration, APIPA, Subnetting und die Fehlersuche mit ping und nslookup sind AP1-Kern (eigene Einstufung nach dem Themenkatalog; der Prüfungskatalog nennt keine einzelnen Befehle).',
    parts: [
      {
        label: 'a)',
        operator: 'nennen',
        points: 2,
        prompt:
          'Nennen Sie den Befehl, mit dem Sie die vollständige IP-Konfiguration des PCs einschließlich MAC-Adresse und DNS-Server anzeigen. Geben Sie außerdem an, welche Angaben ohne den Zusatz fehlen würden.',
        modelAnswer:
          '**Befehl:** `ipconfig /all`\n' +
          'Ohne den Zusatz zeigt `ipconfig` je Adapter nur IP-Adresse, Subnetzmaske und Standardgateway. Es fehlen unter anderem die **physische Adresse (MAC)**, die **DNS-Server**, die Angabe **DHCP aktiviert**, der **DHCP-Server** und die **Lease-Zeiten**.\n' +
          'PowerShell-Gegenstück: `Get-NetIPConfiguration -Detailed`.',
        rubric: [
          'ipconfig /all genannt (1 P)',
          'mindestens zwei Angaben, die ohne /all fehlen, z. B. MAC-Adresse und DNS-Server (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'erläutern',
        points: 4,
        prompt:
          'Erläutern Sie den Befund im Auszug oben. Nennen Sie zwei mögliche Ursachen und den Befehl, mit dem der PC nach der Behebung ohne Neustart erneut eine Adresse anfordert.',
        modelAnswer:
          '**Befund:** Die Adresse 169.254.83.12 stammt aus dem **APIPA-Bereich** 169.254.0.0/16 („Auto. Konfiguration“). DHCP ist aktiviert, der PC hat aber **keine Antwort von einem DHCP-Server** erhalten und sich die Adresse selbst gegeben. Es ist **kein Standardgateway** eingetragen, und die Adresse gehört nicht zum Praxisnetz 192.168.40.64/27 – deshalb erreicht der PC weder den Drucker noch das Internet.\n' +
          '**Mögliche Ursachen (zwei genügen):** Patchkabel beim Umbau abgezogen oder falsch gesteckt, Netzwerkdose nicht angeschlossen, Switchport defekt oder abgeschaltet, DHCP-Dienst am Router gestört, Adresspool erschöpft.\n' +
          '**Nach der Behebung:** `ipconfig /renew` fordert beim DHCP-Server erneut eine Konfiguration an (DORA). Hat ein Adapter bereits eine gültige Lease, gibt `ipconfig /release` sie vorher ab. Beide Schalter wirken nur bei DHCP.\n' +
          '**Erfolgskontrolle:** `ipconfig /all` zeigt nun eine Adresse zwischen 192.168.40.66 und 192.168.40.94, Gateway und DNS-Server 192.168.40.65 sowie die Lease-Zeiten.',
        rubric: [
          'APIPA-Adresse (169.254.0.0/16) erkannt (1 P)',
          'Bedeutung: keine DHCP-Antwort, Selbstvergabe, kein Gateway, nur im eigenen Segment nutzbar (1 P)',
          'zwei plausible Ursachen, z. B. Kabel/Dose/Switchport oder DHCP-Dienst (1 P)',
          'ipconfig /renew (ggf. vorher /release) zum erneuten Anfordern (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'beschreiben',
        points: 4,
        prompt:
          'Nach der Behebung hat der PC die Adresse 192.168.40.77 erhalten, die Terminsoftware öffnet sich aber weiterhin nicht. Beschreiben Sie, wie Sie mit `ping` systematisch von innen nach außen prüfen. Geben Sie zu jedem Schritt das Ziel an und was eine erfolgreiche Antwort aussagt.',
        modelAnswer:
          '1. `ping 127.0.0.1` (Loopback): Der TCP/IP-Stack des PCs arbeitet.\n' +
          '2. `ping 192.168.40.77` (eigene Adresse): Die Adresse ist am Adapter eingerichtet.\n' +
          '3. `ping 192.168.40.65` (Standardgateway): Kabel, Switch und lokales Netz bis zum Router funktionieren.\n' +
          '4. `ping 9.9.9.9` (externe IP-Adresse): Der Router leitet ins Internet weiter, Routing und Internetzugang funktionieren.\n' +
          '5. `ping` auf einen Namen bzw. `nslookup`: Die Namensauflösung funktioniert.\n' +
          'Der erste Schritt ohne Antwort grenzt den Fehler ein. **Achtung:** ping nutzt ICMP, und viele Server und Firewalls filtern ICMP. Keine Antwort von einem externen Ziel beweist also noch keine Störung – dann ein zweites Ziel testen oder `tracert` einsetzen.',
        rubric: [
          'Loopback bzw. eigene Adresse als innerste Prüfung mit Aussage (1 P)',
          'Standardgateway als Prüfung des lokalen Netzes (1 P)',
          'externe IP-Adresse als Prüfung von Routing und Internetzugang (1 P)',
          'Reihenfolge von innen nach außen, Namensauflösung zuletzt (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'begründen',
        points: 4,
        prompt:
          'Ihre Tests am Empfangs-PC liefern folgende Ergebnisse:\n' +
          '`ping 192.168.40.65` → Antworten, 0 % Verlust\n' +
          '`ping 9.9.9.9` → Antworten, 0 % Verlust\n' +
          '`ping termine.physio.example` → Ping-Anforderung konnte Host "termine.physio.example" nicht finden. …\n' +
          '`nslookup termine.physio.example` → Zeitüberschreitung, der Server 192.168.40.65 antwortet nicht\n' +
          '`nslookup termine.physio.example 9.9.9.9` → liefert eine IPv4-Adresse\n' +
          'Ermitteln Sie die Fehlerursache, begründen Sie Ihre Aussage und schlagen Sie eine Maßnahme mit Nachtest vor.',
        modelAnswer:
          '**Befund:** Gateway und externe IP-Adresse antworten – Verkabelung, IP-Konfiguration und Routing ins Internet funktionieren. Die Meldung „Ping-Anforderung konnte Host … nicht finden“ bedeutet: Der **Name ließ sich nicht auflösen**; ein Leitungsproblem ist es nicht.\n' +
          '**Ursache:** `nslookup` fragt den eingetragenen DNS-Server 192.168.40.65 direkt, und er antwortet nicht. Ein anderer Resolver (9.9.9.9) löst denselben Namen auf. Der Fehler liegt also beim **DNS-Dienst bzw. der DNS-Weiterleitung des Routers** – nicht am PC und nicht am Namen.\n' +
          '**Maßnahme:** DNS-Weiterleitung am Router prüfen und reparieren (Einstellungen, ggf. Neustart). Übergangsweise kann der Router per DHCP einen funktionierenden DNS-Server verteilen; der PC übernimmt ihn mit `ipconfig /renew`. `ipconfig /flushdns` leert zusätzlich den lokalen DNS-Cache.\n' +
          '**Nachtest:** `nslookup termine.physio.example` ohne Serverangabe liefert eine Adresse; danach `ping termine.physio.example` bzw. die Terminsoftware im Browser aufrufen. Wichtig: `nslookup` umgeht den lokalen DNS-Cache und die hosts-Datei. Ob der PC den Namen selbst auflöst, zeigen erst `ping` oder der Browser.',
        rubric: [
          'IP-Verbindung bis ins Internet als intakt erkannt (Gateway und externe IP antworten) (1 P)',
          'Meldung „Host nicht finden“ als Problem der Namensauflösung gedeutet (1 P)',
          'nslookup-Vergleich: DNS-Server des Routers antwortet nicht, anderer Resolver schon (1 P)',
          'Maßnahme am DNS (Router reparieren oder anderen DNS-Server verteilen) mit Nachtest (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'berechnen',
        points: 4,
        prompt:
          'Im Behandlungsraum steht ein Notebook, das ein früherer Dienstleister fest eingerichtet hat: IP-Adresse 192.168.40.90, Subnetzmaske 255.255.255.224, Standardgateway 192.168.40.97. Das Notebook druckt problemlos, erreicht aber das Internet nicht. ' +
          'Berechnen Sie Netzadresse, Broadcast-Adresse und den Bereich der nutzbaren Hostadressen. Begründen Sie damit den Fehler und geben Sie die richtige Gateway-Adresse an.',
        modelAnswer:
          '**Maske** 255.255.255.224 = /27 → Blockgröße 256 − 224 = **32**, 5 Hostbits.\n' +
          '**Netzadresse:** 90 : 32 = 2 Rest 26 → 2 × 32 = 64 → **192.168.40.64**\n' +
          '**Broadcast:** 64 + 32 − 1 = 95 → **192.168.40.95**\n' +
          '**Nutzbare Hosts:** **192.168.40.65 bis 192.168.40.94** (2^5 − 2 = 30 Adressen)\n' +
          '**Fehler:** Das Gateway 192.168.40.97 liegt **außerhalb** dieses Bereichs; es gehört zum Nachbarnetz 192.168.40.96/27. Ein Host muss sein Gateway direkt im eigenen Netz erreichen (per ARP). Für Ziele im eigenen Netz wie den Drucker 192.168.40.70 braucht er kein Gateway – deshalb klappt das Drucken. Pakete ins Internet schickt er dagegen an eine Adresse, die in der Praxis kein Gerät hat.\n' +
          '**Korrektur:** Standardgateway **192.168.40.65** (der Router). Besser noch: das Notebook ebenfalls per DHCP konfigurieren oder die feste Adresse außerhalb des DHCP-Bereichs vergeben.',
        rubric: [
          'Netzadresse 192.168.40.64 (1 P)',
          'Broadcast 192.168.40.95 und Hostbereich .65 bis .94 (1 P)',
          'Begründung: Gateway .97 liegt außerhalb des eigenen Netzes; lokale Ziele brauchen kein Gateway (1 P)',
          'richtige Gateway-Adresse 192.168.40.65 (1 P)',
        ],
      },
    ],
  },
  // ---------------------------------------------------------------------------------------------
  // PV1 Tag 3 (17.09.2026): Projektmanagement
  // ---------------------------------------------------------------------------------------------
  {
    id: 'task-pv1-projektstart-kursbuchungs-app',
    title: 'Projektstart: Kursbuchungs-App für ein Fitnessstudio (Ziele, Lasten-/Pflichtenheft, Stakeholder)',
    topicId: 'projektmanagement',
    scenario:
      'Das Fitnessstudio „Kraftwerk“ hat drei Standorte und rund 2.400 Mitglieder. Kursplätze werden bisher per Telefon und Aushang vergeben; montags ist das Telefon am Empfang oft dauerbesetzt. ' +
      'Die Inhaberin beauftragt Ihren Arbeitgeber, ein Softwarehaus, mit der Entwicklung einer Kursbuchungs-App. Geplanter Start ist der **01.02.2027**, das Budget beträgt **38.000 € netto**.\n\n' +
      'Beteiligt oder betroffen sind außerdem:\n\n' +
      '- die Studioleitungen der drei Standorte\n' +
      '- 20 Kurstrainerinnen und -trainer\n' +
      '- das Empfangspersonal\n' +
      '- der externe Datenschutzbeauftragte des Studios\n' +
      '- ein Zahlungsdienstleister, über den kostenpflichtige Kurse abgerechnet werden\n\n' +
      'Die Vorarbeiten (Projektauftrag, Lastenheft, Grobplanung) laufen klassisch; die Entwicklung selbst organisiert Ihr Team mit Scrum.\n\n' +
      '**Einordnung:** Teil a) bis e) sind AP1-Kern (Projektmerkmale, SMART-Ziele, Lasten- und Pflichtenheft, Stakeholder, magisches Dreieck, klassisches und agiles Vorgehen). Teil f) zum Kick-off ist [RAND].',
    parts: [
      {
        label: 'a)',
        operator: 'erläutern',
        points: 3,
        prompt:
          'Eine Studioleiterin fragt, warum die Einführung der App als Projekt geführt wird, die monatliche Aktualisierung des Kursplans aber nicht. Erläutern Sie den Unterschied anhand von drei Projektmerkmalen.',
        modelAnswer:
          'Nach DIN 69901-5 (sinngemäß) zeichnet sich ein Projekt vor allem dadurch aus, dass seine Rahmenbedingungen zusammengenommen einmalig sind, etwa Ziel, Zeitrahmen, Budget, Personal und Organisation (Stichwort **Einmaligkeit der Bedingungen**). Drei der folgenden Merkmale genügen, jeweils mit Bezug zur Situation:\n' +
          '**Einmaligkeit:** Die App wird einmal neu entwickelt. Der Kursplan wird jeden Monat auf die gleiche Weise aktualisiert – das ist eine wiederkehrende Routineaufgabe.\n' +
          '**zeitliche Begrenzung:** Das Projekt hat einen festen Anfang und ein festes Ende (Start der App am 01.02.2027). Die Pflege des Kursplans endet nie.\n' +
          '**begrenzte Mittel:** festes Budget von 38.000 € netto und ein festes Team.\n' +
          '**klare Zielvorgabe:** eine bestimmte App mit festgelegten Funktionen.\n' +
          '**Neuartigkeit, Komplexität und Risiko:** neue Software, viele Beteiligte, unsichere Aufwandsschätzung.\n' +
          '**eigene Projektorganisation:** Team und feste Ansprechpartner im Studio nur für dieses Vorhaben.\n' +
          'Hinweis: Die alte Norm DIN 69901:1987 nannte zusätzlich die „Abgrenzung gegenüber anderen Vorhaben“; das Merkmal steht noch in vielen Lehrbüchern. Meilensteine sind ein Planungsmittel, kein Projektmerkmal.',
        rubric: [
          'erstes Merkmal mit Bezug auf App und Kursplan (1 P)',
          'zweites Merkmal mit Bezug zur Situation (1 P)',
          'drittes Merkmal mit Bezug; die Kursplanpflege als wiederkehrende Routine erkannt (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'beurteilen',
        points: 4,
        prompt:
          'In der ersten Besprechung formuliert die Inhaberin das Ziel: „Wir wollen bald eine moderne App, mit der unsere Mitglieder einfacher buchen können.“ Beurteilen Sie das Ziel anhand von drei SMART-Kriterien. Formulieren Sie es anschließend so um, dass es alle SMART-Kriterien erfüllt und keinen Lösungsweg vorwegnimmt.',
        modelAnswer:
          '**Beurteilung (drei genügen):**\n' +
          '**nicht spezifisch:** Offen bleibt, was „buchen“ umfasst (Kurse buchen, stornieren, Warteliste?) und für welche Standorte es gilt.\n' +
          '**nicht messbar:** „modern“ und „einfacher“ sind Eindrücke, keine prüfbaren Größen.\n' +
          '**nicht terminiert:** „bald“ ist kein Termin.\n' +
          '**A und R nicht beurteilbar:** Ohne Budget und ohne Abstimmung mit Studioleitungen und Trainern lässt sich nicht sagen, ob das Ziel akzeptiert und realistisch ist.\n' +
          '**Umformulierung (Beispiel):** „Bis zum 01.02.2027 können Mitglieder aller drei Standorte Kursplätze rund um die Uhr per Smartphone buchen und bis zwei Stunden vor Kursbeginn stornieren. Bis zum 30.06.2027 laufen mindestens 70 % aller Kursbuchungen digital. Das Projektbudget beträgt höchstens 38.000 € netto.“\n' +
          '**Lösungsneutral:** Das Ziel nennt kein Framework, keine Datenbank und keinen Hersteller – es beschreibt das WAS; das WIE gehört ins Pflichtenheft. **Akzeptiert** ist es, wenn Inhaberin und Studioleitungen zustimmen (z. B. weil der Empfang weniger Anrufe hat), **realistisch**, wenn die Aufwandsschätzung zu Termin und Budget passt.',
        rubric: [
          'drei verletzte SMART-Kriterien benannt (1 P)',
          'Verletzungen mit dem Wortlaut begründet, z. B. „bald“, „modern/einfacher“, unklarer Umfang (1 P)',
          'neues Ziel spezifisch, messbar (Kennzahl) und terminiert (1 P)',
          'neues Ziel lösungsneutral und mit Budgetrahmen bzw. realistisch (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'zuordnen',
        points: 4,
        prompt:
          'Ordnen Sie die folgenden Aussagen dem Lastenheft oder dem Pflichtenheft zu. Geben Sie außerdem an, wer das jeweilige Dokument erstellt, in welcher Reihenfolge die beiden entstehen und welches nach der Freigabe verbindliche Grundlage für die Abnahme wird.\n' +
          '(1) „Mitglieder sollen Kursplätze bis zwei Stunden vor Kursbeginn kostenfrei stornieren können.“\n' +
          '(2) „Die Stornofrist prüft ein REST-Dienst auf dem Server; die Buchungen werden in einer PostgreSQL-Datenbank gespeichert.“\n' +
          '(3) „Auch Mitglieder ohne Technikerfahrung sollen die App ohne Einweisung bedienen können.“\n' +
          '(4) „Die App wird mit dem Framework Flutter für Android ab Version 12 und iOS ab Version 16 entwickelt.“',
        modelAnswer:
          '**(1) Lastenheft** – funktionale Anforderung aus Sicht der Anwender (WAS).\n' +
          '**(2) Pflichtenheft** – technische Umsetzung (WIE und WOMIT).\n' +
          '**(3) Lastenheft** – nicht-funktionale Anforderung (Benutzbarkeit), lösungsneutral formuliert.\n' +
          '**(4) Pflichtenheft** – Technologie- und Plattformentscheidung des Auftragnehmers.\n' +
          '**Ersteller und Reihenfolge:** Das **Lastenheft** schreibt der Auftraggeber (das Fitnessstudio). Danach schreibt der Auftragnehmer (das Softwarehaus) das **Pflichtenheft** als Antwort auf das Lastenheft.\n' +
          '**Verbindlichkeit:** Das vom Auftraggeber geprüfte und **freigegebene Pflichtenheft** wird Vertragsgrundlage. Bei einer Individualentwicklung liegt meist ein Werkvertrag vor; bei der Abnahme wird das Ergebnis gegen das Pflichtenheft geprüft.\n' +
          '[RAND] Manche Vorgehensweisen unterscheiden ein vorläufiges Pflichtenheft (mit dem Angebot) und ein endgültiges (nach der Feinabstimmung).',
        rubric: [
          'alle vier Zuordnungen richtig (2 P; drei richtig: 1 P)',
          'Lastenheft vom Auftraggeber zuerst, Pflichtenheft vom Auftragnehmer danach (1 P)',
          'freigegebenes Pflichtenheft als verbindliche Grundlage für Umsetzung und Abnahme (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'beurteilen',
        points: 5,
        prompt:
          'Nennen Sie vier Stakeholder des Projekts und ordnen Sie jeden aus Sicht des Fitnessstudios als intern oder extern ein. Schätzen Sie für zwei davon Einfluss und Einstellung zum Projekt ein und leiten Sie jeweils eine Maßnahme ab.',
        modelAnswer:
          '**Stakeholder (vier genügen):**\n' +
          '**intern:** Inhaberin (Auftraggeberin), Studioleitungen, Kurstrainerinnen und -trainer, Empfangspersonal\n' +
          '**extern:** Mitglieder, Softwarehaus (Auftragnehmer), externer Datenschutzbeauftragter, Zahlungsdienstleister\n' +
          '**Einschätzung und Maßnahme (zwei genügen):**\n' +
          '**Kurstrainer:** Einfluss mittel – sie arbeiten täglich mit den Teilnehmerlisten und können die Einführung durch Nichtnutzung ausbremsen. Einstellung eher skeptisch (Sorge vor Mehrarbeit oder Kontrolle). Maßnahme: früh einbinden, zwei Trainer als Key User benennen, schulen und ihre Rückmeldungen in die Sprint Reviews holen.\n' +
          '**Mitglieder:** Einfluss hoch auf den Erfolg – ohne Nutzung kein Nutzen. Einstellung überwiegend positiv, ältere Mitglieder teils zurückhaltend. Maßnahme: Testphase mit ausgewählten Mitgliedern, Buchung am Empfang als Alternative beibehalten, per Aushang und Newsletter informieren.\n' +
          '**Datenschutzbeauftragter:** Einfluss mittel bis hoch – er berät und überwacht die Einhaltung der DSGVO; Beanstandungen können den Start verzögern. Einstellung neutral bis kritisch. Maßnahme: früh beteiligen, Datenschutzhinweise, Rechtsgrundlagen und Verträge mit Dienstleistern (z. B. Hosting) vor dem Start klären.\n' +
          '**Empfangspersonal:** Einstellung gemischt (weniger Anrufe, aber Sorge um die eigene Rolle). Maßnahme: offen informieren und neue Aufgaben klären, z. B. Hilfe bei der App.\n' +
          '[RAND] Zur Darstellung eignet sich eine Einfluss-Interesse-Matrix (Stakeholder-Portfolio).',
        rubric: [
          'vier passende Stakeholder genannt (1 P)',
          'intern/extern schlüssig aus Sicht des Studios zugeordnet (1 P)',
          'Einfluss und Einstellung für zwei Stakeholder nachvollziehbar eingeschätzt (1 P)',
          'passende Maßnahme für den ersten Stakeholder (1 P)',
          'passende Maßnahme für den zweiten Stakeholder (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'erläutern',
        points: 4,
        prompt:
          'Kurz nach dem Projektstart bittet die Inhaberin, die App schon am 04.01.2027 freizugeben, weil im Januar besonders viele Neumitglieder kommen. Das Budget bleibt gleich. Erläutern Sie anhand des magischen Dreiecks zwei mögliche Folgen. Stellen Sie außerdem dar, wie ein klassisch geplantes Projekt und wie das Scrum-Team auf den Wunsch reagieren würden.',
        modelAnswer:
          '**Magisches Dreieck:** Leistung (Umfang und Qualität), Zeit und Kosten hängen voneinander ab; ändert sich eine Größe, muss mindestens eine andere nachgeben. Vier Wochen weniger Zeit bei gleichem Budget führen zu (zwei genügen):\n' +
          '**weniger Leistung:** Funktionen fallen zum Start weg oder kommen später, z. B. Warteliste oder Kursbewertungen.\n' +
          '**Qualitätsrisiko:** weniger Zeit für Tests, mehr Fehler nach dem Start.\n' +
          '**höhere Kosten:** Überstunden oder zusätzliche Entwickler, wenn der Umfang bleiben soll – das widerspricht dem festen Budget und müsste neu verhandelt werden.\n' +
          '**Klassisch:** Der Leistungsumfang steht im Pflichtenheft fest, Zeit und Kosten wurden daraus geplant. Die Projektleitung prüft den Terminplan (kritischer Pfad, Puffer) und legt die Folgen offen. Über einen **Änderungsantrag** wird entschieden: mehr Personal und damit höhere Kosten oder weniger Umfang.\n' +
          '**Scrum:** Zeit (Sprints mit fester Länge) und Kosten (festes Team) sind fest, der **Umfang ist variabel**. Der **Product Owner ordnet das Product Backlog neu**, sodass bis zum 04.01.2027 die wertvollsten Funktionen (buchen, stornieren) als nutzbares Increment fertig sind; weniger wichtige folgen in späteren Sprints. Die Definition of Done wird dafür nicht gelockert.',
        rubric: [
          'erste Folge nach dem magischen Dreieck, begründet (1 P)',
          'zweite Folge (1 P)',
          'klassisch: Umfang fest; Termin, Kosten oder Umfang nur über einen Änderungsantrag anpassen (1 P)',
          'Scrum: Zeit und Kosten fest, Product Owner ordnet das Backlog neu, Umfang variabel (1 P)',
        ],
      },
      {
        label: 'f)',
        operator: 'angeben',
        points: 2,
        prompt:
          '[RAND] Das Softwarehaus plant ein Kick-off-Meeting. Geben Sie an, wann es nach DIN 69901-5 stattfindet, und nennen Sie drei Tagesordnungspunkte.',
        modelAnswer:
          '**Zeitpunkt:** sinngemäß nach DIN 69901-5 **nach Abschluss der Projektplanung und vor Beginn der Durchführung** (so die Kursunterlagen und Sekundärquellen). In der Praxis gibt es oft schon direkt nach dem Projektauftrag einen Start-Workshop – in der Prüfung gilt die Lesart der Aufgabe.\n' +
          '**Teilnehmende:** Projektteam und Auftraggeberin, meist auch Studioleitungen und Key User.\n' +
          '**Tagesordnung (drei genügen):** Ausgangslage und Projektziele (auch Nichtziele) · Projektorganisation und Rollen (Product Owner, Scrum Master, Developers, Ansprechpartner im Studio) · Termin- und Meilensteinplan · Kommunikationsregeln (Sprint Reviews, Statusberichte) · bekannte Risiken und offene Punkte.',
        rubric: [
          'Zeitpunkt: nach der Planung, vor der Durchführung (1 P)',
          'drei passende Tagesordnungspunkte (1 P)',
        ],
      },
    ],
  },
  {
    id: 'task-pv1-terminplanung-kanzleiumzug',
    title: 'Terminplanung: Umzug der Kanzlei-Buchhaltung (PSP, Netzplan mit Puffern, Gantt)',
    topicId: 'projektmanagement',
    scenario:
      'Die Steuerkanzlei Brandt zieht mit ihrer Buchhaltung in eine neue Etage. Ihr Arbeitgeber, ein Systemhaus, übernimmt die IT. Die Arbeitspakete sind in einer Vorgangsliste erfasst:\n\n' +
      '| Vorgang | Tätigkeit | Dauer (h) | Vorgänger |\n' +
      '|---|---|---|---|\n' +
      '| A | Bestandsaufnahme der Arbeitsplätze | 3 | – |\n' +
      '| B | Netzwerkdosen in der neuen Etage prüfen | 2 | A |\n' +
      '| C | neue Rechner vorkonfigurieren | 6 | A |\n' +
      '| D | Altgeräte abbauen | 2 | A |\n' +
      '| E | Patchfeld und Switch konfigurieren | 4 | B |\n' +
      '| F | Arbeitsplätze aufbauen | 5 | C, D |\n' +
      '| G | Fachanwendungen einrichten | 3 | E, F |\n' +
      '| H | Abnahmetest mit der Kanzlei | 2 | G |\n\n' +
      'Gearbeitet wird von 8 bis 16 Uhr (8 Stunden pro Tag, Pausen bleiben unberücksichtigt), am Wochenende nicht. Für parallele Vorgänge steht genug Personal bereit. Das Projekt beginnt am **Donnerstag, 12.11.2026, um 8:00 Uhr**.\n\n' +
      '**Knotenschema laut Legende:** oben FAZ · Dauer · FEZ, in der Mitte Nummer und Bezeichnung, unten SAZ · GP · SEZ, der freie Puffer (FP) rechts neben dem Knoten. Andere Quellen ordnen die Felder anders an – in der Prüfung gilt immer die Legende der Aufgabe.\n\n' +
      '**Einordnung:** Alle Teile sind AP1-Kern (Projektstrukturplan, Netzplan mit Puffern, Gantt-Diagramm).',
    parts: [
      {
        label: 'a)',
        operator: 'erstellen',
        points: 3,
        prompt:
          'Die Arbeitspakete stammen aus einem phasenorientierten Projektstrukturplan (PSP). Erstellen Sie den PSP mit drei Ebenen und Nummerierung (auf Papier skizzieren). Erläutern Sie außerdem, warum der PSP allein noch kein Terminplan ist.',
        modelAnswer:
          '**Ebene 1:** Umzug der Buchhaltung (Projekt)\n' +
          '**Ebene 2 und 3 (ein möglicher Aufbau):**\n' +
          '**1 Vorbereitung:** 1.1 Bestandsaufnahme (A), 1.2 Netzwerkdosen prüfen (B), 1.3 Rechner vorkonfigurieren (C)\n' +
          '**2 Umsetzung:** 2.1 Altgeräte abbauen (D), 2.2 Patchfeld und Switch konfigurieren (E), 2.3 Arbeitsplätze aufbauen (F), 2.4 Fachanwendungen einrichten (G)\n' +
          '**3 Abschluss:** 3.1 Abnahmetest (H)\n' +
          'Andere schlüssige Phasenzuordnungen sind ebenfalls richtig, solange jedes Arbeitspaket genau einmal vorkommt. Die **Arbeitspakete** bilden die unterste Ebene: kleinste abgegrenzte Einheiten mit einer verantwortlichen Person, deren Aufwand sich schätzen lässt.\n' +
          '**Kein Terminplan:** Der PSP zeigt nur, **was** zu tun ist. Reihenfolge, Abhängigkeiten, Dauern und Termine fehlen – sie kommen erst mit der Vorgangsliste und dem Netzplan bzw. Gantt-Diagramm hinzu.\n' +
          'Zum Vergleich: Ein **objektorientierter** PSP gliedert nach Bestandteilen (z. B. Netzwerk, Arbeitsplätze, Software), ein **funktionsorientierter** nach Tätigkeiten (z. B. prüfen, konfigurieren, aufbauen).',
        rubric: [
          'drei Ebenen (Projekt – Phasen – Arbeitspakete) mit Nummerierung (1 P)',
          'alle acht Arbeitspakete genau einmal schlüssig zugeordnet (1 P)',
          'PSP enthält keine Reihenfolge, Dauern und Termine (1 P)',
        ],
      },
      {
        label: 'b)',
        operator: 'berechnen',
        points: 6,
        prompt:
          'Erstellen Sie den Netzplan und berechnen Sie für alle Vorgänge FAZ, FEZ, SAZ, SEZ, den Gesamtpuffer (GP) und den freien Puffer (FP) in Stunden.',
        modelAnswer:
          '**Vorwärtsrechnung** (FEZ = FAZ + Dauer; FAZ = größter FEZ aller direkten Vorgänger):\n' +
          '`A: FAZ 0 · FEZ 3`, `B: FAZ 3 · FEZ 5`, `C: FAZ 3 · FEZ 9`, `D: FAZ 3 · FEZ 5`, `E: FAZ 5 · FEZ 9`\n' +
          '`F: FAZ = max(FEZ C 9, FEZ D 5) = 9 · FEZ 14`\n' +
          '`G: FAZ = max(FEZ E 9, FEZ F 14) = 14 · FEZ 17`, `H: FAZ 17 · FEZ 19`\n' +
          '**Rückwärtsrechnung** (SAZ = SEZ − Dauer; SEZ = kleinster SAZ aller direkten Nachfolger):\n' +
          '`H: SAZ 17 · SEZ 19`, `G: SAZ 14 · SEZ 17`, `E: SAZ 10 · SEZ 14`, `F: SAZ 9 · SEZ 14`\n' +
          '`B: SEZ = SAZ E = 10 → SAZ 8`, `C: SEZ = SAZ F = 9 → SAZ 3`, `D: SEZ = SAZ F = 9 → SAZ 7`\n' +
          '`A: SEZ = min(SAZ B 8, SAZ C 3, SAZ D 7) = 3 → SAZ 0` (Kontrolle erfüllt)\n' +
          '**Puffer** (GP = SAZ − FAZ; FP = kleinster FAZ der direkten Nachfolger − eigener FEZ):\n' +
          '`A: GP 0 · FP 0`, `B: GP 5 · FP 0`, `C: GP 0 · FP 0`, `D: GP 4 · FP 4`\n' +
          '`E: GP 5 · FP 5`, `F: GP 0 · FP 0`, `G: GP 0 · FP 0`, `H: GP 0 · FP 0`\n' +
          'Warum hat B keinen freien Puffer? E kann direkt nach B beginnen (FAZ E = FEZ B = 5). Die 5 Stunden Gesamtpuffer teilen sich B und E.',
        rubric: [
          'Vorwärtsrechnung A bis E richtig (1 P)',
          'F und G mit dem größten FEZ der Vorgänger (FAZ 9 bzw. 14), H 17–19 (1 P)',
          'Rückwärtsrechnung H bis B richtig (1 P)',
          'A mit dem kleinsten SAZ der Nachfolger (SEZ 3, SAZ 0) (1 P)',
          'GP aller Vorgänge: B 5, D 4, E 5, sonst 0 (1 P)',
          'FP aller Vorgänge: D 4, E 5, sonst 0 – insbesondere B = 0 (1 P)',
        ],
      },
      {
        label: 'c)',
        operator: 'ermitteln',
        points: 2,
        prompt: 'Geben Sie die Projektdauer und den kritischen Pfad an und begründen Sie Ihre Angabe.',
        modelAnswer:
          '**Projektdauer: 19 Stunden** (FEZ des Endvorgangs H).\n' +
          '**Kritischer Pfad: A – C – F – G – H**, weil diese Vorgänge den Gesamtpuffer 0 haben; jede Verzögerung auf diesem Weg verschiebt das Projektende. Kontrolle: 3 + 6 + 5 + 3 + 2 = 19 h.\n' +
          'Falle: Die Summe aller Dauern (27 h) ist nicht die Projektdauer – B, C und D laufen parallel.',
        rubric: [
          'Projektdauer 19 h (1 P)',
          'kritischer Pfad A–C–F–G–H, begründet über GP = 0 (1 P)',
        ],
      },
      {
        label: 'd)',
        operator: 'beurteilen',
        points: 3,
        prompt:
          'Betrachten Sie zwei Störungen jeweils einzeln: (1) Die Prüfung der Netzwerkdosen (B) dauert 3 Stunden länger. (2) Der Abbau der Altgeräte (D) dauert 7 statt 2 Stunden. Beurteilen Sie jeweils die Auswirkungen auf die Nachfolger und auf das Projektende.',
        modelAnswer:
          '**(1) B + 3 h:** B endet bei 8 statt 5. Weil der **freie Puffer von B 0** ist, verschiebt sich E sofort auf 8–12. Die 3 h liegen aber im **Gesamtpuffer von 5 h**: E endet vor seinem SEZ 14, G beginnt weiter bei 14, das **Projektende bleibt bei 19 h** (Montag, 11:00 Uhr). E hat danach nur noch 2 h Puffer.\n' +
          '**(2) D + 5 h:** D endet bei 10 statt 5. Die Verzögerung übersteigt den **Gesamtpuffer von 4 h um 1 h**: F beginnt bei max(9, 10) = 10 und endet bei 15, G läuft von 15 bis 18, H von 18 bis 20 → **Projektende 20 h**, also Montag, 16.11.2026, **12:00 Uhr** statt 11:00 Uhr.\n' +
          'Der **kritische Pfad** wechselt auf **A – D – F – G – H** (3 + 7 + 5 + 3 + 2 = 20 h); C hat jetzt 1 h Puffer. Mögliche Maßnahme: den Abbau mit einer zweiten Person beschleunigen oder die Kanzlei rechtzeitig über die spätere Abnahme informieren.',
        rubric: [
          '(1) E verschiebt sich um 3 h, weil FP von B = 0 (1 P)',
          '(1) Projektende bleibt 19 h, weil 3 h ≤ GP 5 h (1 P)',
          '(2) Projektende 20 h (Mo 12:00 Uhr), weil 5 h > GP 4 h; D wird kritisch (1 P)',
        ],
      },
      {
        label: 'e)',
        operator: 'erstellen',
        points: 5,
        prompt:
          'Übertragen Sie den Netzplan in ein Gantt-Diagramm (früheste Lage, auf Papier). Geben Sie für jeden Vorgang Beginn und Ende mit Wochentag und Uhrzeit an und tragen Sie das Projektende als Meilenstein „Abnahme erfolgt“ ein. Geben Sie außerdem die späteste Lage von Vorgang E an.',
        modelAnswer:
          'Umrechnung: Stunde 0 = Do 8:00 Uhr, Stunde 8 = Fr 8:00 Uhr, Stunde 16 = Mo 8:00 Uhr (das Wochenende zählt nicht).\n' +
          '**A:** Do 08–11 Uhr\n' +
          '**B:** Do 11–13 Uhr\n' +
          '**C:** Do 11–16 Uhr und Fr 08–09 Uhr\n' +
          '**D:** Do 11–13 Uhr\n' +
          '**E:** Do 13–16 Uhr und Fr 08–09 Uhr\n' +
          '**F:** Fr 09–14 Uhr\n' +
          '**G:** Fr 14–16 Uhr und Mo 16.11. 08–09 Uhr\n' +
          '**H:** Mo 09–11 Uhr\n' +
          '**Meilenstein „Abnahme erfolgt“:** Mo, 16.11.2026, 11:00 Uhr – als Raute ohne Dauer am Ende von H.\n' +
          '**Späteste Lage von E:** SAZ 10 h = **Fr 10:00 Uhr**, SEZ 14 h = **Fr 14:00 Uhr**. Der Pufferbalken reicht vom frühesten Ende (Fr 09:00 Uhr) bis zum spätesten Ende (Fr 14:00 Uhr) – das sind die 5 h Gesamtpuffer.\n' +
          'Falle: Wer Samstag und Sonntag mitzählt, setzt die Abnahme fälschlich auf Samstag, 11:00 Uhr.',
        rubric: [
          'A, B und D richtig am Donnerstag (1 P)',
          'C und E mit Tageswechsel richtig (Fr 08–09 Uhr) (1 P)',
          'F, G und H richtig, Wochenende ausgelassen (1 P)',
          'Meilenstein Mo, 16.11.2026, 11:00 Uhr ohne Dauer (1 P)',
          'späteste Lage von E: Fr 10:00 bis 14:00 Uhr (1 P)',
        ],
      },
      {
        label: 'f)',
        operator: 'beurteilen',
        points: 3,
        prompt:
          'Ein Kollege hat den Netzplan ebenfalls berechnet. In seinem Auszug stecken drei voneinander unabhängige Fehler:\n' +
          '`B: FAZ 3 · FEZ 5 · SAZ 8 · SEZ 10 · GP 5 · FP 5`\n' +
          '`C: FAZ 3 · FEZ 9 · SAZ 3 · SEZ 9 · GP 0 · FP 0`\n' +
          '`D: FAZ 3 · FEZ 5 · SAZ 7 · SEZ 9 · GP −4 · FP 4`\n' +
          '`E: FAZ 5 · FEZ 9 · SAZ 10 · SEZ 14 · GP 5 · FP 5`\n' +
          '`F: FAZ 5 · FEZ 10 · SAZ 9 · SEZ 14 · GP 0 · FP 0`\n' +
          'Benennen Sie die drei Fehler, geben Sie die richtigen Werte an und nennen Sie jeweils die Regel, gegen die verstoßen wurde.',
        modelAnswer:
          '**Fehler 1 – B, FP 5:** richtig ist **FP 0**. Regel: FP = kleinster FAZ der direkten Nachfolger − eigener FEZ = FAZ E 5 − FEZ B 5 = 0. Der Kollege hat den Gesamtpuffer übernommen.\n' +
          '**Fehler 2 – D, GP −4:** richtig ist **GP 4**. Regel: GP = SAZ − FAZ = 7 − 3; gerechnet wurde FAZ − SAZ. Ohne vorgegebenen späteren Endtermin ist ein negativer Puffer immer ein Rechenfehler.\n' +
          '**Fehler 3 – F, FAZ 5 und FEZ 10:** richtig sind **FAZ 9 und FEZ 14**. Regel: Bei mehreren Vorgängern gilt der **größte** FEZ, hier max(FEZ C 9, FEZ D 5) = 9. Wer nur die GP-Spalte nachrechnet, stößt bei F auf 9 − 5 = 4 statt 0 – die eigentliche Ursache ist aber der falsche FAZ.\n' +
          'Die Werte von C und E sind richtig.',
        rubric: [
          'Fehler bei B erkannt und mit FP 0 samt Regel berichtigt (1 P)',
          'Fehler bei D erkannt: GP 4 = SAZ − FAZ (1 P)',
          'Fehler bei F erkannt: FAZ 9 und FEZ 14 über den größten FEZ der Vorgänger (1 P)',
        ],
      },
    ],
  },
]
