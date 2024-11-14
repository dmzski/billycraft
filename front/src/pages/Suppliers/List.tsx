import { Button } from "@billycraft/ui";
import type { SupplierResponse } from "@/sdk";
import SupplierModalForm from "./modals/SupplierModalForm";
import { PencilIcon } from "@heroicons/react/24/solid";
import { useI18n } from "@/i18n";
import { SupplierLabel } from "@/components/labels/SupplierLabel";

type ListProps = {
	data: SupplierResponse[];
	reloadData: () => Promise<void>;
};
const List = ({ data, reloadData }: ListProps) => {
	const { scopedT } = useI18n();
	const pageT = scopedT("suppliers.list");
	return (
		<div className="flex flex-col gap-2">
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
					<div className="flex flex-col">
						<div className="text-xs text-muted-foreground">
							{pageT("headers.vat")}
						</div>
						<span>{supplier.vat}&nbsp;%</span>
					</div>
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
