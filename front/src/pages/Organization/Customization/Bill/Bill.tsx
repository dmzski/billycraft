import { useMyBillCustomizationQuery } from "@/queries/useMyBillCustomizationQuery";
import { Loader } from "@billycraft/ui";
import { useToast } from "@billycraft/ui";
import { useI18n } from "@/i18n";
import { type BillCustomizationRequest, BillCustomizationService } from "@/sdk";
import { useController, useForm } from "react-hook-form";
import { Form } from "@/components/form/Form";
import { InputField } from "@/components/form/InputField";
import { SwitchField } from "@/components/form/SwitchField";
import { TextAreaField } from "@/components/form/TextAreaField";
import { Submit } from "@/components/form/Submit";

export const Bill = () => {
	const {
		data: billCustomization,
		isLoading,
		reload,
	} = useMyBillCustomizationQuery();
	const { t } = useI18n();
	const toast = useToast();
	const methods = useForm({
		mode: "onChange",
		values: (billCustomization ?? {}) as BillCustomizationRequest,
	});


	const onSubmit = async (values: BillCustomizationRequest) => {
		if (billCustomization) {
			billCustomization.id
				? await BillCustomizationService.patchBillCustomizationById({
						path: { id: billCustomization.id },
						body: values,
					})
				: await BillCustomizationService.postBillCustomization({
						body: values,
					});
			toast.show(t("settings.forms.billCustomization.submit.success"));
			await reload();
		}
	};

	const { field: colorField } = useController({
		name: "mainColor",
		control: methods.control,
		rules: { required: true },
	});

	if (isLoading && !billCustomization) {
		return (
			<div className="flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<div className="grid flex flex-col gap-8">
				<div>
					<h2 className="text-xl font-semibold">
						{t("settings.forms.billCustomization.title")}
					</h2>
					<div className="border p-4 rounded-md grid gap-8">
						<InputField
							prefix={
								<input
									className="size-10 rounded-l-md"
									type="color"
									value={colorField.value}
									onChange={colorField.onChange}
									onBlur={colorField.onBlur}
								/>
							}
							control={methods.control}
							name="mainColor"
							label={t("settings.forms.billCustomization.mainColor.label")}
							placeholder={t(
								"settings.forms.billCustomization.mainColor.placeholder",
							)}
						/>
						<div className="grid md:grid-cols-2">
							<div className="flex flex-col gap-4 items-start">
								<h3>{t("customer information")}</h3>
								<SwitchField
									control={methods.control}
									name="displayCustomerEmail"
									label={t("display customer email")}
								/>
								<SwitchField
									control={methods.control}
									name="displayCustomerPhoneNumber"
									label={t("display customer phonenumber")}
								/>
							</div>
							<div className="flex flex-col gap-4 items-start">
								<p>{t("compagny informations")}</p>
								<SwitchField
									control={methods.control}
									name="displayCompanyEmail"
									label={t("display compagny email")}
								/>
								<SwitchField
									control={methods.control}
									name="displayCustomerPhoneNumber"
									label={t("display compagny phonenumber")}
								/>
							</div>
						</div>
						<TextAreaField
							control={methods.control}
							name="afterTable"
							label={t("settings.forms.billCustomization.afterTable.label")}
							rows={5}
							placeholder={t(
								"settings.forms.billCustomization.afterTable.label",
							)}
						/>
						<TextAreaField
							label={t("settings.forms.billCustomization.footer.label")}
							control={methods.control}
							name="footer"
							rows={6}
							placeholder={t(
								"settings.forms.billCustomization.footer.placeholder",
							)}
							helper={t("settings.forms.billCustomization.footer.helper")}
						/>
					</div>
				</div>
        <div className="flex justify-end">
          <Submit>{t("settings.forms.billCustomization.submit")}</Submit>
        </div>
			</div>
		</Form>
	);
};
