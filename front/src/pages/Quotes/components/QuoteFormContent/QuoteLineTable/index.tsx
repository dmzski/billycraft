import { Button, Select } from "@billycraft/ui";
import { ComponentProps, useMemo, useRef, useState } from "react";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import QuoteLineTableLine from "./Row";
import { PlusIcon } from "@heroicons/react/24/solid";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useI18n } from "@/i18n";
import { useAllProductsQuery } from "@/queries/useAllProductsQuery";
import { QuoteFormValues } from "../types";
import { calculatePriceTTC } from "@/utils/price";
import { ProductLabel } from "@/components/labels/ProductLabel";

const defaultLine: QuoteFormValues["lines"][number] = {
	description: null,
	name: "",
	price: 0,
	itPrice: 0,
	quantity: 0,
	type: "TEXT",
	line: 0,
	quoteId: "",
	productId: null,
};

const QuoteLineTable = ({
	disabled,
	control,
}: {
	disabled?: boolean;
	control: Control<QuoteFormValues>;
}) => {
	const { t } = useI18n();
	const selectExistingProductRef = useRef<HTMLInputElement>(null);
	const { data: allProducts, reload: reloadProducts } = useAllProductsQuery();
	const [productIdSelected, setProductIdSelected] = useState<string>();

	const onProductSelectedChange = (option: string) => {
		console.log(option);
		setProductIdSelected(option);
	};

	const tva = useWatch({ control, name: "tva" });
	const { fields, append, remove, move } = useFieldArray({
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

	const addLine = (newLine = defaultLine) => {
		append(
			{ ...newLine, quoteId: "", line: fields.length },
			{ shouldFocus: false },
		);
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
				const newLine: QuoteFormValues["lines"][number] = {
					name: productFound.name,
					type: productFound.type,
					price: productFound.price,
					itPrice: calculatePriceTTC(productFound.price, tva),
					quantity: 0,
					quoteId: "",
					line: 0,
					description: productFound.description ?? null,
					productId: productFound.id,
				};
				addLine(newLine);
				setProductIdSelected(undefined);
				selectExistingProductRef.current?.focus();
			}
		}
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
						placeholder={t("quotes.form.lines.existingProduct.label")}
						value={productIdSelected}
						onChange={onProductSelectedChange}
					/>
					<Button
						disabled={!productIdSelected}
						onClick={addExistingProductSelected}
						type="button"
					>
						{t("quotes.form.lines.existingProduct.add")}
					</Button>
				</div>
			) : null}
			<div className="flex flex-col gap-2">
				<DndContext onDragEnd={onDragEnd}>
					<SortableContext items={fields}>
						{fields?.map((line, index) => (
							<QuoteLineTableLine
								key={line.id}
								disabled={disabled}
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
				{!disabled ? (
					<Button
						className="mt-2"
						variant="outline"
						type="button"
						onClick={() => addLine()}
					>
						<PlusIcon />
						{t("quotes.form.lines.add")}
					</Button>
				) : null}
			</div>
		</div>
	);
};

export default QuoteLineTable;
