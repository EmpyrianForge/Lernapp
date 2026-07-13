// Erzeugt die PWA-Icons (PNG) aus public/favicon.svg via sharp.
// Ausführung: `npm run gen-icons`. Muss nur bei Icon-Änderungen neu laufen;
// die erzeugten PNGs werden eingecheckt.

import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pub = join(__dirname, '..', 'public')
const iconsDir = join(pub, 'icons')
mkdirSync(iconsDir, { recursive: true })

const svg = readFileSync(join(pub, 'favicon.svg'))

// Standard-Icons (any) + Apple-Touch-Icon
await sharp(svg, { density: 512 }).resize(192, 192).png().toFile(join(iconsDir, 'icon-192.png'))
await sharp(svg, { density: 512 }).resize(512, 512).png().toFile(join(iconsDir, 'icon-512.png'))
await sharp(svg, { density: 512 }).resize(180, 180).png().toFile(join(pub, 'apple-touch-icon.png'))

// Maskable: Motiv auf 80 % skaliert, zentriert auf voller Theme-Hintergrundfläche
// (Safe-Zone für Icon-Masken auf Android/iOS).
const inner = await sharp(svg, { density: 512 }).resize(410, 410).png().toBuffer()
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#0f172a' } })
  .composite([{ input: inner, gravity: 'center' }])
  .png()
  .toFile(join(iconsDir, 'icon-512-maskable.png'))

console.log('[gen-icons] ✔ icon-192, icon-512, icon-512-maskable, apple-touch-icon erzeugt')
