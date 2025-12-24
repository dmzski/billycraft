import type { OutgoingLineResponse } from "@/sdk"
import Row from "./Row"
import { useI18n } from "@/i18n"

type OutgoingTableProps = {
	lines: OutgoingLineResponse[]
}
const OutgoingLinesTable = ({ lines }: OutgoingTableProps) => {
	const { t } = useI18n()

	return (
		<div className="border rounded">
			<div className="grid grid-cols-1 sm:grid-cols-12 gap-4 font-semibold items-center border-b p-4">
				<div className="col-span-2">
					{t("accounting.outgoings.details.lines.headers.supplier")}
				</div>
				<div className="col-span-2">
					{t("accounting.outgoings.details.lines.headers.billReference")}
				</div>
				<div className="col-span-2">
					{t("accounting.outgoings.details.lines.headers.linkedBill")}
				</div>
				<div className="col-span-2">{t("etTotal")}</div>
				<div className="col-span-2">{t("vat")}</div>
				<div className="col-span-2">{t("itTotal")}</div>
			</div>
			<div className="flex flex-col">
				{lines.map((line) => (
					<Row key={line.line} line={line} />
				))}
			</div>
		</div>
	)
}

export default OutgoingLinesTable
