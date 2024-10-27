import { Link } from "@coco-ui/core";
import { Link as ReactRouterLink } from "react-router-dom";
import { ComponentProps, forwardRef } from "react";

type RRLinkProps = {
	variant?: ComponentProps<typeof Link>["variant"];
} & ComponentProps<typeof ReactRouterLink>;

export const RRLink = forwardRef<HTMLAnchorElement, RRLinkProps>(
	({ variant, children, to, className, ...props }, ref) => {
		return (
			<Link asChild className={className} variant={variant}>
				<ReactRouterLink ref={ref} to={to} {...props}>
					{children}
				</ReactRouterLink>
			</Link>
		);
	},
);

RRLink.displayName = "RouterLink";
