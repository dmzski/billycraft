import { Button } from "@billycraft/ui"
import List from "./components/List"
import CreateReportModal from "./modals/CreateReportModal"
import { useI18n } from "@/i18n"
import { useAllReportsQuery } from "@/queries/useAllReportsQuery"

const ListPage = () => {
	const { t } = useI18n()
	const { data, reload } = useAllReportsQuery()

	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-center pb-2 border-b">
				<h2 className="text-2xl flex-grow">
					{t("accounting.reports.list.title")}
				</h2>
				<CreateReportModal
					disclosure={<Button>{t("accounting.reports.list.create")}</Button>}
					onSubmitSuccess={reload}
				/>
			</div>
			{data ? (
				<div>
					<List reports={data} />
				</div>
			) : null}
		</div>
	)
}

export default ListPage
