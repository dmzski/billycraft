import ProductGroupRow from "./Row";
import type { ProductGroup } from "@/models/ProductGroup";

type ProductGroupListProps = {
	groups: ProductGroup[];
	reloadGroups: () => Promise<void>;
};

const ProductGroupList = ({ groups, reloadGroups }: ProductGroupListProps) => (
	<div className="flex flex-col gap-2">
		{groups.map((group) => (
			<ProductGroupRow
				key={group.id}
				group={group}
				reloadGroups={reloadGroups}
			/>
		))}
	</div>
);

export default ProductGroupList;
