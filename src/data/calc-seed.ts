import type { CalcItem } from '../types'
import extra from './calc-extra.json'

// Handkuratierte Rechenaufgaben (type: "calc") — 1:1 aus den Musterlösungen in
// 03-Rechenschemata.md abgeleitet. Jede Aufgabe trägt solutionSteps + rubric
// (Teilpunkte) + unit + pitfalls, damit die Prüfungstaktik „Formel + Weg + Einheit"
// (02-Aufgabentypen-Operatoren.md) trainiert wird.

const base = {
  type: 'calc' as const,
  operator: 'berechnen' as const,
  afb: 'I–II',
  ap1Status: 'core' as const,
  tags: ['ap1', 'rechnen'],
  source: 'Lernapp/03-Rechenschemata.md',
}

const CALC_BASE: CalcItem[] = [
  {
    ...base,
    id: 'calc--subnetting-26',
    topicId: 'netzwerke',
    examFrequency: 0.88,
    points: 4,
    prompt:
      'Gegeben ist das Netz 192.168.1.0/26. Bestimmen Sie Subnetzmaske, Blockgröße und Anzahl nutzbarer Hosts sowie für das erste Subnetz die Netz-, erste/letzte Host- und Broadcast-Adresse.',
    solutionSteps: [
      'Hostbits = 32 − 26 = 6 → Adressen gesamt = 2^6 = 64',
      'Nutzbare Hosts = 2^6 − 2 = 62 (−2 für Netz- und Broadcast-Adresse)',
      'Subnetzmaske: 26 Bit → 255.255.255.192',
      'Blockgröße = 256 − 192 = 64 → Subnetze .0 / .64 / .128 / .192',
      'Erstes Subnetz .0: Netz = .0, erste Host = .1, letzte Host = .62, Broadcast = .63',
    ],
    answer: 'Maske 255.255.255.192, Blockgröße 64, 62 nutzbare Hosts; Subnetz .0: Netz .0 / Host .1–.62 / Broadcast .63',
    unit: '—',
    rubric: [
      { criterion: 'Subnetzmaske 255.255.255.192', points: 1 },
      { criterion: 'Blockgröße 64', points: 1 },
      { criterion: '62 nutzbare Hosts', points: 1 },
      { criterion: 'Broadcast .63 korrekt', points: 1 },
    ],
    pitfalls: ['„Adressen" (64) vs „Hosts" (62) verwechseln', 'Broadcast ist die letzte Adresse im Block'],
  },
  {
    ...base,
    id: 'calc--stromkosten-jahr',
    topicId: 'wirtschaftlichkeit',
    examFrequency: 1.0,
    points: 3,
    prompt:
      '10 Geräte mit je 5 W laufen ein Jahr (8.760 h) durch. Der Strompreis beträgt 0,2108 €/kWh netto. Berechnen Sie die jährlichen Stromkosten netto und brutto (19 % USt).',
    solutionSteps: [
      'Gesamtleistung = 10 × 5 W = 50 W',
      'Energie = P × t = 50 W × 8.760 h = 438.000 Wh = 438 kWh',
      'Kosten netto = 438 kWh × 0,2108 €/kWh = 92,33 €',
      'Kosten brutto = 92,33 € × 1,19 = 109,87 €',
    ],
    answer: '438 kWh → 92,33 € netto → 109,87 € brutto',
    unit: '€',
    rubric: [
      { criterion: 'Energie 438 kWh', points: 1 },
      { criterion: '92,33 € netto', points: 1 },
      { criterion: '109,87 € brutto', points: 1 },
    ],
    pitfalls: ['8.760 h/Jahr', 'Wh → kWh (/1000)', 'netto → brutto (×1,19)'],
  },
  {
    ...base,
    id: 'calc--bezugspreis',
    topicId: 'wirtschaftlichkeit',
    examFrequency: 1.0,
    points: 3,
    prompt:
      'Listen-Einkaufspreis 1.000 €, 10 % Rabatt, 2 % Skonto, 30 € Bezugskosten. Berechnen Sie den Bezugspreis (Einstandspreis).',
    solutionSteps: [
      'Listen-EK 1.000 € − 10 % Rabatt = 900 € (Zieleinkaufspreis)',
      '900 € − 2 % Skonto = 882 € (Bareinkaufspreis)',
      '882 € + 30 € Bezugskosten = 912 € (Bezugspreis)',
    ],
    answer: '912 €',
    unit: '€',
    rubric: [
      { criterion: 'Zieleinkaufspreis 900 €', points: 1 },
      { criterion: 'Bareinkaufspreis 882 €', points: 1 },
      { criterion: 'Bezugspreis 912 €', points: 1 },
    ],
    pitfalls: ['Skonto wird vom Zieleinkaufspreis (nach Rabatt) abgezogen, nicht vom Listenpreis'],
  },
  {
    ...base,
    id: 'calc--nutzwertanalyse',
    topicId: 'wirtschaftlichkeit',
    examFrequency: 1.0,
    points: 3,
    prompt:
      'Zwei Alternativen werden nach drei Kriterien mit den Gewichten 0,40 / 0,35 / 0,25 bewertet. Alternative A: 8 / 7 / 9 Punkte, Alternative B: 7 / 8 / 6 Punkte. Berechnen Sie die Nutzwerte und benennen Sie den Sieger.',
    solutionSteps: [
      'Gewichtssumme prüfen: 0,40 + 0,35 + 0,25 = 1,00 ✓',
      'Nutzwert A = 8·0,40 + 7·0,35 + 9·0,25 = 3,20 + 2,45 + 2,25 = 7,90',
      'Nutzwert B = 7·0,40 + 8·0,35 + 6·0,25 = 2,80 + 2,80 + 1,50 = 7,10',
      '7,90 > 7,10 → Alternative A gewinnt',
    ],
    answer: 'Nutzwert A = 7,90; Nutzwert B = 7,10 → Alternative A wird gewählt',
    unit: 'Nutzwertpunkte',
    rubric: [
      { criterion: 'Nutzwert A = 7,90', points: 1 },
      { criterion: 'Nutzwert B = 7,10', points: 1 },
      { criterion: 'Entscheidung (A) ausdrücklich benannt', points: 1 },
    ],
    pitfalls: ['Gewichtssumme muss 1,0 sein', 'Entscheidung ausdrücklich benennen (häufigster Punktverlust)', 'Bei Kosten-Kriterien Skala umdrehen (niedrig = besser)'],
  },
  {
    ...base,
    id: 'calc--amortisation',
    topicId: 'wirtschaftlichkeit',
    examFrequency: 1.0,
    points: 2,
    prompt:
      'Eine Investition kostet 12.000 €. Der jährliche Rückfluss (Gewinn + Abschreibung) beträgt 4.000 €. Berechnen Sie die Amortisationsdauer.',
    solutionSteps: [
      'Amortisationsdauer = Investition / jährlicher Rückfluss',
      '= 12.000 € / 4.000 € = 3 Jahre',
    ],
    answer: '3 Jahre',
    unit: 'Jahre',
    rubric: [
      { criterion: 'Formel korrekt', points: 1 },
      { criterion: 'Ergebnis 3 Jahre', points: 1 },
    ],
    pitfalls: ['Rückfluss = Gewinn + Abschreibung (nicht nur Gewinn)'],
  },
  {
    ...base,
    id: 'calc--break-even',
    ap1Status: 'ap2-grundlagen',
    topicId: 'wirtschaftlichkeit',
    examFrequency: 1.0,
    points: 2,
    prompt:
      'Fixkosten 20.000 €, Verkaufspreis 50 €/Stück, variable Stückkosten 30 €/Stück. Berechnen Sie die Break-Even-Menge.',
    solutionSteps: [
      'Deckungsbeitrag/Stück = 50 € − 30 € = 20 €',
      'Break-Even-Menge = Fixkosten / Deckungsbeitrag = 20.000 € / 20 € = 1.000 Stück',
    ],
    answer: '1.000 Stück',
    unit: 'Stück',
    rubric: [
      { criterion: 'Deckungsbeitrag 20 €', points: 1 },
      { criterion: 'Break-Even 1.000 Stück', points: 1 },
    ],
    pitfalls: ['Nenner ist der Deckungsbeitrag (Preis − variable Stückkosten), nicht die Gesamtkosten'],
  },
  {
    ...base,
    id: 'calc--datenuebertragung',
    topicId: 'neu-2025',
    examFrequency: 0.9,
    points: 2,
    prompt:
      'Eine 500-MB-Datei wird über eine 50-Mbit/s-Leitung übertragen. Wie lange dauert die Übertragung? (1 Byte = 8 Bit)',
    solutionSteps: [
      'Datenmenge in Bit: 500 MB × 8 = 4.000 Mbit',
      'Übertragungszeit = Datenmenge / Datenrate = 4.000 Mbit / 50 Mbit/s = 80 s',
    ],
    answer: '80 s',
    unit: 's',
    rubric: [
      { criterion: 'Umrechnung MB → Mbit (×8)', points: 1 },
      { criterion: 'Ergebnis 80 s', points: 1 },
    ],
    pitfalls: ['Datenrate in Mbit/s, Dateigröße in MB — vor dem Rechnen auf gleiche Einheit (Bit) bringen', 'MB (×1000) vs MiB (×1024) — Basis angeben'],
  },
  {
    ...base,
    id: 'calc--chmod-oktal',
    topicId: 'betriebssysteme',
    examFrequency: 0.63,
    points: 3,
    prompt:
      'Ein Skript soll für den Eigentümer les-, schreib- und ausführbar sein, für Gruppe und andere nur les- und ausführbar. Geben Sie die oktale chmod-Zahl und die symbolische Darstellung an.',
    solutionSteps: [
      'Wertigkeiten: r = 4, w = 2, x = 1',
      'user: rwx = 4+2+1 = 7',
      'group: r-x = 4+1 = 5',
      'others: r-x = 4+1 = 5',
      '→ 755 = rwxr-xr-x',
    ],
    answer: '755 (rwxr-xr-x)',
    unit: '—',
    rubric: [
      { criterion: 'user = 7', points: 1 },
      { criterion: 'group/others = 5', points: 1 },
      { criterion: 'symbolisch rwxr-xr-x', points: 1 },
    ],
    pitfalls: ['r=4, w=2, x=1 je Stelle summieren'],
  },
  {
    ...base,
    id: 'calc--bildspeicher',
    topicId: 'hardware',
    examFrequency: 1.0,
    points: 3,
    prompt:
      'Ein unkomprimiertes Bild ist 1920 × 1080 Pixel groß bei 24 Bit Farbtiefe. Berechnen Sie den Speicherbedarf in MB (1 MB = 1.000.000 Byte).',
    solutionSteps: [
      'Pixelzahl = 1920 × 1080 = 2.073.600 Pixel',
      'Bit = Pixel × Farbtiefe = 2.073.600 × 24 = 49.766.400 Bit',
      'Byte = Bit / 8 = 6.220.800 Byte',
      'MB = 6.220.800 / 1.000.000 ≈ 6,22 MB',
    ],
    answer: '≈ 6,22 MB',
    unit: 'MB',
    rubric: [
      { criterion: 'Pixelzahl 2.073.600', points: 1 },
      { criterion: 'Bit → Byte (/8)', points: 1 },
      { criterion: 'Ergebnis ≈ 6,22 MB', points: 1 },
    ],
    pitfalls: ['Farbtiefe in Bit pro Pixel', '/8 für Byte', 'MB (×10^6) vs MiB (×2^20) angeben'],
  },
  {
    ...base,
    id: 'calc--roi',
    topicId: 'wirtschaftlichkeit',
    examFrequency: 1.0,
    points: 2,
    prompt:
      'Ein Projekt erzielt 15.000 € Gewinn bei 60.000 € eingesetztem Kapital. Berechnen Sie den ROI in Prozent.',
    solutionSteps: [
      'ROI = Gewinn / eingesetztes Kapital × 100',
      '= 15.000 € / 60.000 € × 100 = 25 %',
    ],
    answer: '25 %',
    unit: '%',
    rubric: [
      { criterion: 'Formel korrekt', points: 1 },
      { criterion: 'Ergebnis 25 %', points: 1 },
    ],
    pitfalls: ['ROI wird in Prozent angegeben (× 100)'],
  },
  {
    ...base,
    id: 'calc--afa-linear',
    ap1Status: 'ap2-grundlagen',
    topicId: 'wirtschaftlichkeit',
    examFrequency: 1.0,
    points: 2,
    prompt:
      'Eine Maschine kostet 20.000 €, hat einen Restwert von 2.000 € und eine Nutzungsdauer von 6 Jahren. Berechnen Sie die jährliche lineare Abschreibung (AfA).',
    solutionSteps: [
      'AfA = (Anschaffungswert − Restwert) / Nutzungsdauer',
      '= (20.000 € − 2.000 €) / 6 = 18.000 € / 6 = 3.000 €/Jahr',
    ],
    answer: '3.000 € pro Jahr',
    unit: '€',
    rubric: [
      { criterion: 'Restwert abgezogen (18.000 €)', points: 1 },
      { criterion: 'Ergebnis 3.000 €/Jahr', points: 1 },
    ],
    pitfalls: ['Restwert vor der Division abziehen', 'durch die Nutzungsdauer (Jahre) teilen'],
  },
  {
    ...base,
    id: 'calc--stundensatz',
    topicId: 'wirtschaftlichkeit',
    examFrequency: 1.0,
    points: 3,
    prompt:
      'Ein IT-Dienstleister hat jährliche Gesamtkosten von 120.000 € bei 1.500 produktiven Stunden pro Jahr. Er kalkuliert einen Gewinnaufschlag von 20 %. Berechnen Sie den Stundenverrechnungssatz.',
    solutionSteps: [
      'Selbstkosten je Stunde = Gesamtkosten / produktive Stunden = 120.000 € / 1.500 h = 80 €/h',
      'Gewinnaufschlag 20 %: 80 €/h × 1,20 = 96 €/h',
    ],
    answer: '96 €/Stunde',
    unit: '€/h',
    rubric: [
      { criterion: 'Selbstkostensatz 80 €/h', points: 1 },
      { criterion: 'Gewinnaufschlag angewandt', points: 1 },
      { criterion: 'Ergebnis 96 €/h', points: 1 },
    ],
    pitfalls: ['nur produktive Stunden ansetzen (nicht die volle Jahresarbeitszeit)', 'Gewinnaufschlag auf die Selbstkosten (× 1,20)'],
  },
]

// Zusätzliche, per Workflow generierte & fachlich gegengeprüfte Rechenaufgaben.
export const CALC_ITEMS: CalcItem[] = [...CALC_BASE, ...(extra as CalcItem[])]
