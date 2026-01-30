import * as Sentry from '@sentry/react'

let initialized = false

export function initSentry() {
  if (initialized) return
  initialized = true

  Sentry.init({
    dsn: 'https://27cf6461cdaf6548656e6514aa88f854@o4510781389078528.ingest.us.sentry.io/4510781390323712',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}
