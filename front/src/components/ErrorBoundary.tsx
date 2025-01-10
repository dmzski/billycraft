import { SUPPORT_EMAIL } from "@/constants/global"
import { sendErrorToSentry } from "@/utils/errors"
import { Button } from "@billycraft/ui"
import { Component, type ReactNode } from "react"
import { Link } from "react-router-dom"

type ErrorBoundaryProps = { children: ReactNode }
type ErrorBoundaryState = { hasError: boolean }
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch(error: Error) {
		sendErrorToSentry(error)
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div className="flex flex-col gap-4 items-start">
					<p>
						An error occured please refresh the page or contact the support :{" "}
						{SUPPORT_EMAIL}
					</p>
					<Button asChild>
						<Link
							to="/"
							onClick={() => {
								this.setState({ hasError: false })
							}}
						>
							Go to main page
						</Link>
					</Button>
				</div>
			)
		}

		return this.props.children
	}
}
