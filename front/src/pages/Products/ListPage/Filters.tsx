import { LINE_TYPE } from "@/constants/line";
import { useI18n } from "@/i18n";
import { useAllProductGroupsQuery } from "@/queries/useAllProductGroupsQuery";
import { useAllSuppliersQuery } from "@/queries/useAllSuppliersQuery";
import { ProductFilters } from "@/utils/products";
import { Button, Input, Select } from "@coco-ui/core";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { ChangeEvent, ComponentProps, useMemo, useReducer } from "react";

type FiltersProps = {
	filters: ProductFilters;
	onChangeFilters: (newFilters: ProductFilters) => void;
};

export const Filters = ({ filters, onChangeFilters }: FiltersProps) => {
	const { scopedT, t } = useI18n();
	const [openFilters, toggleOpenFilters] = useReducer((state) => !state, false);
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

	const typeOptions: ComponentProps<typeof Select>["options"] = useMemo(
		() => [
			{ value: "", label: t("select") },
			...Object.values(LINE_TYPE).map((type) => ({
				value: type.enum,
				label: type.name,
			})),
		],
		[t],
	);

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
		<div
			className={clsx(
				"collapse",
				openFilters ? "collapse-open overflow-visible" : "collapse-close",
			)}
		>
			<div className="collapse-title p-0 flex justify-center md:justify-start">
				<Button onClick={toggleOpenFilters} variant="ghost">
          {openFilters ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
					{openFilters ? pageT("buttons.hide") : pageT("buttons.display")}
				</Button>
			</div>

			<div className="collapse-content">
				<div className="grid md:grid-cols-12 gap-4 border rounded-lg p-4">
					<Select
						options={typeOptions}
						className="md:col-span-2"
						placeholder={t("select")}
						label={pageT("fields.type.label")}
						value={filters.type}
						name="filters.type"
						onChange={(e) => {
							if (typeof e === "string") {
								handleSelectChange("type", e);
							}
						}}
					/>
					<Select
						options={productGroupOptions}
						className="md:col-span-2"
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
						className="md:col-span-2"
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
					<Input
						className="md:col-span-6"
						label={pageT("fields.name.label")}
						value={filters.name}
						name="filters.name"
						onChange={(e) => handleInputChange("name", e)}
					/>
				</div>
			</div>
		</div>
	);
};
