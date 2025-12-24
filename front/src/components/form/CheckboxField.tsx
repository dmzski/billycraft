import { Checkbox } from "@billycraft/ui"
import type { ComponentProps } from "react"
import {
	type FieldPath,
	type FieldValues,
	type UseControllerProps,
	useController,
} from "react-hook-form"

type CheckboxFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = Omit<ComponentProps<typeof Checkbox>, "value" | "name" | "checked"> &
	UseControllerProps<TFieldValues, TName>

export const CheckboxField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	shouldUnregister,
	rules,
	error,
	defaultValue,
	...props
}: CheckboxFieldProps<TFieldValues, TName>) => {
	const { field, fieldState } = useController({
		name: props.name,
		control,
		disabled: props.disabled,
		defaultValue,
		shouldUnregister,
		rules: {
			required: props.required,
			...rules,
		},
	})

	return (
		<Checkbox
			{...props}
			error={error || fieldState.invalid}
			name={field.name}
			onCheckedChange={field.onChange}
			onBlur={(event) => {
				field.onBlur()
				props.onBlur?.(event)
			}}
			ref={field.ref}
			disabled={field.disabled || props.disabled}
			value={field.value ? "on" : "off"}
			checked={field.value}
		/>
	)
}
