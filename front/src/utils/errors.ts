import * as Sentry from '@sentry/react'

export const sendErrorToSentry = (error: unknown) => {
  Sentry.captureException(JSON.stringify(error))
}
