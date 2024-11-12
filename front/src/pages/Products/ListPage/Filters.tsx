import { useI18n } from "@/i18n";
import { useAllProductGroupsQuery } from "@/queries/useAllProductGroupsQuery";
import { useAllSuppliersQuery } from "@/queries/useAllSuppliersQuery";
import { ProductFilters } from "@/utils/products";
import { Button, Collapsible, Input, Select, Switch } from "@billycraft/ui";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, ComponentProps, useMemo, useReducer } from "react";

type FiltersProps = {
	filters: ProductFilters;
	onChangeFilters: (newFilters: ProductFilters) => void;
};

export const Filters = ({ filters, onChangeFilters }: FiltersProps) => {
	const { scopedT, t } = useI18n();
	const [openFilters, toggleOpenFilters] = useReducer((state) => !state, true);
	const { data: suppliers } = useAllSuppliersQuery();
	const { data: groups } = useAllProductGroupsQuery();
	const pageT = scopedT("products.list.filters");

	const handleInputChange = (
		field: keyof ProductFilters,
		event: ChangeEvent<HTMLInputElement>,
	) => {
		onChangeFilters({
			...filters,
			[field]: event.target.value ?? "",
		});
	};

	const handleSelectChange = (
		field: keyof ProductFilters,
		newValue: string,
	) => {
		onChangeFilters({
			...filters,
			[field]: newValue ?? "",
		});
	};

	const supplierOptions: ComponentProps<typeof Select>["options"] = useMemo(
		() => [
			{ value: "", label: t("select") },
			...(suppliers?.map(({ id, name }) => ({
				value: id,
				label: name,
			})) ?? []),
		],
		[suppliers, t],
	);

	const productGroupOptions = useMemo(
		(): ComponentProps<typeof Select>["options"] => [
			{ value: "", label: t("select") },
			...(groups?.map(({ id, name }) => ({
				value: id,
				label: name,
			})) ?? []),
		],
		[groups, t],
	);

	return (
		<Collapsible
			open={openFilters}
			disclosure={
				<div>
					<Button onClick={toggleOpenFilters} variant="ghost">
						{openFilters ? (
							<EyeSlashIcon className="w-5" />
						) : (
							<EyeIcon className="w-5" />
						)}
						{openFilters ? pageT("buttons.hide") : pageT("buttons.display")}
					</Button>
				</div>
			}
		>
			<div className="grid md:grid-cols-2 gap-4 border rounded-lg p-4">
				<Input
					placeholder={pageT("fields.name.label")}
					label={pageT("fields.name.label")}
					value={filters.name}
					name="filters.name"
					onChange={(e) => handleInputChange("name", e)}
				/>
				<Select
					options={productGroupOptions}
					label={pageT("fields.group.label")}
					value={filters.groupId}
					name="filters.group"
					placeholder={t("select")}
					onChange={(e) => {
						if (typeof e === "string") {
							handleSelectChange("groupId", e);
						}
					}}
					isSearchable
				/>
				<Select
					options={supplierOptions}
					label={pageT("fields.supplier.label")}
					value={filters.supplierId}
					name="filters.supplier"
					placeholder={t("select")}
					onChange={(e) => {
						if (typeof e === "string") {
							handleSelectChange("supplierId", e);
						}
					}}
					isSearchable
				/>
				<div className="flex flex-col md:flex-row md:items-end md:pb-2 gap-4">
					<Switch
						checked={filters.noStockOnly}
						name="filters.noStockOnly"
						label={pageT("fields.noStockOnly.label")}
						onCheckedChange={(newState) =>
							onChangeFilters({ ...filters, noStockOnly: newState })
						}
					/>
					<Switch
						checked={filters.lowStockOnly}
						name="filters.lowStockOnly"
						label={pageT("fields.lowStockOnly.label")}
						onCheckedChange={(newState) =>
							onChangeFilters({ ...filters, lowStockOnly: newState })
						}
					/>
				</div>
			</div>
		</Collapsible>
	);
};
