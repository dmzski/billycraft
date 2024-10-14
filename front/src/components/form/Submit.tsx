import { Button } from "@coco-ui/core";
import { ComponentProps } from "react";
import { useFormState } from "react-hook-form";

type SubmitProps = ComponentProps<typeof Button>;

export const Submit = ({ disabled, children, ...rest }: SubmitProps) => {
	const { isValid, isSubmitting, isValidating } = useFormState();

	return (
		<Button
			{...rest}
			disabled={disabled || !isValid || isValidating || isSubmitting}
      type="submit"
		>
			{children}
		</Button>
	);
};
