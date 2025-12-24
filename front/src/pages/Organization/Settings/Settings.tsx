import { Alert, Loader } from "@billycraft/ui"
import { useMyOrganizationQuery } from "@/queries/useMyOrganizationQuery"
import { Form } from "@/components/form/Form"
import { InputField } from "@/components/form/InputField"
import { Submit } from "@/components/form/Submit"
import { SwitchField } from "@/components/form/SwitchField"
import { TextAreaField } from "@/components/form/TextAreaField"
import useLoadingState from "@/hooks/useLoadingState"
import { useI18n } from "@/i18n"
import { OrganizationService, type OrganizationRequest } from "@/sdk"
import { Button, useToast } from "@billycraft/ui"
import { type ChangeEvent, useRef } from "react"
import { useForm } from "react-hook-form"

export const Settings = () => {
	const { data: company, reload, isLoading } = useMyOrganizationQuery()
	const { t } = useI18n()
	const toast = useToast()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const uploadLogoState = useLoadingState()
	const methods = useForm({
		mode: "onChange",
		defaultValues: company as OrganizationRequest,
	})
	const { setValue } = methods

	const onSubmit = async (values: OrganizationRequest) => {
		try {
			const data: OrganizationRequest = {
				...values,
				articlesTax: Number(values.articlesTax) || 0,
				servicesTax: Number(values.servicesTax) || 0,
				othersTax: Number(values.othersTax) || 0,
				vatPercent: Number(values.vatPercent) || 0,
			}
			const res = company?.id
				? await OrganizationService.patchOrganizationMine({ body: data }).then(
						({ data }) => data,
					)
				: await OrganizationService.postOrganization({ body: data }).then(
						({ data }) => data,
					)
			if (!res) {
				toast.destructive(t("genericFormError"))
				await reload()
			} else {
				await reload()
				toast.show(t("settings.forms.myCompagnyForm.submit.success"))
			}
		} catch {
			toast.destructive(t("genericFormError"))
		}
	}

	const selectFileToUpload = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const uploadLogo = async (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		try {
			if (!uploadLogoState.isLoading && e.target?.files?.[0]) {
				uploadLogoState.update("loading")
				const url = await OrganizationService.postOrganizationUploadLogo({
					body: {
						logo: e.target.files[0],
					},
				}).then(({ data }) => data)
				setValue("logo", url)
				uploadLogoState.update("idle")
				toast.show("Logo téléchargé avec succes. Enregistrer les modifications")
			}
		} catch {
			toast.destructive("Erreur lors de l'upload de l'image")
			uploadLogoState.update("idle")
		}
	}

	if (!company && isLoading) {
		return <Loader />
	}

	if (!company) {
		return <Alert variant="destructive">{t("genericDataLoadError")}</Alert>
	}

	return (
		<div className="flex flex-col gap-8">
			<Form methods={methods} onSubmit={onSubmit}>
				<div className="flex flex-col gap-8">
					<h1 className="text-3xl font-semibold">
						{t("organization.settings.title")}
					</h1>
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
								placeholder={t(
									"settings.forms.myCompagnyForm.name.placeholder",
								)}
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
		</div>
	)
}
