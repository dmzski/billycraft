import { type VariantProps, cva } from "class-variance-authority"

import { tw } from "lib/utils"
import { type ComponentPropsWithoutRef, forwardRef } from "react"

const labelVariants = cva(
	"text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
)

export const Label = forwardRef<
	HTMLLabelElement,
	ComponentPropsWithoutRef<"label"> & VariantProps<typeof labelVariants>
>(({ className, htmlFor, ...props }, ref) => (
	// biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
	<label
		ref={ref}
		htmlFor={htmlFor ?? ""}
		className={tw(labelVariants(), className)}
		{...props}
	/>
))
