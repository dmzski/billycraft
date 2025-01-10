import { Switch } from "@billycraft/ui"
import type { ComponentProps } from "react"
import {
	type FieldPath,
	type FieldValues,
	type UseControllerProps,
	useController,
} from "react-hook-form"

type SwitchFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = Omit<ComponentProps<typeof Switch>, "value" | "name"> &
	UseControllerProps<TFieldValues, TName>

export const SwitchField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	shouldUnregister,
	rules,
	...props
}: SwitchFieldProps<TFieldValues, TName>) => {
	const { field } = useController({
		name: props.name,
		control,
		disabled: props.disabled,
		defaultValue: props.defaultValue,
		shouldUnregister,
		rules: rules,
	})

	return (
		<Switch
			{...props}
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
