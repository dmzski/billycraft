import { useFormatDate } from "@/hooks/useFormatDate";
import { useI18n } from "@/i18n";
import { InvitationResponse } from "@/models/dtos/Invitation";
import { Button } from "@coco-ui/core";
import { TrashIcon } from "@heroicons/react/24/solid";
import { DeleteInvitationModal } from "./modals/DeleteInvitationModal";

type InvitationsListProps = {
	invitations?: InvitationResponse[];
	reload: () => Promise<void>;
};
export const InvitationsList = ({
	invitations,
	reload,
}: InvitationsListProps) => {
	const { scopedT, t } = useI18n();
	const { toISO9075 } = useFormatDate();
	const pageT = scopedT("settings.users.invitations.list");

	return (
		<table className="flex flex-col">
			<thead>
				<tr className="text-left [&_>_th]:font-semibold p-4 grid md:grid-cols-12 gap-3 bg-accent text-accent-foreground rounded-t border border-accent overflow-hidden">
					<th className="md:col-span-3">{pageT("headers.email")}</th>
					<th className="md:col-span-2">{pageT("headers.role")}</th>
					<th className="md:col-span-2">{pageT("headers.status")}</th>
					<th className="md:col-span-4">{pageT("headers.createdAt")}</th>
					<th />
				</tr>
			</thead>
			{invitations && invitations.length > 0 ? (
				<tbody>
					{invitations.map(({ email, role, status, createdAt }) => (
						<tr className="px-4 py-2 gap-3 grid md:grid-cols-12 border-b items-center">
							<td className="md:col-span-3">{email}</td>
							<td className="md:col-span-2">{role}</td>
							<td className="md:col-span-2">
								{t(`invitations.status.${status}`)}
							</td>
							<td className="md:col-span-4">{toISO9075(createdAt)}</td>
							<td className="md:flex md:justify-end">
								<DeleteInvitationModal
									disclosure={
										<Button
											variant="destructive"
											size="icon"
											title={t("delete")}
										>
											<TrashIcon />
										</Button>
									}
									onSubmitSuccess={reload}
									email={email}
								/>
							</td>
						</tr>
					))}
				</tbody>
			) : (
				<tbody>
					<tr className="grid md:grid-cols-12 px-4 py-4">
						<td className="md:col-span-12 text-center">{pageT("emptyText")}</td>
					</tr>
				</tbody>
			)}
		</table>
	);
};
