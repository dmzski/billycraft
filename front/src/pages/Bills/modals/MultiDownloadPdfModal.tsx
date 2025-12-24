import { Form } from "@/components/form/Form"
import { Submit } from "@/components/form/Submit"
import { useFormatDate } from "@/hooks/useFormatDate"
import { useI18n } from "@/i18n"
import type { BillResponse } from "@/sdk"
import { PdfsService } from "@/sdk"
import { sendErrorToSentry } from "@/utils/errors"
import { Button, Modal, useToast } from "@billycraft/ui"
import type { ComponentProps } from "react"
import { useForm } from "react-hook-form"

type MultiDownloadPdfModalProps = {
	disclosure: ComponentProps<typeof Modal>["disclosure"]
	billIds: BillResponse["id"][]
}

type MultiDownloadPdfFormProps = Omit<
	MultiDownloadPdfModalProps,
	"disclosure"
> & {
	close: () => void
}

export const MultiDownloadPdfForm = ({
	close,
	billIds,
}: MultiDownloadPdfFormProps) => {
	const { scopedT, t } = useI18n()
	const pageT = scopedT("bills.modals.multiDownloadPdf")
	const methods = useForm()
	const { toISO9075 } = useFormatDate()
	const toast = useToast()
	const handleSubmit = async () => {
		try {
			const blob = await PdfsService.postPdfsMultipleBill({
				body: { billIds },
			}).then(({ data }) => data)
			if (!blob) {
				throw new Error("Invalid Bill ZIP")
			}
			const link = document.createElement("a")
			link.download = `billycraft_bills_export_${toISO9075(Date.now())}`
			link.href = URL.createObjectURL(blob)
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			toast.show(pageT("submit.success"))
			close()
		} catch (error) {
			sendErrorToSentry(error)
      console.log(error)
			toast.destructive(pageT("submit.error"))
		}
	}

	return (
		<Form methods={methods} onSubmit={handleSubmit}>
			<div className="flex flex-col gap-12">
				<Modal.Title className="text-xl font-semibold">
					{pageT("title")}
				</Modal.Title>
				<p>{pageT("description")}</p>
				<Modal.Actions>
					<Button variant="outline" onClick={close}>
						{t("cancel")}
					</Button>
					<Submit>{pageT("submit")}</Submit>
				</Modal.Actions>
			</div>
		</Form>
	)
}

export const MultiDownloadPdfModal = ({
	disclosure,
	billIds,
}: MultiDownloadPdfModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => <MultiDownloadPdfForm close={close} billIds={billIds} />}
	</Modal>
)
