import { useI18n } from "@/i18n";
import { useBillByIdQuery } from "@/queries/useBillByIdQuery";
import { BillRouteProps, BillOverviewRouteQueryParams, ROUTES } from "@/routes";
import { Alert, Button, Loader, useToast } from "@coco-ui/core";
import {
	ChevronLeftIcon,
	DocumentArrowDownIcon,
	PencilIcon,
} from "@heroicons/react/24/solid";
import { Link, useParams } from "react-router-dom";
import { Actions } from "./Actions";
import { PdfApi } from "@/api/PdfApi";
import { useReducer } from "react";
import { useQueryParams } from "@/hooks/useQueryParams";
import { RRLink } from "@/components/RRLink";
import { BillLabel } from "@/components/labels/BillLabel";
import { InformationSection } from "./InformationSection";
import { ContentSection } from "./ContentSection";

export const Overview = () => {
	const { t, scopedT } = useI18n();
	const toast = useToast();
	const { id } = useParams<BillRouteProps>();
	const { fromTab } = useQueryParams<BillOverviewRouteQueryParams>();
	const { data: bill, isLoading, reload } = useBillByIdQuery(id);
	const [isDownloadingPDF, toggleIsDownloadingPDF] = useReducer(
		(state) => !state,
		false,
	);

	const pageT = scopedT("bills.details");

	const downloadPdf = async () => {
		try {
			if (bill?.id && !isDownloadingPDF) {
				toggleIsDownloadingPDF();
				const blob = await PdfApi.getBillPdf(bill.id);
				const link = document.createElement("a");
				link.download = bill.name;
				link.href = URL.createObjectURL(blob);
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				toggleIsDownloadingPDF();
			}
		} catch {
			toast.destructive(t("bills.form.pdfError"));
			toggleIsDownloadingPDF();
		}
	};

	if (!bill && isLoading) {
		return (
			<div className="flex items-center jusitfy-center">
				<Loader />
			</div>
		);
	}

	if (!bill) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>;
	}

	return (
		<div className="flex flex-col gap-12">
			<RRLink
				to={ROUTES.BILLS.path({ tab: fromTab })}
				className="inline-flex items-center gap-1"
			>
				<ChevronLeftIcon className="size-4" />
				{pageT("backTo")}
			</RRLink>
			<div className="flex flex-col md:flex-row gap-4 md:justify-between md:items-center">
				<div>
					<BillLabel bill={bill} size="lg" />
				</div>
				<div className="flex gap-4 md:flex-row flex-col">
					<Button
						disabled={isDownloadingPDF}
						onClick={downloadPdf}
						variant="outline"
					>
						<DocumentArrowDownIcon />
						{t("bills.form.downloadPdfButton")}
					</Button>
					{bill.status === "DRAFT" ? (
						<Button asChild>
							<Link to={ROUTES.BILL_EDIT.path({ id: bill.id })}>
								<PencilIcon />
								<span>{t("edit")}</span>
							</Link>
						</Button>
					) : null}
				</div>
			</div>
			<InformationSection bill={bill} />
			<ContentSection bill={bill} />
			<Actions bill={bill} reloadBill={reload} />
		</div>
	);
};
