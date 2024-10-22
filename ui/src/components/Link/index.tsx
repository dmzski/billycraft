import { tw } from "lib/utils";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const Link = forwardRef<
	HTMLAnchorElement,
	ComponentPropsWithoutRef<"a">
>(({ className, children, ...props }, ref) => {
	return (
		<a
			ref={ref}
			className={tw(
				"text-foreground hover:underline font-semibold underline-offset-4 cursor-pointer",
				className,
			)}
			{...props}
		>
			{children}
		</a>
	);
});
Link.displayName = "Link";
