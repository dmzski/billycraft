import { Input } from "@coco-ui/core";
import { ComponentProps } from "react";
import {
	FieldPath,
	FieldValues,
	UseControllerProps,
	useController,
} from "react-hook-form";

type InputFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = Omit<ComponentProps<typeof Input>, "value" | "name"> &
	UseControllerProps<TFieldValues, TName>;

export const InputField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
	props: InputFieldProps<TFieldValues, TName>,
) => {
	const { field, fieldState } = useController({
		name: props.name,
		control: props.control,
		disabled: props.disabled,
		defaultValue: props.defaultValue,
		shouldUnregister: props.shouldUnregister,
		rules: {
      required: props.required,
      min: props.min,
      max: props.max,
      minLength: props.minLength,
      maxLength: props.maxLength,
      ...props.rules,
    },
	});

	return (
		<Input
			{...props}
			error={props.error || fieldState.invalid}
			name={field.name}
			onChange={(event) => {
				field.onChange(event);
				props.onChange?.(event);
			}}
			onBlur={(event) => {
				field.onBlur();
				props.onBlur?.(event);
			}}
			ref={field.ref}
			disabled={field.disabled || props.disabled}
			value={field.value}
		/>
	);
};
