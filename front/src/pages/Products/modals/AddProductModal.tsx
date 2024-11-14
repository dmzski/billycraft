import { useI18n } from "@/i18n";
import { Button, Modal, useToast } from "@billycraft/ui";
import type { ComponentProps } from "react";
import { useForm } from "react-hook-form";
import {
	ProductFormContent,
	type ProductFormValues,
} from "../components/ProductFormContent";
import { sendErrorToSentry } from "@/utils/errors";
import { useAllSuppliersQuery } from "@/queries/useAllSuppliersQuery";
import { Submit } from "@/components/form/Submit";
import { Form } from "@/components/form/Form";
import {
	type CreateProductRequest,
	type ProductResponse,
	ProductsService,
} from "@/sdk";

type AddProductModalProps = {
	onSubmitSuccess: (newId: ProductResponse["id"]) => Promise<void> | void;
	disclosure: ComponentProps<typeof Modal>["disclosure"];
	initialValues?: Partial<ProductFormValues>;
};

type AddProductFormProps = Omit<AddProductModalProps, "disclosure"> & {
	close: () => void;
};

const defaultValues: ProductFormValues = {
	type: "ARTICLE",
	name: "",
	price: 0,
	description: null,
	supplierId: null,
	itPrice: 0,
	code: null,
	stock: null,
	groupId: null,
	lowStock: null,
	stockAlert: true,
};

const AddProductForm = ({
	onSubmitSuccess,
	close,
	initialValues,
}: AddProductFormProps) => {
	const { scopedT, t } = useI18n();
	const toast = useToast();
	const pageT = scopedT("products.modals.add");
	const { data: suppliers } = useAllSuppliersQuery();

	const methods = useForm<ProductFormValues>({
		mode: "onChange",
		values: { ...defaultValues, ...initialValues },
	});

	const onSubmit = async (values: ProductFormValues) => {
		try {
			if (values.type !== "ARTICLE") {
				values.stock = null;
				values.lowStock = null;
				values.code = null;
			}
			const res = await ProductsService.postProducts({
				body: values as CreateProductRequest,
			}).then(({ data }) => data);
			toast.show(pageT("submit.success"));
			if (res) {
				await onSubmitSuccess(res.id);
			}
			close();
		} catch (err) {
			sendErrorToSentry(err, { data: values });
			toast.destructive(t("genericFormError"));
		}
	};

	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<div className="flex flex-col gap-12">
				<Modal.Title>{pageT("title")}</Modal.Title>
				<ProductFormContent suppliers={suppliers ?? []} />
				<Modal.Actions>
					<Button variant="outline" onClick={close} type="button">
						{t("cancel")}
					</Button>

					<Submit>{pageT("submit")}</Submit>
				</Modal.Actions>
			</div>
		</Form>
	);
};

export const AddProductModal = ({
	onSubmitSuccess,
	disclosure,
	initialValues,
}: AddProductModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<AddProductForm
				initialValues={initialValues}
				onSubmitSuccess={onSubmitSuccess}
				close={close}
			/>
		)}
	</Modal>
);
