import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Jisho.org's public API sends no Access-Control-Allow-Origin header, so a
// browser fetch to it from our own origin is always blocked by CORS. Since
// this app is always served through Vite (dev or preview — never opened as
// a bare file://), we proxy it server-side here instead of depending on a
// third-party CORS relay: the request leaves from Node (no CORS involved)
// and the browser just talks to our own origin at /api/jisho.
const jishoProxy = {
  '/api/jisho': {
    target: 'https://jisho.org',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/jisho/, '/api/v1/search/words'),
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    /* Installable and fully usable offline. This is a study app you'd open on
       a train, and the lesson content never changes between deploys, so once
       the ~570 kB content chunk is cached there's nothing left to fetch. */
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['app-icon.svg', 'icons.svg'],
      workbox: {
        // The content chunk is over Workbox's 2 MiB default, and it's the one
        // file most worth having offline.
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
        // Jisho lookups are a live third-party call — never serve them stale,
        // just fall back to the local glossary when offline.
        navigateFallbackDenylist: [/^\/api\//],
      },
      manifest: {
        name: 'Shuutoku — N4 Review Handbook',
        short_name: '習得',
        description: 'A JLPT N4 review handbook: grammar, kanji, reading and conversation practice.',
        lang: 'en',
        start_url: '/',
        display: 'standalone',
        background_color: '#f7f6f2',
        theme_color: '#f7f6f2',
        icons: [
          { src: 'app-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'app-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
    }),
  ],
  server: { proxy: jishoProxy },
  preview: { proxy: jishoProxy },
  build: {
    rollupOptions: {
      output: {
        // The lesson content is ~90% of the bundle and changes far less often
        // than the app code, so it gets its own chunk: editing a component no
        // longer invalidates 750 kB of grammar and kanji in everyone's cache.
        manualChunks(id) {
          if (id.includes('/src/data/') && id.endsWith('.json')) return 'content'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})
