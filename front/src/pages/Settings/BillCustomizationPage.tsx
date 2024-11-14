import type { BillCustomizationResponse } from "@/sdk";
import BillCustomizationForm from "./Forms/BillCustomizationForm";
import { useMyBillCustomizationQuery } from "@/queries/useMyBillCustomizationQuery";
import { Loader } from "@billycraft/ui";

const BillCustomizationPage = () => {
	const { data: billCustomization, isLoading } = useMyBillCustomizationQuery();

	if (isLoading && !billCustomization) {
		return (
			<div className="flex items-center justify-center">
				<Loader />
			</div>
		);
	}
	return (
		<div className="w-full">
			<BillCustomizationForm
				billCustomization={
					billCustomization ?? ({} as BillCustomizationResponse)
				}
			/>
		</div>
	);
};

export default BillCustomizationPage;
