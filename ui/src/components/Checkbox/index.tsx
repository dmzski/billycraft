import { CheckIcon, MinusIcon } from "@heroicons/react/24/solid"
import clsx from "clsx"
import { Label } from "components/Label"
import { tw } from "lib/utils"
import { type FocusEventHandler, forwardRef, useId, useMemo } from "react"

export type CheckboxProps = {
	label?: string
	labelPosition?: "left" | "right"
	checked: boolean | ("checked" | "unchecked" | "indeterminate")
	error?: boolean
	"aria-label"?: string
	"aria-labelledby"?: string
	value?: string
	onCheckedChange?: (newState: boolean) => void
	onBlur?: FocusEventHandler<HTMLButtonElement>
	disabled?: boolean
	name?: string
	id?: string
	className?: string
	required?: boolean
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
	(
		{
			id: idProp,
			label,
			labelPosition = "right",
			name,
			"aria-label": ariaLabel,
			"aria-labelledby": ariaLabelledBy,
			value,
			checked: checkedProp,
			onCheckedChange,
			disabled = false,
			error = false,
			className,
			required,
			onBlur,
		},
		ref,
	) => {
		const generatedId = useId()
		const id = idProp ?? generatedId

		const checked = useMemo(() => {
			if (checkedProp === undefined || checkedProp === null) {
				return false
			}

			if (typeof checkedProp === "boolean") {
				return checkedProp
			}

			return checkedProp !== "unchecked"
		}, [checkedProp])

		if (!label) {
			return (
				<button
					type="button"
					aria-label={ariaLabel}
					aria-labelledby={ariaLabelledBy}
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="checkbox"
					data-state={checked ? "checked" : "uncheck"}
					aria-checked={checked}
					ref={ref}
					disabled={disabled}
					name={name}
					onBlur={onBlur}
					className={tw(
						"flex items-center justify-center peer size-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
						className,
					)}
					aria-invalid={!!error}
					value={value}
					onClick={() => {
						onCheckedChange?.(!checked)
					}}
					aria-required={required}
				>
					{checked ? (
						<span
							className={tw("flex items-center justify-center text-current")}
						>
							{checkedProp === "indeterminate" ? (
								<MinusIcon className="size-4" />
							) : (
								<CheckIcon className="size-4" />
							)}
						</span>
					) : null}
				</button>
			)
		}

		return (
			<div className={clsx("flex items-center gap-2", className)}>
				{labelPosition === "left" ? <Label htmlFor={id}>{label}</Label> : null}
				<button
					type="button"
					aria-label={ariaLabel}
					aria-labelledby={ariaLabelledBy}
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="checkbox"
					disabled={disabled}
					name={name}
					data-state={checked ? "checked" : "uncheck"}
					aria-checked={checked}
					ref={ref}
					className={tw(
						"flex items-center justify-center peer size-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
					)}
					aria-invalid={!!error}
					value={value}
					onClick={() => {
						onCheckedChange?.(!checked)
					}}
				>
					{checked ? (
						<span
							className={tw("flex items-center justify-center text-current")}
						>
							{checkedProp === "indeterminate" ? (
								<MinusIcon className="size-4" />
							) : (
								<CheckIcon className="size-4" />
							)}
						</span>
					) : null}
				</button>
				{labelPosition === "right" ? <Label htmlFor={id}>{label}</Label> : null}
			</div>
		)
	},
)
Checkbox.displayName = "Checkbox"
