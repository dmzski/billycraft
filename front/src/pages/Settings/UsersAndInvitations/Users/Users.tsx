import { useI18n } from "@/i18n";
import { useAllUsersQuery } from "@/queries/useAllUsersQuery";
import { Alert, Loader } from "@coco-ui/core";
import { UsersList } from "./UsersList";

export const Users = () => {
	const { scopedT, t } = useI18n();
	const pageT = scopedT("settings.users.users");
	const { data, isLoading, reload } = useAllUsersQuery();

	if (!data && isLoading) {
		return (
			<div className="flex justify-center items-center">
				<Loader />
			</div>
		);
	}

	if (!data) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>;
	}

	return (
		<div className="flex flex-col gap-5">
			<h2 className="text-3xl">{pageT("title")}</h2>
			<p>{pageT("description")}</p>
			<UsersList users={data} reload={reload} />
		</div>
	);
};
