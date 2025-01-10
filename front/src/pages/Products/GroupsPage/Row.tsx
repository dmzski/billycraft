import type { ProductGroupResponse } from "@/sdk"
import { EditProductGroupModal } from "../modals/EditProductGroupModal"
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid"
import { Button } from "@billycraft/ui"
import { DeleteProductGroupModal } from "../modals/DeleteProductGroupModal"

type ProductGroupRowProps = {
	group: ProductGroupResponse
	reloadGroups: () => Promise<void>
}

const ProductGroupRow = ({ group, reloadGroups }: ProductGroupRowProps) => {
	return (
		<div className="flex items-center px-4 py-2 rounded-lg border justify-between">
			<p>{group.name}</p>
			<div className="flex flex-row gap-2">
				<EditProductGroupModal
					group={group}
					onSubmitSuccess={reloadGroups}
					disclosure={
						<Button size="icon">
							<PencilIcon />
						</Button>
					}
				/>
				<DeleteProductGroupModal
					group={group}
					onSubmitSuccess={reloadGroups}
					disclosure={
						<Button variant="destructive" size="icon">
							<TrashIcon />
						</Button>
					}
				/>
			</div>
		</div>
	)
}

export default ProductGroupRow
