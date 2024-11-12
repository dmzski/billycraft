import { Button, Select } from "@billycraft/ui";
import { ComponentProps, useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useI18n } from "@/i18n";
import { useAllProductsQuery } from "@/queries/useAllProductsQuery";
import { BillFormValues } from "../types";
import { calculatePriceTTC } from "@/utils/price";
import { PlusIcon } from "@heroicons/react/24/solid";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import BillLineTableLine from "./Row";
import { ProductLabel } from "@/components/labels/ProductLabel";

const defaultLine: BillFormValues["lines"][number] = {
	description: null,
	name: "",
	price: 0,
	quantity: 0,
	type: "TEXT",
	line: 0,
	billId: "",
	itPrice: 0,
	productId: null,
};

const BillLineTable = () => {
	const { control } = useFormContext<BillFormValues>();
	const { t } = useI18n();
	const selectExistingProductRef = useRef<HTMLInputElement>(null);
	const { data: allProducts, reload: reloadProducts } = useAllProductsQuery();
	const [productIdSelected, setProductIdSelected] = useState<string>();

	const onProductSelectedChange = (option: string) => {
		setProductIdSelected(option);
	};

	const tva = useWatch({ control, name: "tva" });
	const { fields, append, move, remove } = useFieldArray({
		control,
		name: "lines",
	});

	const onDragEnd: ComponentProps<typeof DndContext>["onDragEnd"] = (event) => {
		if (
			event.over?.id &&
			event.active.id &&
			event.active.data.current?.lineIndex !== undefined &&
			event.over.data.current?.lineIndex !== undefined
		) {
			move(
				event.active.data.current.lineIndex,
				event.over.data.current.lineIndex,
			);
		}

		return;
	};

	const productOptions: ComponentProps<typeof Select>["options"] =
		useMemo(() => {
			if (allProducts) {
				return allProducts.map((product) => {
					return {
						value: product.id,
						searchText: product.name,
						label: <ProductLabel product={product} />,
					};
				});
			}
			return [];
		}, [allProducts]);

	const addExistingProductSelected = () => {
		if (productIdSelected && allProducts) {
			const productFound = allProducts.find(
				(product) => product.id === productIdSelected,
			);
			if (productFound) {
				const newLine: BillFormValues["lines"][number] = {
					name: productFound.name,
					type: productFound.type,
					price: productFound.price,
					itPrice: calculatePriceTTC(productFound.price, tva),
					quantity: 0,
					billId: "",
					line: fields.length,
					description: productFound.description ?? null,
					productId: productFound.id,
				};
				append(newLine, { shouldFocus: false });
				setProductIdSelected(undefined);
				selectExistingProductRef.current?.focus();
			}
		}
	};

	const addLine = () => {
		append(
			{ ...defaultLine, billId: "", line: fields.length },
			{ shouldFocus: false },
		);
	};

	return (
		<div className="flex flex-col gap-4 border p-4 rounded">
			<div className="grid md:grid-cols-4 items-end gap-4">
				<Select
					ref={selectExistingProductRef}
					className="md:col-span-3"
					name="existing-product"
					id="existing-product"
					options={productOptions}
					isSearchable
					placeholder={t("bills.form.lines.existingProduct.label")}
					value={productIdSelected}
					onChange={onProductSelectedChange}
				/>
				<Button
					disabled={!productIdSelected}
					onClick={addExistingProductSelected}
					type="button"
				>
					{t("bills.form.lines.existingProduct.add")}
				</Button>
			</div>
			<div role="list" className="flex flex-col gap-2">
				<DndContext
					accessibility={{
						restoreFocus: true,
					}}
					onDragEnd={onDragEnd}
				>
					<SortableContext items={fields}>
						{fields.map((line, index) => (
							<BillLineTableLine
								key={line.id}
								id={line.id}
								index={index}
								deleteLine={() => remove(index)}
								product={
									line.productId
										? allProducts?.find(({ id }) => id === line.productId)
										: undefined
								}
								reloadProducts={reloadProducts}
							/>
						))}
					</SortableContext>
				</DndContext>
			</div>
			<Button variant="outline" onClick={addLine}>
				<PlusIcon />
				{t("bills.form.lines.add")}
			</Button>
		</div>
	);
};

export default BillLineTable;
