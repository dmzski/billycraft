import { RRLink } from "@/components/RRLink"
import { BillLabel } from "@/components/labels/BillLabel"
import { useQueryParams } from "@/hooks/useQueryParams"
import { useI18n } from "@/i18n"
import { useBillByIdQuery } from "@/queries/useBillByIdQuery"
import {
	type BillOverviewRouteQueryParams,
	type BillRouteProps,
	ROUTES,
} from "@/routes"
import { BillsService, PdfsService } from "@/sdk"
import { sendErrorToSentry } from "@/utils/errors"
import { Alert, Button, Loader, useToast } from "@billycraft/ui"
import {
	ChevronLeftIcon,
	DocumentArrowDownIcon,
	PencilIcon,
} from "@heroicons/react/24/solid"
import { useReducer } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Actions } from "./Actions"
import { ContentSection } from "./ContentSection"
import { InformationSection } from "./InformationSection"

export const Overview = () => {
	const { t, scopedT } = useI18n()
	const toast = useToast()
	const { id } = useParams<BillRouteProps>()
	const navigate = useNavigate()
	const { fromTab } = useQueryParams<BillOverviewRouteQueryParams>()
	const {
		data: bill,
		isLoading,
		reload,
	} = useBillByIdQuery(id ?? "", { enabled: !!id })
	const [isDownloadingPDF, toggleIsDownloadingPDF] = useReducer(
		(state) => !state,
		false,
	)
	const [isDownloadingFacturX, toggleIsDownloadingFacturX] = useReducer(
		(state) => !state,
		false,
	)
	const [isDuplicating, toggleIsDuplicating] = useReducer(
		(state) => !state,
		false,
	)

	const pageT = scopedT("bills.details")

	const downloadPdf = async () => {
		try {
			if (bill?.id && !isDownloadingPDF) {
				toggleIsDownloadingPDF()
				const blob = await PdfsService.getPdfsBillById({
					path: { id: bill.id },
				}).then(({ data }) => data)
				if (!blob) {
					throw new Error("Invalid Bill PDF")
				}
				const link = document.createElement("a")
				link.download = bill.name
				link.href = URL.createObjectURL(blob)
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				toggleIsDownloadingPDF()
			}
		} catch {
			toast.destructive(t("bills.form.pdfError"))
			toggleIsDownloadingPDF()
		}
	}

	const downloadFacturX = async () => {
		try {
			if (bill?.id && !isDownloadingFacturX) {
				toggleIsDownloadingFacturX()
				const blob = await PdfsService.getPdfsBillById({
					path: { id: bill.id },
					query: { format: "factur-x" },
				}).then(({ data }) => data)
				if (!blob) {
					throw new Error("Invalid Factur-X PDF")
				}
				const link = document.createElement("a")
				link.download = `${bill.name}_factur-x.pdf`
				link.href = URL.createObjectURL(blob)
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				toggleIsDownloadingFacturX()
			}
		} catch (error) {
			sendErrorToSentry(error)
			toast.destructive(t("bills.form.facturXError"))
			toggleIsDownloadingFacturX()
		}
	}

	const duplicate = async () => {
		if (bill?.id && !isDuplicating) {
			toggleIsDuplicating()
			try {
				const newBill = await BillsService.postBillsByIdDuplicate({
					path: { id: bill.id },
				}).then(({ data }) => data)
				toast.show(t("bills.form.duplicateSuccess"))
				navigate(
					newBill?.id
						? ROUTES.BILLS.routes.OVERVIEW.path({ id: newBill.id })
						: ROUTES.BILLS.routes.INDEX.path(),
				)
			} catch (error) {
				sendErrorToSentry(error)
				toast.destructive(t("bills.form.duplicateError"))
			} finally {
				toggleIsDuplicating()
			}
		}
	}

	if (!bill && isLoading) {
		return (
			<div className="flex items-center jusitfy-center">
				<Loader />
			</div>
		)
	}

	if (!bill) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>
	}

	return (
		<div className="flex flex-col gap-12">
			<RRLink
				to={ROUTES.BILLS.routes.INDEX.path({ tab: fromTab })}
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
					<Button
						disabled={isDownloadingFacturX}
						onClick={downloadFacturX}
						variant="outline"
					>
						<DocumentArrowDownIcon />
						{t("bills.form.downloadFacturXButton")}
					</Button>
					{bill.status !== "DRAFT" ? (
						<Button
							disabled={isDuplicating}
							onClick={duplicate}
							variant="outline"
						>
							<DocumentArrowDownIcon />
							{t("bills.form.duplicateButton")}
						</Button>
					) : null}
					{bill.status === "DRAFT" ? (
						<Button asChild>
							<Link to={ROUTES.BILLS.routes.EDIT.path({ id: bill.id })}>
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
	)
}
