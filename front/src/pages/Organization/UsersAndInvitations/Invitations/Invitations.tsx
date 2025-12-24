import { useI18n } from "@/i18n"
import { useAllInvitationsQuery } from "@/queries/useAllInvitationsQuery"
import { Alert, Button, Loader } from "@billycraft/ui"
import { PlusIcon } from "@heroicons/react/24/solid"
import { InvitationsList } from "./InvitationsList"
import { InviteUserModal } from "./modals/InviteUserModal"

export const Invitations = () => {
	const { scopedT, t } = useI18n()
	const pageT = scopedT("settings.users.invitations")
	const { data, isLoading, reload } = useAllInvitationsQuery({
		status: "PENDING",
	})

	if (!data && isLoading) {
		return (
			<div className="flex items-center justify-center">
				<Loader />
			</div>
		)
	}

	if (!data) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>
	}

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-semibold">{pageT("title")}</h2>
			<div className="grid md:grid-cols-12">
				<p className="md:col-span-10">{pageT("description")}</p>
				<div className="md:col-span-2 md:flex md:justify-end">
					<InviteUserModal
						onSubmitSuccess={reload}
						disclosure={
							<Button>
								<PlusIcon />
								<span>{pageT("inviteButton")}</span>
							</Button>
						}
					/>
				</div>
			</div>
			<InvitationsList invitations={data} reload={reload} />
		</div>
	)
}
