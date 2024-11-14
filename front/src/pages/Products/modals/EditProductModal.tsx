import { useI18n } from "@/i18n";
import { Button, Modal, useToast } from "@billycraft/ui";
import { type ComponentProps, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
	ProductFormContent,
	type ProductFormValues,
} from "../components/ProductFormContent";
import { sendErrorToSentry } from "@/utils/errors";
import { calculatePriceTTC } from "@/utils/price";
import { useAllSuppliersQuery } from "@/queries/useAllSuppliersQuery";
import { Submit } from "@/components/form/Submit";
import { Form } from "@/components/form/Form";
import { type ProductResponse, ProductsService, type UpdateProductRequest } from "@/sdk";

type EditProductModalProps = {
	onSubmitSuccess: (newProduct: ProductResponse) => Promise<void> | void;
	product: ProductResponse;
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

	const initialValues = useMemo<ProductFormValues>(
		() => ({
			name: product.name,
			description: product.description ?? null,
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
			stockAlert: product.stockAlert ?? true,
			lowStock: product.lowStock ?? null,
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
				values.lowStock = null;
				values.code = null;
			}
			const newProduct = await ProductsService.patchProductsById({
				path: { id: product.id },
				body: values as UpdateProductRequest,
			}).then(({ data }) => data);
			toast.show(pageT("submit.success"));
			if (newProduct) {
				await onSubmitSuccess(newProduct);
			}
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
					<Submit>{pageT("submit")}</Submit>
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
