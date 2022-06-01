import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import App from './App'
import * as serviceWorker from './serviceWorker'

import '@coco-ui/core/dist/index.css'
import './assets/main.css'

if (window.localStorage.getItem('theme') === 'dark') {
  document.body.dataset.theme = 'dark'
}

Sentry.init({
  dsn: 'https://aeb327770bc44d91900c6250daa08721@o1262999.ingest.sentry.io/6442376',
  integrations: [
    new BrowserTracing({
      tracingOrigins: ['localhost', 'app.coco-erp.fr', 'api.coco-erp.fr'],
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
})

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
