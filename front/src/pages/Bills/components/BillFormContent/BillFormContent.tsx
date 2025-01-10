import type { Select } from "@billycraft/ui";
import { type ComponentProps, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import useCustomers from "@/hooks/useCustomers";
import BillLineTable from "./BillLineTable";
import { useI18n } from "@/i18n";
import type { BillFormValues } from "./types";
import { calculatePriceTTC } from "@/utils/price";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";
import type { BillResponse } from "@/sdk";

type BillFormProps = {
	bill?: BillResponse;
};

export const BillFormContent = ({ bill }: BillFormProps) => {
	const { t } = useI18n();
	const customers = useCustomers();
	const {
		control,
		formState: { isDirty, isSubmitting },
		getValues,
		setValue,
	} = useFormContext<BillFormValues>();

	const customerOptions: ComponentProps<typeof Select>["options"] =
		useMemo(() => {
			const array: ComponentProps<typeof Select>["options"] = [];
			if (customers) {
				array.push(
					...customers
						.filter(({ deleted }) => !deleted)
						.map((customer) => ({
							value: customer.id,
							label: customer.name,
						})),
				);
			}
			if (
				bill?.customerId &&
				!array.find(({ value }) => value === bill.customerId)
			) {
				const customer = customers.find(({ id }) => id === bill.customerId);
				if (customer) array.push({ value: customer.id, label: customer.name });
			}

			return array;
		}, [customers, bill?.customerId]);

	return (
		<div className="flex flex-col gap-12">
			{/* <Prompt */}
			{/* 	when={isDirty && !isSubmitting} */}
			{/* 	message={t("bills.form.exitWarning")} */}
			{/* /> */}
			<div className="grid md:grid-cols-12 gap-4">
				<SelectField
					control={control}
					name="customerId"
					label={t("bills.form.fields.customerId.label")}
					options={customerOptions}
					placeholder={t("bills.form.fields.customerId.placeholder")}
					isSearchable
					required
					className="md:col-span-12"
				/>
				<InputField
					className="md:col-span-10"
					control={control}
					name="title"
					label={t("bills.form.fields.title.label")}
					placeholder={t("bills.form.fields.title.placeholder")}
					required
					minLength={3}
				/>
				<InputField
					className="md:col-span-2"
					control={control}
					name="tva"
					asNumber
					label={t("bills.form.fields.vat.label")}
					placeholder={t("bills.form.fields.vat.placeholder")}
					type="number"
					required
					min={0}
					max={100}
					suffix={<span className="px-2">%</span>}
					onBlur={(event) => {
						const values = getValues();
						setValue(
							"lines",
							values.lines.map(({ price, ...restLine }) => ({
								...restLine,
								price,
								itPrice: calculatePriceTTC(price, Number(event.target.value)),
							})),
						);
					}}
				/>
			</div>
			<BillLineTable />
		</div>
	);
};
