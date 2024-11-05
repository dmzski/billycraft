import { ProductGroupApi } from "@/api/ProductGroupApi";
import { InputField } from "@/components/form/InputField";
import { Submit } from "@/components/form/Submit";
import { useI18n } from "@/i18n";
import { ProductGroup } from "@/models/ProductGroup";
import { sendErrorToSentry } from "@/utils/errors";
import { Button, Modal, useToast } from "@coco-ui/core";
import { ComponentProps, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";

type EditProductGroupModalProps = {
	disclosure: ComponentProps<typeof Modal>["disclosure"];
	onSubmitSuccess: () => Promise<void>;
	group: ProductGroup;
};

type EditProductGroupFormProps = Omit<
	EditProductGroupModalProps,
	"disclosure"
> & {
	close: () => void;
};

type EditProductGroupFormValues = {
	name: string;
};

const EditProductGroupForm = ({
	close,
	onSubmitSuccess,
	group,
}: EditProductGroupFormProps) => {
	const { scopedT, t } = useI18n();
	const pageT = scopedT("products.modals.editGroup");
	const toast = useToast();

	const initialValues = useMemo(
		() => ({
			name: group.name,
		}),
		[group.name],
	);

	const methods = useForm({
		mode: "onChange",
		values: initialValues,
	});

	const handleSubmit = async ({ name }: EditProductGroupFormValues) => {
		try {
			await ProductGroupApi.update({ name, id: group.id });
			toast.show(pageT("submit.success"));
			await onSubmitSuccess();
			close();
		} catch (error) {
			sendErrorToSentry(error);
			toast.destructive(t("genericFormError"));
		}
	};

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(handleSubmit)}
				className="flex flex-col gap-12"
			>
				<Modal.Title>{pageT("title")}</Modal.Title>
				<div>
					<InputField
						label={pageT("fields.name.label")}
						control={methods.control}
						name="name"
						required
					/>
				</div>
				<Modal.Actions>
					<Button variant="outline" onClick={close}>
						{t("cancel")}
					</Button>
					<Submit>{pageT("submit")}</Submit>
				</Modal.Actions>
			</form>
		</FormProvider>
	);
};

export const EditProductGroupModal = ({
	onSubmitSuccess,
	disclosure,
	group,
}: EditProductGroupModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<EditProductGroupForm
				group={group}
				close={close}
				onSubmitSuccess={onSubmitSuccess}
			/>
		)}
	</Modal>
);
