import { useI18n } from "@/i18n";
import { Alert, Modal, useToast } from "@coco-ui/core";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import { sendErrorToSentry } from "@/utils/errors";
import { ProductApi } from "@/api/ProductApi";
import Product from "@/models/Product";
import { Submit } from "@/components/form/Submit";
import { InputField } from "@/components/form/InputField";

type DeleteProductModalProps = {
	onSubmitSuccess: () => Promise<void>;
	disclosure: ComponentProps<typeof Modal>["disclosure"];
	product: Product;
};

type DeleteProductFormProps = Omit<DeleteProductModalProps, "disclosure"> & {
	close: () => void;
};

type ConfirmValues = {
	confirm: string;
};

const DeleteProductForm = ({
	product,
	onSubmitSuccess,
	close,
}: DeleteProductFormProps) => {
	const { scopedT, t } = useI18n();
	const toast = useToast();
	const pageT = scopedT("products.modals.delete");
	const confirmationString = t("forms.confirmation.delete.pattern");

	const methods = useForm<ConfirmValues>({
		mode: "onChange",
		defaultValues: {
			confirm: "",
		},
	});

	const onSubmit = async () => {
		try {
			await ProductApi.delete(product.id);
			toast.success(pageT("submit.success"));
			await onSubmitSuccess();
			close();
		} catch (err) {
			sendErrorToSentry(err, { data: product.id });
			toast.error(t("genericFormError"));
		}
	};

	return (
		<form
			onSubmit={methods.handleSubmit(onSubmit)}
			className="flex flex-col gap-12"
		>
			<Modal.Title>{pageT("title")}</Modal.Title>
			<div className="flex flex-col gap-4">
				<Alert variant="error">{pageT("description")}</Alert>
				<InputField
					control={methods.control}
					name="confirm"
					required
					label={t("forms.confirmation.delete.label")}
					autoComplete="off"
					rules={{
						required: true,
						pattern: new RegExp(confirmationString, "i"),
					}}
				/>
			</div>
			<Modal.Actions>
				<Submit variant="error">{pageT("submit")}</Submit>
			</Modal.Actions>
		</form>
	);
};

export const DeleteProductModal = ({
	product,
	onSubmitSuccess,
	disclosure,
}: DeleteProductModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<DeleteProductForm
				product={product}
				onSubmitSuccess={onSubmitSuccess}
				close={close}
			/>
		)}
	</Modal>
);
