import { Button } from "@coco-ui/core";
import Supplier from "@/models/Supplier";
import SupplierModalForm from "./modals/SupplierModalForm";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useI18n } from "@/i18n";
import { SupplierLabel } from "@/components/labels/SupplierLabel";

type ListProps = {
	data: Supplier[];
	reloadData: () => Promise<void>;
};
const List = ({ data, reloadData }: ListProps) => {
	const { scopedT } = useI18n();
	const pageT = scopedT("suppliers.list");
	return (
		<div>
			<div className="hidden md:grid p-4 md:grid-cols-12 text-muted-foreground">
				<div>{pageT("headers.color")}</div>
				<div className="md:col-span-9">{pageT("headers.name")}</div>
				<div>{pageT("headers.vat")}</div>
				<div />
			</div>
			{data.map((supplier) => (
				<div
					key={supplier.id}
					className="flex border gap-4 rounded-md md:h-16 py-2 px-4 items-center"
				>
					<div>
						<div
							className="size-6 rounded-full"
							style={{ backgroundColor: supplier.color }}
						/>
					</div>
					<div className="flex-grow truncate flex items-center">
						<SupplierLabel supplier={supplier} />
					</div>
					<div>{supplier.vat}&nbsp;%</div>
					<div className="flex justify-end">
						<SupplierModalForm
							disclosure={
								<Button size="icon">
									<PencilIcon />
								</Button>
							}
							onSubmitSuccess={reloadData}
							supplier={supplier}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

export default List;
