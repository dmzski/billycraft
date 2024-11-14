import { Loader, useToast } from "@billycraft/ui";
import { useI18n } from "@/i18n";
import {
	type QuoteCustomizationRequest,
	QuoteCustomizationService,
} from "@/sdk";
import { useMyQuoteCustomizationQuery } from "@/queries/useMyQuoteCustomizationQuery";
import { Form } from "@/components/form/Form";
import { useController, useForm } from "react-hook-form";
import { InputField } from "@/components/form/InputField";
import { SwitchField } from "@/components/form/SwitchField";
import { TextAreaField } from "@/components/form/TextAreaField";
import { Submit } from "@/components/form/Submit";

export const Quote = () => {
	const {
		data: quoteCustomization,
		isLoading,
		reload,
	} = useMyQuoteCustomizationQuery();
	const { t } = useI18n();
	const toast = useToast();
	const methods = useForm({
		mode: "onChange",
		values: quoteCustomization as QuoteCustomizationRequest,
	});

	const onSubmit = async (values: QuoteCustomizationRequest) => {
		if (quoteCustomization) {
			quoteCustomization.id
				? await QuoteCustomizationService.patchQuoteCustomizationById({
						path: { id: quoteCustomization.id },
						body: values,
					})
				: await QuoteCustomizationService.patchQuoteCustomizationById({
						path: { id: quoteCustomization.id },
						body: values,
					});
			toast.show(t("settings.forms.quoteCustomization.submit.success"));
			await reload();
		}
	};


	const { field: colorField } = useController({
		name: "mainColor",
		control: methods.control,
		rules: { required: true },
	});

	if (!quoteCustomization && isLoading) {
		return <Loader />;
	}

	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<div className="flex flex-col gap-8">
				<div>
					<h2 className="text-xl font-semibold">
						{t("settings.forms.quoteCustomization.title")}
					</h2>
					<div className="grid gap-8 border p-4 rounded-md">
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
							label={t("settings.forms.quoteCustomization.mainColor.label")}
							placeholder={t(
								"settings.forms.quoteCustomization.mainColor.placeholder",
							)}
						/>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="flex flex-col gap-4">
								<h3>{t("customer information")}</h3>
								<SwitchField
									name="displayCustomerEmail"
									control={methods.control}
									label={t("display customer email")}
								/>
								<SwitchField
									control={methods.control}
									name="displayCustomerPhoneNumber"
									label={t("display customer phonenumber")}
								/>
							</div>
							<div className="flex flex-col gap-4">
								<h3>{t("compagny informations")}</h3>
								<SwitchField
									control={methods.control}
									name="displayCompanyEmail"
									label={t("display compagny email")}
								/>
								<SwitchField
									control={methods.control}
									name="displayCompanyPhoneNumber"
									label={t("display compagny phonenumber")}
								/>
							</div>
						</div>
						<TextAreaField
							control={methods.control}
							name="afterTable"
							rows={5}
							label={t("settings.forms.quoteCustomization.afterTable.label")}
							placeholder={t(
								"settings.forms.quoteCustomization.afterTable.placeholder",
							)}
						/>
						<TextAreaField
							control={methods.control}
							name="footer"
							rows={6}
							label={t("settings.forms.quoteCustomization.footer.label")}
							placeholder={t(
								"settings.forms.quoteCustomization.footer.placeholder",
							)}
							helper={t("settings.forms.quoteCustomization.footer.helper")}
						/>
					</div>
				</div>
				<div className="flex justify-end">
					<Submit>{t("settings.forms.quoteCustomization.submit")}</Submit>
				</div>
			</div>
		</Form>
	);
};
