import * as Sentry from '@sentry/react'

export const sendErrorToSentry = (error: unknown, extras?: Record<string, unknown>) => {
  Sentry.withScope(scope => {
    if (extras) scope.setExtras(extras)
    Sentry.captureException(error instanceof Error ? error : new Error(JSON.stringify(error)))
  })
}
