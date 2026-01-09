/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/anti/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'favicon.png'],
      manifest: {
        name: 'Anti List',
        short_name: 'Anti List',
        description: 'A progressive list management app',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1300,
  },
  // @ts-expect-error: Vitest types definition
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    // Här konfigurerar vi specifika filer för specifika reporters
    reporters: ['default', 'vitest-sonar-reporter'],
    outputFile: {
      'vitest-sonar-reporter': 'dist/sonar-report.xml', // Denna behövs för Sonar
      'junit': 'dist/test-results.xml' // Om du även vill ha JUnit (valfritt)
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
    },
  },
})



