import { Label } from "components/Label";
import { tw } from "lib/utils";
import {
	type ChangeEventHandler,
	type FocusEventHandler,
	type KeyboardEventHandler,
	type MouseEventHandler,
	type ReactNode,
	forwardRef,
	useId,
} from "react";

export type InputProps = {
	label?: string;
	error?: string | boolean;
	type?: string;
	required?: boolean;
	disabled?: boolean;
	name?: string;
	id?: string;
	onFocus?: FocusEventHandler<HTMLInputElement>;
	onBlur?: FocusEventHandler<HTMLInputElement>;
	onChange?: ChangeEventHandler<HTMLInputElement>;
	onClick?: MouseEventHandler<HTMLInputElement>;
	className?: string;
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
	onKeyUp?: KeyboardEventHandler<HTMLInputElement>;
	placeholder?: string;
	value?: string | number;
	autoComplete?: string;
	autoCorrect?: string;
	inputMode?:
		| "text"
		| "none"
		| "search"
		| "email"
		| "tel"
		| "numeric"
		| "decimal"
		| "url";
	pattern?: string;
	autoCapitalize?: string;
	min?: number;
	max?: number;
	maxLength?: number;
	minLength?: number;
	step?: number;
	readOnly?: boolean;
	prefix?: ReactNode;
	suffix?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			id: idProp,
			className,
			error,
			prefix,
			suffix,
			required,
			type = "text",
			disabled,
			onChange,
			...props
		},
		ref,
	) => {
		const generatedId = useId();
		const id = idProp ?? generatedId;

		return (
			<div className={tw("grid w-full gap-1", className)}>
				{label ? (
					<Label htmlFor={id} className="flex items-center">
						{label}
						{required ? <span>*</span> : null}
					</Label>
				) : null}
				<div
					aria-disabled={disabled}
					aria-invalid={!!error}
					data-type={type}
					data-has-prefix={!!prefix}
					data-has-suffix={!!suffix}
					className={tw(
						"flex items-center gap-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background",
						"data-[type=file]:border-0 data-[type=file]:bg-transparent data-[type=file]:text-sm data-[type=file]:font-medium data-[type=file]:text-foreground",
						"focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
						"aria-[disabled=true]:cursor-not-allowed aria-[disabled=true]:opacity-50",
						"data-[has-prefix=true]:pl-0 data-[has-suffix=true]:pr-0",
						"aria-[invalid=true]:border-destructive focus-within:aria-[invalid=true]:ring-destructive",
					)}
				>
					{prefix ? (
						<div className="border-r h-full flex items-center">{prefix}</div>
					) : null}
					<input
						className="bg-background grow min-w-0 outline-none placeholder:text-muted-foreground py-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
						{...props}
						aria-invalid={!!error}
						onChange={onChange}
						disabled={disabled}
						type={type}
						ref={ref}
						required={required}
						id={id}
					/>
					{required && !label ? <span>*</span> : null}
					{suffix ? (
						<div className="border-l h-full flex items-center">{suffix}</div>
					) : null}
				</div>
				{error && typeof error === "string" ? (
					<span className="text-xs text-destructive">{error}</span>
				) : null}
			</div>
		);
	},
);

Input.displayName = "Input";
