import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import * as Sentry from "@sentry/react"
import App from "./App"
import "./index.css"
import { Badge } from "@billycraft/ui"

Sentry.init({
	dsn: "https://aeb327770bc44d91900c6250daa08721@o1262999.ingest.sentry.io/6442376",
	enabled: !import.meta.env.DEV,
	integrations: [],
	tracePropagationTargets: [
		"localhost",
		"app.billycraft.fr",
		"api.billycraft.fr",
	],
	tracesSampleRate: 1.0,
})

ReactDOM.createRoot(
	document.getElementById("root") as HTMLDivElement,
	{
		// Callback called when an error is thrown and not caught by an ErrorBoundary.
		onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
			console.warn("Uncaught error", error, errorInfo.componentStack)
		}),
		// Callback called when React catches an error in an ErrorBoundary.
		onCaughtError: Sentry.reactErrorHandler(),
		// Callback called when React automatically recovers from errors.
		onRecoverableError: Sentry.reactErrorHandler(),
	},
).render(
	<StrictMode>
		<App />
		{import.meta.env.MODE === "staging" ? (
			<Badge className="absolute top-1 left-2">STAGING</Badge>
		) : null}
	</StrictMode>,
)
