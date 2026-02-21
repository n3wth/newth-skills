import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import posthog from '@posthog/rollup-plugin'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.POSTHOG_PERSONAL_API_KEY
      ? [posthog({
          personalApiKey: process.env.POSTHOG_PERSONAL_API_KEY,
          projectId: '223560',
          sourcemaps: {
            deleteAfterUpload: true,
          },
        })]
      : []),
    ...(process.env.SENTRY_AUTH_TOKEN
      ? [sentryVitePlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN,
          sourcemaps: {
            filesToDeleteAfterUpload: ['**/*.map']
          },
          telemetry: false
        })]
      : []),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    cssMinify: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'vendor-react'
            }
            if (id.includes('react-router')) {
              return 'vendor-router'
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap'
            }
          }
        },
      },
    },
  },
})
