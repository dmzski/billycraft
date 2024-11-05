import { useI18n } from "@/i18n";
import { Alert, Modal, useToast } from "@coco-ui/core";
import { ComponentProps } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { sendErrorToSentry } from "@/utils/errors";
import { ProductGroup } from "@/models/ProductGroup";
import { ProductGroupApi } from "@/api/ProductGroupApi";
import { Submit } from "@/components/form/Submit";
import { InputField } from "@/components/form/InputField";

type DeleteProductGroupModalProps = {
	onSubmitSuccess: () => Promise<void>;
	disclosure: ComponentProps<typeof Modal>["disclosure"];
	group: ProductGroup;
};

type DeleteProductGroupFormProps = Omit<
	DeleteProductGroupModalProps,
	"disclosure"
> & {
	close: () => void;
};

type ConfirmValues = {
	confirm: string;
};

const DeleteProductGroupForm = ({
	group,
	onSubmitSuccess,
	close,
}: DeleteProductGroupFormProps) => {
	const { scopedT, t } = useI18n();
	const toast = useToast();
	const pageT = scopedT("products.modals.deleteGroup");
	const confirmationString = t("forms.confirmation.delete.pattern");

	const methods = useForm<ConfirmValues>({
		mode: "onChange",
		defaultValues: {
			confirm: "",
		},
	});

	const onSubmit = async () => {
		try {
			await ProductGroupApi.delete(group.id);
			toast.show(pageT("submit.success"));
			await onSubmitSuccess();
			close();
		} catch (err) {
			sendErrorToSentry(err, { data: group.id });
			toast.destructive(t("genericFormError"));
		}
	};

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit)}
				className="flex flex-col gap-12"
			>
				<Modal.Title>{pageT("title")}</Modal.Title>
				<div className="flex flex-col gap-4">
					<Alert variant="destructive">{pageT("description")}</Alert>
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
					<Submit variant="destructive">{pageT("submit")}</Submit>
				</Modal.Actions>
			</form>
		</FormProvider>
	);
};

export const DeleteProductGroupModal = ({
	group,
	onSubmitSuccess,
	disclosure,
}: DeleteProductGroupModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<DeleteProductGroupForm
				group={group}
				onSubmitSuccess={onSubmitSuccess}
				close={close}
			/>
		)}
	</Modal>
);
