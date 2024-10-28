import { sendErrorToSentry } from "@/utils/errors";
import { ReactNode } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

type OnSubmitReturn = string | null | undefined | void;

type FormProps<TFieldValues extends FieldValues> = {
	methods: UseFormReturn<TFieldValues>;
	onSubmit: (values: TFieldValues) => OnSubmitReturn | Promise<OnSubmitReturn>;
	children: ReactNode;
};

export const Form = <TFieldValues extends FieldValues>({
	onSubmit,
	methods,
	children,
}: FormProps<TFieldValues>) => {
	const handleSubmit = methods.handleSubmit(async (values) => {
		try {
			const result = await onSubmit(values);

			if (result) {
				methods.setError("root.submit", {
					type: "custom",
					message: result,
				});
			}
		} catch (error) {
			sendErrorToSentry(error);
			if (error instanceof Error) {
				methods.setError("root.submit", {
					type: "custom",
					message: error.message,
				});
			} else {
				methods.setError("root.submit", {
					type: "custom",
					message: "An error occured",
				});
			}
		}
	});

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={async (event) => {
					event.preventDefault();
					event.stopPropagation();
					await handleSubmit(event);
				}}
			>
				{children}
			</form>
		</FormProvider>
	);
};
