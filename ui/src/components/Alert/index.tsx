import { type VariantProps, cva } from "class-variance-authority"
import { tw } from "lib/utils"
import { type HTMLAttributes, type ReactNode, forwardRef } from "react"

const alertVariants = cva(
	"relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground",
				destructive:
					"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
)

const AlertTitle = forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h5
		ref={ref}
		className={tw("mb-1 font-medium leading-none tracking-tight", className)}
		{...props}
	/>
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={tw("text-sm [&_p]:leading-relaxed", className)}
		{...props}
	/>
))
AlertDescription.displayName = "AlertDescription"

export type AlertProps = HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof alertVariants> & {
		title?: ReactNode
		icon?: ReactNode
		description?: ReactNode
	}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
	({ className, variant, children, title, icon, ...props }, ref) => (
		<div
			ref={ref}
			role="alert"
			className={tw(alertVariants({ variant }), className)}
			{...props}
		>
			{icon ? icon : null}
			{title ? <AlertTitle>{title}</AlertTitle> : null}
			{children ? <AlertDescription>{children}</AlertDescription> : null}
		</div>
	),
)
Alert.displayName = "Alert"
