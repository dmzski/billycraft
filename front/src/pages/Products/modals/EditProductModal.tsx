import { useI18n } from "@/i18n";
import { Button, Modal, useToast } from "@coco-ui/core";
import { ComponentProps, useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
	ProductFormContent,
	ProductFormValues,
} from "../components/ProductFormContent";
import { sendErrorToSentry } from "@/utils/errors";
import { ProductApi } from "@/api/ProductApi";
import Product from "@/models/Product";
import { calculatePriceTTC } from "@/utils/price";
import { useAllSuppliersQuery } from "@/queries/useAllSuppliersQuery";
import { Submit } from "@/components/form/Submit";
import { Form } from "@/components/form/Form";

type EditProductModalProps = {
	onSubmitSuccess: () => Promise<void>;
	product: Product;
	disclosure: ComponentProps<typeof Modal>["disclosure"];
};

type EditProductFormProps = Omit<EditProductModalProps, "disclosure"> & {
	close: () => void;
};

const EditProductForm = ({
	product,
	onSubmitSuccess,
	close,
}: EditProductFormProps) => {
	const { scopedT, t } = useI18n();
	const toast = useToast();
	const pageT = scopedT("products.modals.edit");
	const { data: suppliers } = useAllSuppliersQuery();
	const id = useId();

	const initialValues: ProductFormValues = useMemo(
		() => ({
			name: product.name,
			description: product.description,
			price: product.price,
			type: product.type,
			supplierId: product.supplierId ?? null,
			itPrice: calculatePriceTTC(
				product.price,
				product.supplierId
					? (suppliers?.find(({ id }) => id === product.supplierId)?.vat ?? 0)
					: 0,
			),
			stock: product.stock ?? null,
			code: product.code ?? null,
			groupId: product.groupId ?? null,
		}),
		[product, suppliers],
	);

	const methods = useForm<ProductFormValues>({
		mode: "onChange",
		values: initialValues,
	});

	const onSubmit = async (values: ProductFormValues) => {
		try {
			if (values.type !== "ARTICLE") {
				values.stock = null;
				values.code = null;
			}
			await ProductApi.update({ ...values, id: product.id });
			toast.show(pageT("submit.success"));
			await onSubmitSuccess();
			close();
		} catch (err) {
			sendErrorToSentry(err, { data: values });
			toast.destructive(t("genericFormError"));
		}
	};

	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<div className="flex flex-col gap-8">
				<Modal.Title>{pageT("title")}</Modal.Title>
				<ProductFormContent suppliers={suppliers ?? []} />
				<Modal.Actions>
					<Button onClick={close} variant="outline">
						{t("cancel")}
					</Button>
					<Submit form={id}>{pageT("submit")}</Submit>
				</Modal.Actions>
			</div>
		</Form>
	);
};

export const EditProductModal = ({
	product,
	onSubmitSuccess,
	disclosure,
}: EditProductModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<EditProductForm
				product={product}
				onSubmitSuccess={onSubmitSuccess}
				close={close}
			/>
		)}
	</Modal>
);
