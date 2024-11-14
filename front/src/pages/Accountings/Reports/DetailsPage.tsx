import { Alert, Button, Loader } from "@billycraft/ui";
import { useFormatDate } from "@/hooks/useFormatDate";
import type { ReportRequest } from "@/sdk";
import { Link, useHistory, useParams } from "react-router-dom";
import ReportOutgoingTable from "./components/ReportOutgoingTable";
import ReportPerSupplierTable from "./components/ReportPerSupplierTable";
import ReportTable from "./components/ReportTable";
import { REPORT_ROUTES } from "./constants";
import DeleteModal from "./modals/DeleteModal";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useI18n } from "@/i18n";
import { useReportByIdQuery } from "@/queries/useReportByIdQuery";

type DetailTableProps = {
	report: ReportRequest;
};
const DetailTable = ({ report }: DetailTableProps) => {
	const { toISO9075 } = useFormatDate();
	const { t } = useI18n();
	return (
		<div className="flex flex-col gap-2 md:gap-0 border rounded">
			<dl className="grid md:grid-cols-12">
				<dt className="p-2 md:col-span-2 font-semibold border-b">
					{t("accounting.reports.details.details.table.headers.name")}
				</dt>
				<dd className="md:col-span-10 border-b p-2">{report.name}</dd>
			</dl>
			<dl className="grid md:grid-cols-12">
				<dt className="p-2 md:col-span-2 font-semibold border-b">
					{t("accounting.reports.details.details.table.headers.startDate")}
				</dt>
				<dd className="md:col-span-10 p-2 border-b">
					{toISO9075(report.startDate)}
				</dd>
			</dl>
			<dl className="grid md:grid-cols-12">
				<dt className="p-2 md:col-span-2 font-semibold">
					{t("accounting.reports.details.details.table.headers.endDate")}
				</dt>
				<dd className="md:col-span-10 p-2">{toISO9075(report.endDate)}</dd>
			</dl>
		</div>
	);
};
const DetailsPage = () => {
	const { push } = useHistory();
	const { id } = useParams<{ id: string }>();
	const { data: report, isLoading } = useReportByIdQuery(id);
	const { t } = useI18n();

	const onSubmitSuccess = async () => {
		push(REPORT_ROUTES.routes.LIST.path());
	};

	if (isLoading && !report) {
		return (
			<div className="flex h-full justify-center items-center">
				<Loader />
			</div>
		);
	}

	if (!report) {
		return <Alert variant="destructive">{t("dataloaderError")}</Alert>;
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="flex md:justify-between flex-col gap-5 md:flex-row">
				<Link to={REPORT_ROUTES.routes.LIST.path}>
					<Button type="button" variant="ghost">
						<ArrowLeftIcon />
						{t("accounting.reports.details.backTo")}
					</Button>
				</Link>
				<DeleteModal
					id={id}
					disclosure={
						<Button variant="destructive">
							<TrashIcon />
							{t("accounting.reports.details.delete")}
						</Button>
					}
					onSubmitSuccess={onSubmitSuccess}
				/>
			</div>
			<div className="flex flex-col gap-5">
				<h1 className="text-2xl border-b text-bold">{report.name}</h1>
				<div className="flex flex-col gap-8">
					<section className="flex flex-col gap-2">
						<h2 className="text-xl">
							{t("accounting.reports.details.overview")}
						</h2>
						<DetailTable report={report} />
					</section>
					<section className="flex flex-col gap-2">
						<h2 className="text-xl">
							{t("accounting.reports.details.details")}
						</h2>
						<ReportTable report={report} />
					</section>
					<section className="flex flex-col gap-2">
						<h2 className="text-xl">
							{t("accounting.reports.details.supplierDetails")}
						</h2>
						<ReportPerSupplierTable report={report} />
					</section>
					<section className="flex flex-col gap-2">
						<h2 className="text-xl">
							{t("accounting.reports.details.outgoingDetails")}
						</h2>
						<ReportOutgoingTable report={report} />
					</section>
				</div>
			</div>
		</div>
	);
};

export default DetailsPage;
