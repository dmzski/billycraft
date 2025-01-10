import {
	type ChangeEventHandler,
	type FocusEventHandler,
	type KeyboardEventHandler,
	type MouseEventHandler,
	forwardRef,
	useId,
} from "react"

import { Label } from "components/Label"
import { tw } from "lib/utils"

export type TextAreaProps = {
	label?: string
	error?: string | boolean
	required?: boolean
	readOnly?: boolean
	disabled?: boolean
	className?: string
	id?: string
	name?: string
	onBlur?: FocusEventHandler<HTMLTextAreaElement>
	onChange?: ChangeEventHandler<HTMLTextAreaElement>
	onClick?: MouseEventHandler<HTMLTextAreaElement>
	onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement>
	onKeyUp?: KeyboardEventHandler<HTMLTextAreaElement>
	placeholder?: string
	value?: string
	rows?: number
	helper?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	({ className, label, error, id: idProp, helper, ...props }, ref) => {
		const generatedId = useId()
		const id = idProp ?? generatedId
		return (
			<div className={tw("grid w-full gap-1", className)}>
				{label ? <Label htmlFor={id}>{label}</Label> : null}
				<textarea
					aria-invalid={!!error}
					className={tw(
						"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						"aria-[invalid=true]:border-destructive focus:aria-[invalid=true]:ring-destructive",
					)}
					ref={ref}
					{...props}
				/>
				{helper && (!error || typeof error !== "string") ? (
					<span className="label-text-alt opacity-70">{helper}</span>
				) : null}
				{error && typeof error === "string" ? (
					<span className="label-text-alt text-error">{error}</span>
				) : null}
			</div>
		)
	},
)

TextArea.displayName = "TextArea"
