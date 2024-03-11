import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import App from './App'

import './index.css'

Sentry.init({
  dsn: 'https://aeb327770bc44d91900c6250daa08721@o1262999.ingest.sentry.io/6442376',
  enabled: !import.meta.env.DEV,
  integrations: [
    new BrowserTracing({
      tracingOrigins: ['localhost', 'app.coco-erp.fr', 'api.coco-erp.fr'],
    }),
  ],
  tracesSampleRate: 1.0,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
