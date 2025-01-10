import { useI18n } from "@/i18n"
import { Button } from "@billycraft/ui"
import { LeaveOrganizationModal } from "./modals/LeaveOrganizationModal"

export const LeaveOrganization = () => {
	const { scopedT } = useI18n()
	const pageT = scopedT("account.sections.leaveOrganization")

	return (
		<section className="flex flex-col">
			<h2 className="text-xl font-semibold">{pageT("title")}</h2>
			<div className="flex flex-col gap-12 border rounded-md p-4">
				<div className="flex gap-4">
					<p className="flex-grow">{pageT("description")}</p>
					<LeaveOrganizationModal
						onSubmitSuccess={async () => {
							window.location.reload()
						}}
						disclosure={
							<Button variant="destructive">{pageT("button")}</Button>
						}
					/>
				</div>
			</div>
		</section>
	)
}
