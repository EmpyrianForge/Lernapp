# Auf dem Handy nutzen / Deployen

Die App ist eine **statische PWA** — `npm run build` erzeugt den Ordner `dist/`, der komplett
ohne Server läuft. Nach der Installation funktioniert sie **offline**.

> ⚠️ Wichtig: Ein installierbarer, offline-fähiger PWA-Service-Worker braucht einen
> **sicheren Kontext (HTTPS)** oder `localhost`. Über eine reine LAN-IP per `http://` wird
> der Service Worker vom Browser **nicht** registriert — die App lädt dann zwar, ist aber
> nicht „echt" offline-installierbar. Für die volle Installation daher HTTPS-Hosting nutzen.

---

## Option A (empfohlen): Kostenloses HTTPS-Hosting → echte Installation

Damit bekommst du eine dauerhafte `https://…`-URL, die du am Handy installierst.

**Am einfachsten — Netlify Drop (kein CLI):**
1. `npm run build` ausführen → Ordner `dist/` entsteht.
2. <https://app.netlify.com/drop> öffnen und den **`dist/`-Ordner** per Drag & Drop hochladen.
3. Du bekommst sofort eine HTTPS-URL. (Mit kostenlosem Account bleibt sie dauerhaft.)

**Alternativen:** Cloudflare Pages, Vercel, GitHub Pages — alle liefern HTTPS. Jeweils den
Inhalt von `dist/` als statische Site hochladen. (`base: './'` ist gesetzt, funktioniert also
auch in einem Unterpfad.)

### Vercel (empfohlene Alternative, HTTPS automatisch)

Vercel erkennt Vite automatisch — **Build Command** `npm run build`, **Output Directory** `dist`,
keine Extra-Config nötig. Der Cloud-Build funktioniert ohne den Obsidian-Vault, weil der
gebündelte Seed `src/data/content.generated.json` eingecheckt ist und das Ingest-Skript die
fehlende Vault-Quelle sauber überspringt.

**Weg 1 — CLI, ohne GitHub (am schnellsten):**
```bash
npm i -g vercel
cd C:/Users/kvnba/OneDrive/LernApp
vercel            # einmalig: Login im Browser, dann Projekt bestätigen
vercel --prod     # produktives Deployment → dauerhafte https://…vercel.app-URL
```

**Weg 2 — Git + Vercel-Dashboard (Auto-Deploy bei jedem Push):**
1. Repo anlegen und pushen (z. B. zu GitHub).
2. Auf vercel.com „New Project" → das Repo importieren.
3. Framework „Vite" wird erkannt → Deploy. Jeder Push deployt automatisch neu.

> Beide Wege brauchen einen (kostenlosen) Vercel-Login und veröffentlichen die App unter
> einer **öffentlichen** URL. Die App enthält keine personenbezogenen Daten (Lernstand bleibt
> lokal im Browser), daher unbedenklich. Den Login/Upload machst **du** — ich bereite alles vor.

**Installieren am Handy:**
- URL im Handy-Browser öffnen → Menü → **„Zum Startbildschirm hinzufügen"** (Android/Chrome)
  bzw. **Teilen → „Zum Home-Bildschirm"** (iOS/Safari).
- Danach startet die App wie eine native App und läuft offline.

> Dieser Upload veröffentlicht die App bei einem externen Dienst und braucht deinen Account —
> deshalb machst **du** diesen Schritt (oder gib mir kurz frei, dich durchzuführen).

---

## Option B: Nur schnell am Handy ansehen (gleiches WLAN, ohne Hosting)

Zum reinen Anschauen (ohne echte Offline-Installation, da http):
1. `npm run build`
2. `npm run preview -- --host --port 4173`
   (oder Preview-Server `lernapp-preview` aus der Launch-Config starten)
3. Am Handy im **selben WLAN** öffnen: **http://192.168.8.161:4173**
   (LAN-IP dieses Rechners; ändert sich ggf. — dann neu ermitteln mit `ipconfig`.)

Der Rechner muss dabei laufen und im selben Netz sein.

---

## Build-Kommandos

```bash
npm run build      # dist/ erzeugen (PWA)
npm run preview    # dist/ lokal servieren (Standard localhost:4173)
```

Der Lernstand liegt lokal im Browser (IndexedDB) und ist **pro Gerät/Browser getrennt**.
Zum Übertragen auf ein anderes Gerät: in den **Einstellungen → Export**, Datei aufs andere
Gerät bringen, dort **Import**.
