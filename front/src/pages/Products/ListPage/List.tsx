import ProductTableLine from "./Row";
import Product from "@/models/Product";
import { useAllProductGroupsQuery } from "@/queries/useAllProductGroupsQuery";
import { useAllSuppliersQuery } from "@/queries/useAllSuppliersQuery";

type ProductTableProps = {
	products: Product[];
	reloadProducts: () => Promise<void>;
};

const ProductTable = ({ products, reloadProducts }: ProductTableProps) => {
	const { data: suppliers } = useAllSuppliersQuery();
	const { data: groups } = useAllProductGroupsQuery();

	const getSupplier = (product: Product) =>
		product.supplierId
			? suppliers?.find(({ id }) => id === product.supplierId)
			: undefined;

	const getGroupName = (product: Product) =>
		product.groupId
			? groups?.find(({ id }) => id === product.groupId)?.name
			: undefined;

	return (
		<div className="flex flex-col gap-8">
			{products.map((product) => (
				<ProductTableLine
					key={product.id}
					product={product}
					reloadProducts={reloadProducts}
					supplier={getSupplier(product)}
					groupName={getGroupName(product)}
				/>
			))}
		</div>
	);
};

export default ProductTable;
