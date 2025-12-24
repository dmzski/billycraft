import { Tab } from "@billycraft/ui"
import { type ComponentPropsWithoutRef, forwardRef } from "react"
import { Link, useMatch } from "react-router-dom"

type RRTabProps = ComponentPropsWithoutRef<typeof Tab> & {
	to: string
	exact?: boolean
}

export const RRTab = forwardRef<HTMLAnchorElement, RRTabProps>(
	({ to, exact, children, ...props }, ref) => {
		const match = useMatch({
			path: to,
			end: exact,
		})

		return (
			<Tab {...props} isActive={!!match} asChild>
				<Link to={to} ref={ref}>
					{children}
				</Link>
			</Tab>
		)
	},
)
