import * as React from "react";

import { tw } from "lib/utils";

const Tabs = React.forwardRef<
	HTMLUListElement,
	React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
	<ul
		ref={ref}
		className={tw(
			"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
			className,
		)}
		{...props}
	/>
));
Tabs.displayName = "Tabs";

const tabClassNames =
	"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm";

export const Tab = React.forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<"button"> & {
		asChild?: boolean;
		isActive?: boolean;
	}
>(
	(
		{ className, asChild, role = "tab", isActive, type = "button", ...props },
		ref,
	) => {
		if (asChild && React.isValidElement(props.children)) {
			return React.cloneElement(props.children, {
				...props.children.props,
				className: tw(tabClassNames, className),
				"data-state": isActive ? "active" : "unactive",
				"aria-selected": isActive,
				role,
			} as any);
		}

		return (
			<button
				ref={ref}
				role={role}
				className={tw(tabClassNames, className)}
				type={type}
				data-state={isActive ? "active" : "unactive"}
				aria-selected={isActive}
				{...props}
			/>
		);
	},
);
Tab.displayName = "Tab";

const Exported = {
	...Tabs,
	Tab,
} as typeof Tabs & { Tab: typeof Tab };
export { Exported as Tabs };
