import { TextArea } from "@coco-ui/core";
import { ComponentProps } from "react";
import {
	FieldPath,
	FieldValues,
	UseControllerProps,
	useController,
} from "react-hook-form";

type TextAreaFieldProps<
	TFieldValues extends FieldValues,
	TName extends FieldPath<TFieldValues>,
> = Omit<ComponentProps<typeof TextArea>, "value" | "name"> &
	UseControllerProps<TFieldValues, TName>;

export const TextAreaField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	control,
	shouldUnregister,
	rules,
	...props
}: TextAreaFieldProps<TFieldValues, TName>) => {
	const { field, fieldState } = useController({
		name: props.name,
		control,
		disabled: props.disabled,
		defaultValue: props.defaultValue,
		shouldUnregister,
		rules: {
			required: props.required,
			...rules,
		},
	});

	return (
		<TextArea
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
