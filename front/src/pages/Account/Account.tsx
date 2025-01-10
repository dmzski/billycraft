import { useI18n } from "@/i18n"
import { MyInformation } from "./MyInformation"
import { LeaveOrganization } from "./LeaveOrganization"

export const Account = () => {
	const { scopedT } = useI18n()
	const pageT = scopedT("account")

	return (
		<div className="flex flex-col gap-12">
			<h1 className="text-3xl font-semibold">{pageT("title")}</h1>
			<MyInformation />
			<LeaveOrganization />
		</div>
	)
}
