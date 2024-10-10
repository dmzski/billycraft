import { Badge, Button } from "@coco-ui/core";
import Product from "@/models/Product";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { EditProductModal } from "./modals/EditProductModal";
import { DeleteProductModal } from "./modals/DeleteProductModal";
import Supplier from "@/models/Supplier";
import { calculatePriceTTC } from "@/utils/price";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { ProductTypeLabel } from "@/components/labels/ProductTypeLabel";
import { useI18n } from "@/i18n";
import { useReducer } from "react";
import clsx from "clsx";

type ProductTableLineProps = {
	product: Product;
	supplier?: Supplier;
	reloadProducts: () => Promise<void>;
};

const ProductTableLine = ({
	product,
	reloadProducts,
	supplier,
}: ProductTableLineProps) => {
	const formatCurrency = useFormatCurrency();
	const { t, scopedT } = useI18n();
	const pageT = scopedT("products.list.headers");
  const [open, toggleOpen] = useReducer(state => !state, false)

	return (
		<div onClick={toggleOpen} className={clsx("collapse collapse-arrow px-4 py-2 border rounded-lg items-center", open ? "collapse-open" : "collapse-close")}>
			<div className="collapse-title flex flex-row gap-4">
				<div className="flex flex-row gap-4 items-center truncate">
        <ProductTypeLabel short type={product.type} />
					{product.type === "ARTICLE" ? (
						<Badge
							variant={product.stock && product.stock > 0 ? "primary" : "error"}
						>
							{product.stock ?? "-"}
						</Badge>
					) : null}
					<div className="flex flex-row gap-2 items-end">
						<p className="font-bold">{product.name}</p>
						{supplier?.name ? (
							<div className="truncate opacity-40 text-sm">
								{supplier?.name ?? "-"}
							</div>
						) : null}
					</div>
				</div>
			</div>
			<div className="collapse-content flex flex-col gap-4 flex-wrap">
				{product.description ? (
					<dl>
						<dt className="font-bold">{pageT("description")}</dt>
						<dd className="whitespace-pre-wrap">{product.description}</dd>
					</dl>
				) : null}
        <div className="grid md:grid-cols-2 gap-4">
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
				<div className="flex gap-4 flex-wrap">
					<EditProductModal
						disclosure={
							<Button outline type="button" variant="primary">
								<PencilIcon className="w-5" />
								<span>{t("edit")}</span>
							</Button>
						}
						product={product}
						onSubmitSuccess={reloadProducts}
					/>
					<DeleteProductModal
						disclosure={
							<Button type="button" variant="error" outline>
								<TrashIcon className="w-5" />
								<span>{t("delete")}</span>
							</Button>
						}
						product={product}
						onSubmitSuccess={reloadProducts}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProductTableLine;
