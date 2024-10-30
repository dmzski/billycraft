import { useFormContext, useWatch } from "react-hook-form";
import { ProductFormValues } from "./types";
import { Button, useToast } from "@coco-ui/core";
import { ComponentProps, useMemo } from "react";
import { LINE_TYPE } from "@/constants/line";
import { useI18n } from "@/i18n";
import { ProductTypeLabel } from "@/components/labels/ProductTypeLabel";
import { calculatePriceETFromIT, calculatePriceTTC } from "@/utils/price";
import Supplier from "@/models/Supplier";
import { QrCodeIcon } from "@heroicons/react/24/solid";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import { useAllProductGroupsQuery } from "@/queries/useAllProductGroupsQuery";
import { ScanArticleCodeModal } from "@/modals/ScanArticleCodeModal";
import { TextAreaField } from "@/components/form/TextAreaField";
import { SwitchField } from "@/components/form/SwitchField";

type ProductFormContentProps = {
	suppliers: Supplier[];
};

export const ProductFormContent = ({ suppliers }: ProductFormContentProps) => {
	const toast = useToast();
	const { scopedT } = useI18n();
	const pageT = scopedT("products.components.formContent");
	const { control, setValue } = useFormContext<ProductFormValues>();
	const { data: productGroups } = useAllProductGroupsQuery();

	const [supplierId, selectedType, description] = useWatch({
		control,
		name: ["supplierId", "type", "description"],
	});

	const typeOptions: ComponentProps<typeof SelectField>["options"] = useMemo(
		() =>
			Object.values(LINE_TYPE).map((type) => ({
				value: type.enum,
				label: <ProductTypeLabel type={type.enum} />,
			})),
		[],
	);

	const supplierOptions: ComponentProps<typeof SelectField>["options"] =
		useMemo(
			() =>
				suppliers.map(({ id, name }) => ({
					value: id,
					label: name,
				})) ?? [],
			[suppliers],
		);

	const productGroupOptions = useMemo(
		(): ComponentProps<typeof SelectField>["options"] =>
			productGroups?.map(({ id, name }) => ({
				value: id,
				label: name,
			})) ?? [],
		[productGroups],
	);

	const selectedSupplier = supplierId
		? suppliers.find(({ id }) => id === supplierId)
		: undefined;

	return (
		<div className="flex flex-col gap-4">
			<div className="grid md:grid-cols-2 gap-4">
				<SelectField
					options={productGroupOptions}
					control={control}
					name="groupId"
					label={pageT("fields.groupId.label")}
					isSearchable
				/>
				<SelectField
					control={control}
					options={typeOptions}
					name="type"
					label={pageT("fields.type.label")}
          required
				/>
			</div>
			<div className="flex flex-col">
				<InputField
					control={control}
					name="name"
					required
					minLength={3}
					label={pageT("fields.name.label")}
					autoComplete="off"
				/>
				{description !== null ? (
					<div className="flex flex-col mt-1">
						<TextAreaField
							control={control}
							name="description"
							placeholder={pageT("fields.description.placeholder")}
						/>
						<div>
							<Button
								variant="link"
								size="sm"
								onClick={() => {
									setValue("description", null);
								}}
							>
								{pageT("fields.description.remove")}
							</Button>
						</div>
					</div>
				) : (
					<div>
						<Button
							variant="link"
							size="sm"
							onClick={() => {
								setValue("description", "");
							}}
						>
							{pageT("fields.description.add")}
						</Button>
					</div>
				)}
			</div>
			{selectedType === "ARTICLE" ? (
				<div className="flex flex-col gap-4">
					<div className="grid md:grid-cols-2 gap-4">
						<InputField
							control={control}
							name="stock"
							asNumber
							label={pageT("fields.stock.label")}
							autoComplete="off"
							type="number"
							step={0.01}
						/>

						<InputField
							control={control}
							name="lowStock"
							label={pageT("fields.lowStock.label")}
							step={0.01}
							asNumber
							autoComplete="off"
							type="number"
						/>
					</div>
					<SwitchField
						control={control}
						label={pageT("fields.noStockAlert.label")}
						name="stockAlert"
					/>
					<div className="flex flex-row gap-2 items-end">
						<InputField
							className="flex-grow"
							name="code"
							label={pageT("fields.code.label")}
							autoComplete="off"
						/>
						<ScanArticleCodeModal
							disclosure={
								<Button type="button" variant="ghost">
									<QrCodeIcon />
								</Button>
							}
							onScan={(result) => {
								if (result[0]) {
									setValue("code", result[0].rawValue, {
										shouldValidate: true,
									});
								} else {
									toast.destructive(pageT("fields.code.errors.scan"));
								}
							}}
						/>
					</div>
				</div>
			) : null}
			{selectedType !== "TEXT" ? (
				<div className="flex flex-col gap-4">
					<SelectField
						options={supplierOptions}
						control={control}
						name="supplierId"
						label={pageT("fields.supplierId.label")}
						isSearchable
					/>
					<div className="grid md:grid-cols-2 gap-4">
						<InputField
							control={control}
							name="price"
							onBlur={(event) => {
								const newPrice = Number(event.target.value) || 0;
								setValue(
									"itPrice",
									calculatePriceTTC(newPrice, selectedSupplier?.vat ?? 0),
									{
										shouldValidate: true,
									},
								);
							}}
							asNumber
							label={pageT("fields.price.label")}
							autoComplete="off"
							type="number"
							suffix={<span className="px-2">€</span>}
							step={0.01}
							required
						/>
						<InputField
							control={control}
							name="itPrice"
							asNumber
							onBlur={(event) => {
								const newPrice = Number(event.target.value) || 0;
								const newEtPrice = calculatePriceETFromIT(
									newPrice,
									selectedSupplier?.vat ?? 0,
								);
								setValue("price", newEtPrice, { shouldValidate: true });
							}}
							label={pageT("fields.itPrice.label")}
							autoComplete="off"
							type="number"
							step={0.01}
							suffix={<span className="px-2">€</span>}
							required
						/>
					</div>
				</div>
			) : null}
		</div>
	);
};
