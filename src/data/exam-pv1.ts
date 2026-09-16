// Prüfungsaufgaben zur Prüfungsvorbereitung PV1 (WBS). Tag 1: Klassendiagramm (Nachtrag 15.09.2026).
// Tag 2 (16.09.2026): USV (Klasse begründen, Scheinleistung mit Reserve, Shutdown-Zeitbudget) und
// Netzwerkdiagnose mit Windows-Befehlen (ipconfig /all, APIPA, ping von innen nach außen, nslookup,
// Gateway-Plausibilität). Eigene Szenarien (Planungsbüro, Physiotherapiepraxis) statt der WBS-Folien und
// -Übungen, alle Zahlen nachgerechnet. Einordnung Tag 2: USV-Klassen, Leistung und Überbrückungszeit = Kern;
// Shutdown-Software und Wartung = [RAND] (Marker direkt am Teil).
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
]
