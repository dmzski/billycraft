import { ChangeEvent, useEffect, useRef } from "react";
import useLoadingState from "@/hooks/useLoadingState";
import { CompanyApi } from "@/api/CompanyApi";
import { Button, useToast } from "@coco-ui/core";
import { Company } from "@/models/Company";
import { useForm } from "react-hook-form";
import { useI18n } from "@/i18n";
import { useUser } from "@/providers/UserProvider";
import { Form } from "@/components/form/Form";
import { Submit } from "@/components/form/Submit";
import { InputField } from "@/components/form/InputField";
import { TextAreaField } from "@/components/form/TextAreaField";
import { SwitchField } from "@/components/form/SwitchField";

type MyCompagnyFormProps = {
	company: Company;
	onSubmitSuccess?: (res: Company) => void | Promise<void>;
};
const MyCompagnyForm = ({ company, onSubmitSuccess }: MyCompagnyFormProps) => {
	const { t } = useI18n();
	const { reload } = useUser();
	const toast = useToast();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const uploadLogoState = useLoadingState();
	const methods = useForm({
		mode: "onBlur",
		defaultValues: company,
	});
	const { setValue, reset } = methods;

	const onSubmit = async (values: Company) => {
		try {
			const data: Company = {
				...values,
				articlesTax: Number(values.articlesTax) || 0,
				servicesTax: Number(values.servicesTax) || 0,
				othersTax: Number(values.othersTax) || 0,
				vatPercent: Number(values.vatPercent) || 0,
			};
			const res = company?.id
				? await CompanyApi.updateMine(data)
				: await CompanyApi.create(data);
			await reload();
			toast.show(t("settings.forms.myCompagnyForm.submit.success"));
			onSubmitSuccess?.(res);
		} catch {
			toast.destructive(t("genericFormError"));
		}
	};

	const selectFileToUpload = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const uploadLogo = async (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		try {
			if (!uploadLogoState.isLoading && e.target?.files?.[0]) {
				uploadLogoState.update("loading");
				const url = await CompanyApi.uploadLogo(e.target.files[0]);
				setValue("logo", url);
				uploadLogoState.update("idle");
				toast.show(
					"Logo téléchargé avec succes. Enregistrer les modifications",
				);
			}
		} catch {
			toast.destructive("Erreur lors de l'upload de l'image");
			uploadLogoState.update("idle");
		}
	};

	useEffect(() => {
		if (reset && company) {
			reset(company);
		}
	}, [company, reset]);

	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<div className="flex flex-col gap-8">
				<section className="flex flex-col">
					<div className="text-xl font-semibold">
						{t("compagny informations")}
					</div>
					<div className="flex flex-col gap-8 border p-4 rounded-md">
						<InputField
							name="name"
							required
							minLength={3}
							control={methods.control}
							label={t("settings.forms.myCompagnyForm.name.label")}
							placeholder={t("settings.forms.myCompagnyForm.name.placeholder")}
						/>
						<TextAreaField
							required
							control={methods.control}
							name="address"
							rows={3}
							label={t("settings.forms.myCompagnyForm.address.label")}
							placeholder={t(
								"settings.forms.myCompagnyForm.address.placeholder",
							)}
						/>
						<div className="grid md:grid-cols-4 gap-4">
							<InputField
								required
								minLength={5}
								control={methods.control}
								name="postalCode"
								label={t("settings.forms.myCompagnyForm.postalCode.label")}
								placeholder={t(
									"settings.forms.myCompagnyForm.postalCode.placeholder",
								)}
							/>
							<InputField
								name="city"
								control={methods.control}
								label={t("settings.forms.myCompagnyForm.city.label")}
								placeholder={t(
									"settings.forms.myCompagnyForm.city.placeholder",
								)}
								required
							/>
							<InputField
								name="phoneNumber"
								control={methods.control}
								id="phone-number"
								label={t("settings.forms.myCompagnyForm.phoneNumber.label")}
								placeholder={t(
									"settings.forms.myCompagnyForm.phoneNumber.placeholder",
								)}
							/>
							<InputField
								name="email"
								control={methods.control}
								label={t("settings.forms.myCompagnyForm.email.label")}
								placeholder={t(
									"settings.forms.myCompagnyForm.email.placeholder",
								)}
							/>
						</div>
						<div className="grid md:grid-cols-2 gap-4">
							<InputField
								name="siret"
								control={methods.control}
								label={t("settings.forms.myCompagnyForm.siret.label")}
								placeholder={t(
									"settings.forms.myCompagnyForm.siret.placeholder",
								)}
							/>
							<div className="flex gap-2 items-end">
								<InputField
									name="logo"
									control={methods.control}
									label={t("settings.forms.myCompagnyForm.logo.label")}
									className="flex-grow"
									placeholder={t(
										"settings.forms.myCompagnyForm.logo.placeholder",
									)}
								/>
								<Button
									variant="default"
									onClick={selectFileToUpload}
									disabled={uploadLogoState.isLoading}
								>
									{t("Upload an picture")}
								</Button>
								<input
									ref={fileInputRef}
									type="file"
									className="sr-only"
									onChange={uploadLogo}
								/>
							</div>
						</div>
					</div>
				</section>
				<section className="flex flex-col">
					<div className="text-xl font-semibold">{t("Tax rate")}</div>
					<div className="border rounded-md p-4 grid md:grid-cols-4 gap-4">
						<InputField
							name="vatPercent"
							asNumber
							type="number"
							step={0.01}
							max={100}
							min={0}
							control={methods.control}
							label={t("settings.forms.myCompagnyForm.vatPercent.label")}
							suffix={<span className="px-2">%</span>}
						/>
						<InputField
							label={t("settings.forms.myCompagnyForm.articlesTax.label")}
							type="number"
							step={0.01}
							max={100}
							min={0}
							name="articlesTax"
							control={methods.control}
							asNumber
							suffix={<span className="px-2">%</span>}
						/>
						<InputField
							asNumber
							name="servicesTax"
							control={methods.control}
							label={t("settings.forms.myCompagnyForm.servicesTax.label")}
							type="number"
							step={0.01}
							max={100}
							min={0}
							suffix={<span className="px-2">%</span>}
						/>
						<InputField
							name="othersTax"
							asNumber
							control={methods.control}
							label={t("settings.forms.myCompagnyForm.othersTax.label")}
							step={0.01}
							max={100}
							min={0}
							type="number"
							suffix={<span className="px-2">%</span>}
						/>
					</div>
				</section>
				<section className="flex flex-col">
					<h2 className="text-lg font-semibold">{t("Automation")}</h2>
					<div className="border rounded-md p-4 grid md:grid-cols-2 gap-4">
						<SwitchField
							control={methods.control}
							name="autoMonthReport"
							label={t("Automatically generate monthly reports")}
						/>
						<SwitchField
							control={methods.control}
							name="autoYearReport"
							label={t("Automatically generate annual reports")}
						/>
					</div>
				</section>
				<div className="flex justify-end">
					<Submit>{t("save")}</Submit>
				</div>
			</div>
		</Form>
	);
};

export default MyCompagnyForm;
