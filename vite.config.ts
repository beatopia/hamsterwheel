import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { onRequestGet } from './functions/api/lastfm'

function readLocalBindings() {
  try {
    return Object.fromEntries(
      readFileSync(resolve(process.cwd(), '.dev.vars'), 'utf8')
        .split(/\r?\n/)
        .flatMap((line) => {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('#')) return []
          const separator = trimmed.indexOf('=')
          if (separator < 1) return []
          const key = trimmed.slice(0, separator).trim()
          let value = trimmed.slice(separator + 1).trim()
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1)
          }
          return [[key, value]]
        }),
    )
  } catch {
    return {}
  }
}

function localLastFmApi(): Plugin {
  return {
    name: 'local-lastfm-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/lastfm', (request, response, next) => {
        if (request.method !== 'GET') return next()

        void (async () => {
          const apiResponse = await onRequestGet({ env: readLocalBindings() })
          response.statusCode = apiResponse.status
          apiResponse.headers.forEach((value, name) => response.setHeader(name, value))
          response.end(await apiResponse.text())
        })().catch(() => {
          response.statusCode = 502
          response.end()
        })
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localLastFmApi()],
  server: {
    port: 3000,
    open: true
  }
})
