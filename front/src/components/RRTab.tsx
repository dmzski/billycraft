import { Tab } from "@billycraft/ui";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { Link, useRouteMatch } from "react-router-dom";

type RRTabProps = ComponentPropsWithoutRef<typeof Tab> & {
	to: string;
	exact?: boolean;
};

export const RRTab = forwardRef<HTMLAnchorElement, RRTabProps>(
	({ to, exact, children, ...props }, ref) => {
		const match = useRouteMatch({
			path: to,
			exact,
		});

		return (
			<Tab {...props} isActive={!!match} asChild>
				<Link to={to} ref={ref}>
					{children}
				</Link>
			</Tab>
		);
	},
);
