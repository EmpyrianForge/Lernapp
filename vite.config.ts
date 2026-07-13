import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Offline-first PWA. Die App darf komplett ohne Netz laufen (Klausurvorbereitung,
// mobil, unterwegs). Deshalb: App-Shell + Assets werden per Service Worker gecacht.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'AP1 Lernapp — FIAE',
        short_name: 'AP1 Lernapp',
        description:
          'Vorbereitung auf die IHK-Abschlussprüfung Teil 1 (Fachinformatiker Anwendungsentwicklung).',
        theme_color: '#0b0c0e',
        background_color: '#0b0c0e',
        display: 'standalone',
        lang: 'de',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: { enabled: false },
    }),
  ],
})
