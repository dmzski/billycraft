import { Button, Collapsible, Input } from "@billycraft/ui";
import {
	ChangeEventHandler,
	Dispatch,
	SetStateAction,
	useReducer,
} from "react";
import { useI18n } from "@/i18n";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

type BillFilterContainerProps = {
	filters: Record<string, string>;
	setFilters: Dispatch<SetStateAction<Record<string, string>>>;
};
const BillFilterContainer = ({
	filters,
	setFilters,
}: BillFilterContainerProps) => {
	const { t } = useI18n();
	const [open, toggleOpen] = useReducer((state) => !state, false);

	const handleChange =
		(field: keyof typeof filters): ChangeEventHandler<HTMLInputElement> =>
		(e) => {
			setFilters({ ...filters, [field]: e.target.value });
		};

	return (
		<Collapsible
			open={open}
			disclosure={
				<Button onClick={toggleOpen} variant="ghost">
					{open ? <EyeSlashIcon /> : <EyeIcon />}
					{open ? t("hideFilters") : t("displayFilters")}
				</Button>
			}
		>
			<div className="grid md:grid-cols-4 gap-4 border rounded-md p-4">
				<Input
					label={t("bills.list.filters.fields.reference.label")}
					value={filters.name}
					onChange={handleChange("name")}
				/>
				<Input
					label={t("bills.list.filters.fields.title.label")}
					value={filters.title}
					onChange={handleChange("title")}
				/>
				<Input
					label={t("bills.list.filters.fields.customer.label")}
					value={filters.customer}
					onChange={handleChange("customer")}
				/>
				<Input
					label={t("bills.list.filters.fields.createdAt.label")}
					value={filters.createdAt}
					onChange={handleChange("createdAt")}
				/>
			</div>
		</Collapsible>
	);
};

export default BillFilterContainer;
