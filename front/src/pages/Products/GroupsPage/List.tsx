import type { ProductGroupResponse } from "@/sdk";
import ProductGroupRow from "./Row";

type ProductGroupListProps = {
	groups: ProductGroupResponse[];
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
