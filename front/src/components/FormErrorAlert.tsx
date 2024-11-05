import { Alert } from "@coco-ui/core";
import { useFormContext } from "react-hook-form";

export const FormErrorAlert = () => {
	const {
		formState: { errors },
	} = useFormContext();

	if (errors.root?.message) {
		return <Alert variant="destructive">{errors.root.message}</Alert>;
	}

	if (errors.root?.submit?.message) {
		return <Alert variant="destructive">{errors.root.submit.message}</Alert>;
	}

	return null;
};
