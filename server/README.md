# Backup-Server (VPS) für die AP1 Lernapp

Ein winziger Dienst, der deinen Lernstand als **ein JSON-Blob je geheimem Schlüssel**
speichert. Kein Konto-System, keine externen Dependencies (nur Node). Die App sichert per
HTTPS dorthin und kann jederzeit wiederherstellen.

> **Warum HTTPS Pflicht ist:** Die App läuft über HTTPS (Vercel). Ein Browser darf von
> einer HTTPS-Seite keine unverschlüsselten (`http://`) Adressen aufrufen. Der Backup-Endpunkt
> braucht deshalb eine **Domain + TLS-Zertifikat**.

Es gibt zwei Wege — je nachdem, ob auf deinem Server **schon ein Reverse Proxy läuft**:

| Situation | Nimm |
|---|---|
| Es läuft bereits **Traefik / nginx** auf Port 443 | **Weg A** (hinter bestehendem Proxy) — Standard |
| Server ist „leer", Port 80 + 443 frei | **Weg B** (Caddy bringt HTTPS selbst mit) |

Kurz prüfen, was zutrifft:

```bash
ss -tlnp | grep -E ':(80|443)'    # zeigt an, ob/was 80/443 belegt (traefik? nginx? nichts?)
docker ps                          # laeuft dort schon ein traefik-Container?
```

---

## Weg A — hinter bestehendem Reverse Proxy (Standard)

Der Backup-Container lauscht **nur auf dem Docker-Gateway** `172.17.0.1:8787` (nicht öffentlich).
Dein vorhandener Proxy terminiert TLS und leitet auf diesen Port weiter.

**1. Dienst starten:**

```bash
cd server
cp .env.example .env
nano .env                 # ALLOW_ORIGIN auf die App-URL setzen (DOMAIN hier egal)
docker compose up -d      # nutzt docker-compose.yml (nur der Backup-Container)
```

**2. (Sub-)Domain anlegen:** A-Record `backup.deine-domain.de → <VPS-IP>` beim DNS-Anbieter.

**3a. Traefik (File-Provider):** `traefik/backup.yml` anpassen (Domain, evtl. entryPoint/
certResolver-Namen) und in den Dynamic-Ordner deiner Traefik-Instanz kopieren, z. B.:

```bash
cp traefik/backup.yml /docker/traefik/dynamic/backup.yml
# Domain im File eintragen; Traefik laedt die Datei automatisch nach (kein Neustart noetig)
```

> Gateway-IP prüfen, falls nicht 172.17.0.1: `docker network inspect bridge | grep Gateway`

**3b. nginx (statt Traefik):** einen `server`-Block mit deinem Zertifikat und
`proxy_pass http://172.17.0.1:8787;` anlegen (oder `127.0.0.1:8787`, wenn nginx auf dem Host
statt im Container läuft — dann in `docker-compose.yml` die Bindung auf `127.0.0.1:8787:8787`
ändern).

**4. Testen** (siehe Abschnitt „Testen & App" unten).

---

## Weg B — Caddy bringt HTTPS selbst mit (leerer Server)

Nur wenn **kein** Proxy läuft und 80 + 443 frei sind:

```bash
cd server
cp .env.example .env
nano .env                 # DOMAIN=... und ALLOW_ORIGIN=... eintragen
docker compose -f docker-compose.caddy.yml up -d
```

Nach ~30 s holt Caddy automatisch ein Zertifikat; `https://DEINE-DOMAIN/health` liefert `{"ok":true}`.

Keine eigene Domain? Kostenlos z. B. via **DuckDNS** (`deinname.duckdns.org`) — auch damit
bekommt Caddy ein gültiges Zertifikat.

---

## Testen & App

**Erreichbarkeit prüfen** (nach Weg A oder B):

```bash
KEY="dein-langer-geheimer-schluessel"
curl https://backup.deine-domain.de/health
curl -X PUT https://backup.deine-domain.de/backup -H "Authorization: Bearer $KEY" \
     -H "Content-Type: application/json" -d '{"test":123}'
curl https://backup.deine-domain.de/backup -H "Authorization: Bearer $KEY"
```

`/health` → `{"ok":true}`, das PUT → `{"ok":true,"savedAt":...}`, das GET gibt den Blob zurück.

**In der App einrichten** — Einstellungen → **Cloud-Backup (VPS)**:

- **Server-URL**: `https://backup.deine-domain.de`
- **Geheimer Schlüssel**: langer Zufallswert (min. 16 Zeichen), z. B. `openssl rand -hex 24`.
  **Denselben** Schlüssel auf jedem Gerät verwenden, das denselben Stand teilen soll.
- **Verbindung testen** → **Jetzt sichern** → optional **Auto-Backup** an.

> Der Schlüssel ist dein Zugang: Wer ihn kennt, kann den Lernstand lesen/überschreiben —
> also geheim halten. Auf einem anderen Gerät denselben Schlüssel eintragen und
> **Wiederherstellen** wählen.

---

## Betrieb

- Daten liegen als JSON-Dateien im `data/`-Ordner (Docker-Volume) — ins Server-Backup aufnehmen.
- Logs: `docker compose logs -f backup`
- Update: Dateien ersetzen, `docker compose up -d --build` (bzw. `-f docker-compose.caddy.yml`).
- Der `data/`-Ordner ist per `.gitignore` ausgenommen und wird nie eingecheckt.
