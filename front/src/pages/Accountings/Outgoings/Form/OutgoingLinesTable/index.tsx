import { Button, Loader } from "@billycraft/ui";
import { OutgoingRequest } from "@/models/Outgoing";
import { Control, useFieldArray } from "react-hook-form";
import Row from "./Row";
import { useI18n } from "@/i18n";

type OutgoingTableProps = {
	isLoading?: boolean;
	control: Control<OutgoingRequest>;
};
const OutgoingLinesTable = ({ isLoading, control }: OutgoingTableProps) => {
	const { t } = useI18n();
	const { fields, append, remove } = useFieldArray({
		name: "lines",
		control,
		keyName: "line",
	});

	const addLine = () => {
		append({
			vat: 0,
			totalHT: 0,
			line: fields.length + 1,
		});
	};

	return (
		<div className="border rounded">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-accent text-accent-foreground border-b p-4">
				<div className="md:col-span-2">{t("supplier")} *</div>
				<div className="md:col-span-2">
					{t("accounting.outgoings.details.lines.headers.billReference")}
				</div>
				<div className="md:col-span-2">
					{t("accounting.outgoings.details.lines.headers.linkedBill")}
				</div>
				<div className="md:col-span-2">{t("etTotal")}</div>
				<div className="md:col-span-1">{t("vat")}</div>
				<div className="md:col-span-2">{t("itTotal")}</div>
				<div />
			</div>
			{!isLoading ? (
				<div className="pb-4 flex flex-col">
					{fields.map((line, index) => (
						<Row
							key={line.line}
							index={index}
							control={control}
							onDelete={() => remove(index)}
						/>
					))}
					<div className="mt-4 px-4">
						<Button
							type="button"
							className="w-full"
							variant="outline"
							onClick={addLine}
						>
							{t("accounting.outgoings.forms.add.lines.add")}
						</Button>
					</div>
				</div>
			) : (
				<div className="px-4 flex justify-center">
					<Loader />
				</div>
			)}
		</div>
	);
};

export default OutgoingLinesTable;
