import { Button, Input } from "@coco-ui/core";
import { ComponentProps, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
	ArrowsUpDownIcon,
	CloudArrowDownIcon,
	MinusIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useI18n } from "@/i18n";
import { BillFormValues } from "../types";
import { calculatePriceETFromIT, calculatePriceTTC } from "@/utils/price";
import { AddProductModal } from "@/pages/Products/modals/AddProductModal";
import { SelectField } from "@/components/form/SelectField";
import { InputField } from "@/components/form/InputField";
import { TextAreaField } from "@/components/form/TextAreaField";
import { EditProductModal } from "@/pages/Products/modals/EditProductModal";
import Product from "@/models/Product";
import { ProductTypeLabel } from "@/components/labels/ProductTypeLabel";
import { PRODUCT_TYPES } from "@/models/LineTypeEnum";

type BillLineTableLineProps = {
	deleteLine: () => void;
	index: number;
	id: string;
	product?: Product;
	reloadProducts: () => Promise<void>;
};
const BillLineTableLine = ({
	deleteLine,
	index,
	id,
	product,
	reloadProducts,
}: BillLineTableLineProps) => {
	const { control, setValue } = useFormContext<BillFormValues>();
	const { t } = useI18n();
	const { listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({
			id,
			data: {
				lineIndex: index,
			},
		});
	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		zIndex: isDragging ? 10 : undefined,
	};

	const [tva, quantity = 0, itPrice = 0] = useWatch({
		control,
		name: ["tva", `lines.${index}.quantity`, `lines.${index}.itPrice`],
	});

	const totalTTC = useMemo(() => {
		if (Number.isNaN(quantity) || !quantity) {
			return 0;
		}

		return quantity * itPrice;
	}, [itPrice, quantity]);

	const typeOptions: ComponentProps<typeof SelectField>["options"] =
		Object.values(PRODUCT_TYPES).map((type) => ({
			value: type,
			label: <ProductTypeLabel type={type} />,
			render: <ProductTypeLabel type={type} short />,
		}));

	const lineValue = useWatch({ control, name: `lines.${index}` });

	const inputSuffix = useMemo(() => {
		if (!lineValue.productId && lineValue.name) {
			return (
				<AddProductModal
					initialValues={lineValue}
					disclosure={
						<Button
							size="icon"
							variant="ghost"
							type="button"
							className="rounded-none rounded-r-md"
						>
							<CloudArrowDownIcon />
						</Button>
					}
					onSubmitSuccess={async (newId) => {
						await reloadProducts();
						setValue(`lines.${index}.productId`, newId);
					}}
				/>
			);
		}
		if (lineValue.productId && product) {
			return (
				<EditProductModal
					product={product}
					disclosure={
						<Button
							size="icon"
							variant="ghost"
							type="button"
							className="rounded-none rounded-r-md"
						>
							<PencilIcon />
						</Button>
					}
					onSubmitSuccess={async (newProduct) => {
						await reloadProducts();
						setValue(
							`lines.${index}`,
							{
								...lineValue,
								price: newProduct.price,
								name: newProduct.name,
								description: newProduct.description ?? null,
								itPrice: calculatePriceTTC(newProduct.price, tva) ?? null,
							},
							{ shouldValidate: true },
						);
					}}
				/>
			);
		}

		return undefined;
	}, [lineValue, index, setValue, product, tva, reloadProducts]);

	return (
		<div
			className="border rounded-md shadow-xl flex items-start gap-2 p-2 bg-background"
			ref={setNodeRef}
			style={style}
			role="listitem"
		>
			<div className="self-center">
				<Button variant="ghost" size="icon" {...listeners}>
					<ArrowsUpDownIcon />
				</Button>
			</div>
			<div className="flex flex-col flex-grow gap-4">
				<div className="grid md:grid-cols-[repeat(10,minmax(0,1fr))_minmax(0,auto)] gap-4">
					<div className="md:col-span-6 flex flex-col gap-1">
						<div className="flex gap-1">
							<SelectField
								control={control}
								className="w-auto"
								name={`lines.${index}.type`}
								aria-label={t("bills.form.lines.fields.type.label")}
								label={t("bills.form.lines.fields.type.label")}
								required
								onChange={(type) => {
									if (type === "TEXT") {
										setValue(`lines.${index}.price`, 0);
										setValue(`lines.${index}.itPrice`, 0);
										setValue(`lines.${index}.quantity`, 0);
									}
								}}
								options={typeOptions}
							/>
							<InputField
								control={control}
								name={`lines.${index}.name`}
								label={t("bills.form.lines.fields.name.label")}
								required
								placeholder={t("bills.form.lines.fields.name.placeholder")}
								suffix={inputSuffix}
							/>
						</div>
						{lineValue.description !== null ? (
							<div className="flex flex-col items-start">
								<TextAreaField
									placeholder={t(
										"bills.form.lines.fields.description.placeholder",
									)}
									className="md:col-span-6"
									rows={1}
									control={control}
									name={`lines.${index}.description`}
								/>
								<Button
									variant="link"
									onClick={() => {
										setValue(`lines.${index}.description`, null);
									}}
									size="sm"
								>
									<MinusIcon />
									{t("bills.form.lines.deleteDescription")}
								</Button>
							</div>
						) : (
							<div className="flex">
								<Button
									variant="link"
									onClick={() => {
										setValue(`lines.${index}.description`, "");
									}}
									size="sm"
								>
									<PlusIcon />
									{t("bills.form.lines.addDescription")}
								</Button>
							</div>
						)}
					</div>
					{lineValue.type !== "TEXT" ? (
						<>
							<div>
								<InputField
									control={control}
									name={`lines.${index}.quantity`}
									label={t("bills.form.lines.fields.quantity.label")}
									placeholder={t(
										"bills.form.lines.fields.quantity.placeholder",
									)}
									type="number"
									step={0.01}
									required
									asNumber
								/>
							</div>
							<div>
								<InputField
									control={control}
									name={`lines.${index}.price`}
									label={t("bills.form.lines.fields.etPrice.label")}
									required
									placeholder={t("bills.form.lines.fields.etPrice.placeholder")}
									type="number"
									step={0.01}
									onBlur={(event) => {
										const newPrice = Number(event.target.value) || 0;
										setValue(
											`lines.${index}.itPrice`,
											calculatePriceTTC(newPrice, tva),
										);
									}}
									suffix={<span className="px-2">€</span>}
								/>
							</div>
							<div>
								<InputField
									control={control}
									name={`lines.${index}.itPrice`}
									label={t("bills.form.lines.fields.totalItPrice.label")}
									onBlur={(event) => {
										const newPrice = Number(event.target.value) || 0;
										const newEtPrice = calculatePriceETFromIT(newPrice, tva);
										setValue(`lines.${index}.price`, newEtPrice);
									}}
									suffix={<span className="px-2">€</span>}
								/>
							</div>
							<div>
								<Input
									label={t("bills.form.lines.fields.subTotal.label")}
									readOnly
									value={totalTTC}
									suffix={<span className="px-2">€</span>}
								/>
							</div>
						</>
					) : (
						<div className="md:col-span-4" />
					)}
					<div className="pt-4 flex justify-end">
						<Button variant="destructive" size="icon" onClick={deleteLine}>
							<TrashIcon />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BillLineTableLine;
