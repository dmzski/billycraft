import { Badge, Button, Collapsible } from "@coco-ui/core";
import Product from "@/models/Product";
import {
	MinusIcon,
	PencilIcon,
	PlusIcon,
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
import { useReducer } from "react";
import { ProductGroup } from "@/models/ProductGroup";

type ProductTableLineProps = {
	product: Product;
	supplier?: Supplier;
	reloadProducts: () => Promise<void>;
	groupName?: ProductGroup["name"];
};

const ProductTableLine = ({
	product,
	reloadProducts,
	supplier,
	groupName,
}: ProductTableLineProps) => {
	const formatCurrency = useFormatCurrency();
	const { t, scopedT } = useI18n();
	const pageT = scopedT("products.list.headers");
	const [open, toggleOpen] = useReducer((current) => !current, false);

	return (
		<div className="border rounded-lg p-4">
			<Collapsible
				open={open}
				disclosure={
					<div
						onClick={toggleOpen}
						className="flex flex-row gap-4 justify-between items-center flex-wrap"
					>
						<div className="flex flex-row gap-4 items-center overflow-hidden flex-grow">
							<div className="flex flex-col-reverse md:flex-row gap-2 items-center">
								<ProductTypeLabel short type={product.type} />
								{product.type === "ARTICLE" ? (
									<Badge
										variant={
											product.stock && product.stock > 0
												? "default"
												: "destructive"
										}
									>
										{product.stock ?? "-"}
									</Badge>
								) : null}
							</div>
							<div className="flex flex-col md:flex-row gap-2 md:items-baseline overflow-hidden">
								<p className="truncate">{product.name}</p>
								{supplier?.name ? (
									<div className="truncate opacity-40 text-xs">
										{supplier?.name ?? "-"}
									</div>
								) : null}
							</div>
						</div>
						{groupName ? (
							<Badge variant="outline" className="gap-2 items-center flex">
								<TagIcon className="size-4" />
								{groupName}
							</Badge>
						) : null}
						{open ? (
							<MinusIcon className="size-4" />
						) : (
							<PlusIcon className="size-4 min-w-4" />
						)}
					</div>
				}
			>
				<div className="grid grid-cols-1 gap-8 p-4 w-full">
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
