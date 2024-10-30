import { Button, Select } from "@coco-ui/core";
import { ComponentProps, useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useI18n } from "@/i18n";
import { useAllProductsQuery } from "@/queries/useAllProductsQuery";
import { BillFormValues } from "../types";
import { LINE_TYPE } from "@/constants/line";
import { calculatePriceTTC } from "@/utils/price";
import { PlusIcon } from "@heroicons/react/24/solid";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import BillLineTableLine from "./Row";

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
	const {
		control,
		formState: { disabled },
	} = useFormContext<BillFormValues>();
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
					const IconComponent = LINE_TYPE[product.type]?.icon;
					return {
						value: product.id,
						searchText: product.name,
						label: (
							<span className="inline-flex gap-2 items-center">
								{IconComponent ? <IconComponent className="w-5" /> : null}
								{product.name}
							</span>
						),
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
					description: productFound.description,
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
			{!disabled ? (
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
			) : null}
			<div className="flex flex-col divide-y">
				<DndContext onDragEnd={onDragEnd}>
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
			{!disabled ? (
				<Button
					className="mt-2"
					type="button"
					variant="outline"
					onClick={addLine}
				>
					<PlusIcon />
					{t("bills.form.lines.add")}
				</Button>
			) : null}
		</div>
	);
};

export default BillLineTable;
