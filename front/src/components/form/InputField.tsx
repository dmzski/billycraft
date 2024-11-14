import { Input } from "@billycraft/ui";
import type { ComponentProps } from "react";
import {
	type FieldPath,
	type FieldValues,
	type UseControllerProps,
	useController,
} from "react-hook-form";

type InputFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = Omit<ComponentProps<typeof Input>, "value" | "name"> &
	UseControllerProps<TFieldValues, TName> & { asNumber?: boolean };

export const InputField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	shouldUnregister,
	rules,
	asNumber,
	defaultValue,
	...props
}: InputFieldProps<TFieldValues, TName>) => {
	const { field, fieldState } = useController({
		name: props.name,
		control,
		disabled: props.disabled,
		defaultValue,
		shouldUnregister,
		rules: {
			required: props.required,
			min: props.min,
			max: props.max,
			minLength: props.minLength,
			maxLength: props.maxLength,
			...rules,
		},
	});

	return (
		<Input
			{...props}
			error={props.error || fieldState.invalid}
			name={field.name}
			onChange={(event) => {
				if (asNumber) {
					if (event.target.value !== "") {
						field.onChange(+event.target.value);
					} else {
						field.onChange(null);
					}
				} else {
					field.onChange(event);
				}
				props.onChange?.(event);
			}}
			onBlur={(event) => {
				if (asNumber) {
					if (Number.isNaN(event.target.valueAsNumber)) {
						field.onChange(null);
						event.target.value = "";
					}
				}
				field.onBlur();
				props.onBlur?.(event);
			}}
			ref={field.ref}
			disabled={field.disabled || props.disabled}
			value={`${field.value ?? ""}`}
		/>
	);
};
