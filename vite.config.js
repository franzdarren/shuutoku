import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

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
  plugins: [react()],
  server: { proxy: jishoProxy },
  preview: { proxy: jishoProxy },
})
