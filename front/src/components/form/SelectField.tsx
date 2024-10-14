import { Select } from "@coco-ui/core";
import { ComponentProps } from "react";
import {
	FieldPath,
	FieldValues,
	UseControllerProps,
	useController,
} from "react-hook-form";

type SelectFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = Omit<ComponentProps<typeof Select>, "value" | "name"> &
	UseControllerProps<TFieldValues, TName>;

export const SelectField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
	props: SelectFieldProps<TFieldValues, TName>,
) => {
	const { field, fieldState } = useController({
		name: props.name,
		control: props.control,
		disabled: props.disabled,
		defaultValue: props.defaultValue,
		shouldUnregister: props.shouldUnregister,
		rules: {
      required: props.required,
      ...props.rules,
    },
	});

	return (
		<Select
			{...props}
			error={props.error || fieldState.invalid}
			name={field.name}
			onChange={(event) => {
				field.onChange(event);
				props.onChange?.(event);
			}}
			ref={field.ref}
			disabled={field.disabled || props.disabled}
			value={field.value}
		/>
	);
};
