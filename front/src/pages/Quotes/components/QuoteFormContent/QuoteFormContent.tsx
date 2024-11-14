import { type ComponentProps, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Prompt } from "react-router-dom";
import useCustomers from "@/hooks/useCustomers";
import QuoteLineTable from "./QuoteLineTable";
import { useI18n } from "@/i18n";
import type { QuoteFormValues } from "./types";
import { calculatePriceTTC } from "@/utils/price";
import { InputField } from "@/components/form/InputField";
import { SelectField } from "@/components/form/SelectField";

export const QuoteFormContent = () => {
	const { t } = useI18n();
	const customers = useCustomers();
	const {
		control,
		formState: { isDirty, isSubmitting, disabled },
		getValues,
		setValue,
	} = useFormContext<QuoteFormValues>();

	const customerOptions = useMemo(() => {
		const array: ComponentProps<typeof SelectField>["options"] = [];
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
		return array;
	}, [customers]);

	return (
		<div className="flex flex-col gap-12">
			<Prompt
				when={isDirty && !isSubmitting}
				message={t("quotes.form.exitWarning")}
			/>
			<div className="grid md:grid-cols-12 gap-4">
				<SelectField
					className="md:col-span-12"
					label={t("quotes.form.fields.customerId.label")}
					disabled={disabled || !customers}
					options={customerOptions}
					placeholder={t("quotes.form.fields.customerId.placeholder")}
					name="customerId"
					control={control}
					isSearchable
					required
				/>
				<InputField
					control={control}
					className="md:col-span-10"
					name="title"
					label={t("quotes.form.fields.title.label")}
					placeholder={t("quotes.form.fields.title.placeholder")}
					disabled={disabled}
					required
					minLength={3}
				/>
				<InputField
					control={control}
					className="md:col-span-2"
					name="tva"
					asNumber
					min={0}
					max={100}
					suffix={<span className="px-2">%</span>}
					label={t("quotes.form.fields.vat.label")}
					disabled={disabled}
					placeholder={t("quotes.form.fields.vat.placeholder")}
					type="number"
					rules={{
						onBlur: (event) => {
							const values = getValues();
							setValue(
								"lines",
								values.lines.map(({ price, ...restLine }) => ({
									...restLine,
									price,
									itPrice: calculatePriceTTC(price, Number(event.target.value)),
								})),
							);
						},
					}}
				/>
			</div>
			<QuoteLineTable control={control} disabled={disabled} />
		</div>
	);
};
