import { useI18n } from "@/i18n";
import type { UserResponse } from "@/sdk";
import { Button } from "@billycraft/ui";
import { TrashIcon } from "@heroicons/react/24/solid";
import { RemoveUserModal } from "./modals/RemoveUserModal";
import clsx from "clsx";
import { useUser } from "@/providers/UserProvider";

type UsersListProps = {
	users: UserResponse[];
	reload: () => Promise<void>;
};
export const UsersList = ({ users, reload }: UsersListProps) => {
	const { scopedT, t } = useI18n();
	const { user } = useUser();
	const pageT = scopedT("settings.users.users.list");

	return (
		<table className="flex flex-col gap-2">
			<thead>
				<tr className="text-left text-sm text-muted-foreground px-4 items-center grid md:grid-cols-4 gap-4 overflow-hidden">
					<th>{pageT("headers.email")}</th>
					<th>{pageT("headers.name")}</th>
					<th>{pageT("headers.role")}</th>
					<th />
				</tr>
			</thead>
			{users && users.length > 0 ? (
				<tbody className="flex flex-col gap-2">
					{users.map(({ email, lastName, firstName, role }) => (
						<tr
							key={email}
							className={clsx(
								"border rounded-md px-4 py-2 gap-4 grid md:grid-cols-4 items-center md:h-16",
							)}
						>
							<td>{email}</td>
							<td>
								{lastName || firstName ? `${lastName} ${firstName}` : "-"}
							</td>
							<td>{t(`roles.${role}`)}</td>
							<td className="md:flex md:justify-end">
								{role !== "OWNER" && email !== user?.email ? (
									<RemoveUserModal
										onSubmitSuccess={reload}
										email={email}
										disclosure={
											<Button variant="destructive">
												<TrashIcon />
											</Button>
										}
									/>
								) : null}
							</td>
						</tr>
					))}
				</tbody>
			) : (
				<tbody>
					<tr className="grid">
						<td className="text-center">{pageT("emptyText")}</td>
					</tr>
				</tbody>
			)}
		</table>
	);
};
