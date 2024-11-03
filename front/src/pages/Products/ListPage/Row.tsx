import { Badge, Button, Checkbox, Collapsible } from "@coco-ui/core";
import Product from "@/models/Product";
import {
	ChevronDownIcon,
	ChevronUpIcon,
	PencilIcon,
	TagIcon,
	TrashIcon,
} from "@heroicons/react/24/solid";
import { EditProductModal } from "../modals/EditProductModal";
import { DeleteProductModal } from "../modals/DeleteProductModal";
import Supplier from "@/models/Supplier";
import { calculatePriceTTC } from "@/utils/price";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { ProductTypeLabel } from "@/components/labels/ProductTypeLabel";
import { useI18n } from "@/i18n";
import { ComponentProps, useMemo, useReducer } from "react";
import { ProductGroup } from "@/models/ProductGroup";
import { isUndefinedOrNull } from "@/utils/isUndefinedOrNull";

type ProductTableLineProps = {
	product: Product;
	supplier?: Supplier;
	reloadProducts: () => Promise<void>;
	groupName?: ProductGroup["name"];
	selected: Product[];
	setSelected: (newSelected: Product[]) => void;
};

const ProductTableLine = ({
	product,
	reloadProducts,
	supplier,
	groupName,
	selected,
	setSelected,
}: ProductTableLineProps) => {
	const formatCurrency = useFormatCurrency();
	const { t, scopedT } = useI18n();
	const pageT = scopedT("products.list.headers");
	const [open, toggleOpen] = useReducer((current) => !current, false);

	const stockBadgeVariant = useMemo<
		ComponentProps<typeof Badge>["variant"]
	>(() => {
		if (product.stockAlert && !isUndefinedOrNull(product.stock)) {
			if (product.stock === 0) {
				return "destructive";
			}
			if (
				!isUndefinedOrNull(product.lowStock) &&
				product.lowStock >= product.stock
			) {
				return "default";
			}
		}

		return "outline";
	}, [product.stockAlert, product.stock, product.lowStock]);

	return (
		<div className="border rounded-lg">
			<Collapsible
				open={open}
				disclosure={
					<div className="relative flex flex-row gap-4 justify-between items-center md:h-16 px-4 py-2 md:py-0">
						<div className="flex flex-row gap-4 items-center overflow-hidden flex-grow">
							<div
								onClick={(event) => {
									event.stopPropagation();
								}}
							>
								<Checkbox
									checked={!!selected.find(({ id }) => id === product.id)}
									name={`${product.id}-checkbox`}
									onCheckedChange={(newState) => {
										if (newState) {
											setSelected([...selected, product]);
										} else {
											setSelected(
												selected.filter((value) => value.id !== product.id),
											);
										}
									}}
								/>
							</div>
							<Button variant="ghost" size="icon" onClick={toggleOpen}>
								{open ? (
									<ChevronUpIcon className="size-4" />
								) : (
									<ChevronDownIcon className="size-4 min-w-4" />
								)}
							</Button>
							<div className="flex flex-col-reverse md:flex-row gap-2 items-center">
								<ProductTypeLabel short type={product.type} />
								{product.type === "ARTICLE" &&
								typeof product.stock === "number" ? (
									<Badge variant={stockBadgeVariant}>
										{product.stock ?? "-"}
									</Badge>
								) : null}
							</div>
							<div className="flex flex-col md:items-baseline overflow-hidden">
								<p className="truncate">{product.name}</p>
								{supplier?.name ? (
									<div className="truncate opacity-40 text-xs">
										{supplier?.name ?? "-"}
									</div>
								) : null}
							</div>
						</div>
						{groupName ? (
							<div className="absolute grid top-0 left-2 right-2 transform -translate-y-1/2">
								<div className="grid justify-end">
									<Badge
										variant="outline"
										className="gap-2 items-center inline-flex bg-background overflow-hidden text-sm"
									>
										<TagIcon className="size-4 min-w-4" />
										<span className="truncate">{groupName}</span>
									</Badge>
								</div>
							</div>
						) : null}
					</div>
				}
			>
				<div
					onClick={(e) => e.stopPropagation()}
					className="border-t grid grid-cols-1 gap-8 p-4 w-full"
				>
					{product.description ? (
						<dl>
							<dt className="font-bold">{pageT("description")}</dt>
							<dd className="overflow-x-auto">{product.description}</dd>
						</dl>
					) : null}
					<div className="grid grid-cols-2 gap-4">
						<dl>
							<dt className="font-bold">{pageT("etPrice")}</dt>
							<dd>{formatCurrency(product.price)}</dd>
						</dl>
						<dl>
							<dt className="font-bold">{pageT("itPrice")}</dt>
							<dd>
								{formatCurrency(
									calculatePriceTTC(product.price, supplier?.vat ?? 0),
								)}
							</dd>
						</dl>
					</div>
					<div className="flex gap-4 flex-wrap justify-center  md:justify-end">
						<EditProductModal
							disclosure={
								<Button
									onClick={(e) => {
										e.stopPropagation();
									}}
									type="button"
								>
									<PencilIcon />
									<span>{t("edit")}</span>
								</Button>
							}
							product={product}
							onSubmitSuccess={reloadProducts}
						/>
						<DeleteProductModal
							disclosure={
								<Button
									onClick={(e) => {
										e.stopPropagation();
									}}
									type="button"
									variant="destructive"
								>
									<TrashIcon />
									<span>{t("delete")}</span>
								</Button>
							}
							product={product}
							onSubmitSuccess={reloadProducts}
						/>
					</div>
				</div>
			</Collapsible>
		</div>
	);
};

export default ProductTableLine;
