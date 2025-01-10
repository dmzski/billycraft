import { type CustomerResponse, CustomersService } from "@/sdk"
import { useDataLoader } from "@scaleway/use-dataloader"

export default function (): CustomerResponse[] {
	const { data } = useDataLoader("customers", () =>
		CustomersService.getCustomers().then(({ data }) => data),
	)

	return data ?? []
}
