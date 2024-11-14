import { useI18n } from "@/i18n";
import { useAllProductsQuery } from "@/queries/useAllProductsQuery";
import { ROUTES } from "@/routes";
import { Button } from "@billycraft/ui";
import { ShoppingBagIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export const StockStatusSection = () => {
	const { data: products } = useAllProductsQuery();
	const { scopedT } = useI18n();
	const pageT = scopedT("dashboard.productStockAlert");

	const noStockCount =
		products?.filter(
			({ stock, stockAlert }) =>
				stockAlert && typeof stock === "number" && stock === 0,
		).length ?? 0;

	return (
		<section className="border rounded-md p-4 flex flex-col gap-4 flex-1">
			<h2 className="flex text-xl gap-2 items-center flex-grow font-semibold">
				<ShoppingBagIcon className="size-6" />
				{pageT("title")}
			</h2>
			<div className="flex flex-col gap-4">
				<dl className="grid grid-cols-2 gap-4">
					<dt className="font-semibold">{pageT("articleCount")}</dt>
					<dd className="text-muted-foreground">{products?.length ?? 0}</dd>
				</dl>
				<dl className="grid grid-cols-2 gap-4">
					<dt className="font-semibold">{pageT("articleLow")}</dt>
					<dd className="font-bold">
						{products?.filter(
							({ lowStock, stock, stockAlert }) =>
								stockAlert &&
								typeof lowStock === "number" &&
								typeof stock === "number" &&
								lowStock >= stock,
						).length ?? 0}
					</dd>
				</dl>
				<dl className="grid grid-cols-2 gap-4">
					<dt className="font-semibold">{pageT("articleNoStock")}</dt>
					<dd
						data-alert={noStockCount > 0}
						className="data-[alert=true]:text-destructive font-bold"
					>
						{noStockCount}
					</dd>
				</dl>
				<Button asChild>
					<Link to={ROUTES.PRODUCTS.path()}>{pageT("seeMore")}</Link>
				</Button>
			</div>
		</section>
	);
};
