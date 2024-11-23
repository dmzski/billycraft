import { Button, Input, useToast } from "@billycraft/ui";
import { useI18n } from "@/i18n";
import { Controller, useForm } from "react-hook-form";
import { sendErrorToSentry } from "@/utils/errors";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "@/providers/UserProvider";
import { CompanyService, type OrganizationRequest } from "@/sdk";
import { useOrganization } from "@/providers/OrganizationProvider";

type CreateOrganizationFormValues = {
	articlesTax: number;
	servicesTax: number;
	othersTax: number;
	name: string;
	siret: string;
	address: string;
	postalCode: string;
	phoneNumber: string;
	city: string;
	email: string;
};

export const CreateOrganization = () => {
	const toast = useToast();
	const { t } = useI18n();
	const { reload: reloadUser } = useUser();
	const { reload: reloadOrganization } = useOrganization();

	const {
		control,
		handleSubmit,
		formState: { isSubmitting, isValid },
	} = useForm<CreateOrganizationFormValues>({
		mode: "onChange",
		values: {
			articlesTax: 0,
			servicesTax: 0,
			othersTax: 0,
			phoneNumber: "",
			postalCode: "",
			name: "",
			city: "",
			siret: "",
			address: "",
			email: "",
		},
	});

	const onSubmit = async (values: CreateOrganizationFormValues) => {
		try {
			const data = {
				...values,
				articlesTax: Number(values.articlesTax) || 0,
				servicesTax: Number(values.servicesTax) || 0,
				othersTax: Number(values.othersTax) || 0,
			} as OrganizationRequest;
			await CompanyService.postCompany({ body: data });
			await Promise.all([reloadUser(), reloadOrganization()]);
			toast.show(t("onboarding.create.success"));
		} catch (err) {
			sendErrorToSentry(err);
			toast.destructive(t("genericFormError"));
		}
	};

	return (
		<form
			className="px-10 flex flex-col md:w-1/2 gap-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<h2 className="text-3xl font-bold text-center">
				{t("onboarding.create.title")}
			</h2>
			<div className="border rounded px-6 py-4 flex flex-col gap-4">
				<div className="text-lg font-bold">
					{t("onboarding.create.sections.information.title")}
				</div>
				<div className="grid grid-cols-2 gap-x-4">
					<Controller
						name="name"
						control={control}
						rules={{ required: true }}
						render={({ field, fieldState: { invalid } }) => (
							<Input
								label={t(
									"onboarding.create.sections.information.fields.name.label",
								)}
								placeholder="Coco ERP"
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								error={invalid}
								required
							/>
						)}
					/>
					<Controller
						name="siret"
						control={control}
						rules={{ required: true }}
						render={({ field, fieldState: { invalid } }) => (
							<Input
								id="siret"
								label={t(
									"onboarding.create.sections.information.fields.id.label",
								)}
								placeholder="SIRET"
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								error={invalid}
								required
							/>
						)}
					/>
					<Controller
						name="address"
						control={control}
						rules={{ required: true }}
						render={({ field, fieldState: { invalid } }) => (
							<Input
								id="address"
								label={t(
									"onboarding.create.sections.information.fields.address.label",
								)}
								placeholder="Adresse"
								className="col-span-2"
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								error={invalid}
								required
							/>
						)}
					/>

					<Controller
						name="postalCode"
						control={control}
						rules={{ required: true }}
						render={({ field, fieldState: { invalid } }) => (
							<Input
								id="postal-code"
								label={t(
									"onboarding.create.sections.information.fields.postalCode.label",
								)}
								placeholder="00000"
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								error={invalid}
								required
							/>
						)}
					/>

					<Controller
						name="city"
						control={control}
						rules={{ required: true }}
						render={({ field, fieldState: { invalid } }) => (
							<Input
								id="city"
								label={t(
									"onboarding.create.sections.information.fields.city.label",
								)}
								placeholder="San Francisco"
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								error={invalid}
								required
							/>
						)}
					/>

					<Controller
						name="phoneNumber"
						control={control}
						rules={{
							maxLength: 10,
						}}
						render={({ field, fieldState: { invalid } }) => (
							<Input
								id="phone-number"
								label={t(
									"onboarding.create.sections.information.fields.phone.label",
								)}
								placeholder="0611223344"
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								error={invalid}
							/>
						)}
					/>

					<Controller
						name="email"
						control={control}
						rules={{ required: true }}
						render={({ field, fieldState: { invalid } }) => (
							<Input
								id="email"
								label={t(
									"onboarding.create.sections.information.fields.email.label",
								)}
								placeholder="coco@example.com"
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								error={invalid}
								required
							/>
						)}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-4 border rounded py-4 px-6">
				<div className="text-lg font-bold">
					{t("onboarding.create.sections.vat.title")}
				</div>
				<div className="md:pl-2 grid md:grid-cols-3 gap-4">
					<Controller
						name="articlesTax"
						control={control}
						render={({ field, fieldState: { invalid } }) => (
							<Input
								className="w-full"
								label={t("onboarding.create.sections.vat.fields.sellVat.label")}
								type="number"
								step={0.01}
								max={100}
								min={0}
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								error={invalid}
							/>
						)}
					/>
					<Controller
						name="servicesTax"
						control={control}
						render={({ field, fieldState: { invalid } }) => (
							<Input
								className="w-full"
								label={t(
									"onboarding.create.sections.vat.fields.serviceVat.label",
								)}
								type="number"
								step={0.01}
								max={100}
								min={0}
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								error={invalid}
							/>
						)}
					/>
					<Controller
						name="othersTax"
						control={control}
						render={({ field, fieldState: { invalid } }) => (
							<Input
								className="w-full"
								label={t(
									"onboarding.create.sections.vat.fields.otherVat.label",
								)}
								step={0.01}
								max={100}
								min={0}
								type="number"
								name={field.name}
								value={field.value}
								onChange={field.onChange}
								onBlur={field.onBlur}
								ref={field.ref}
								error={invalid}
							/>
						)}
					/>
				</div>
			</div>
			<div className="alert flex flex-row gap-2 justify-start items-center">
				<InformationCircleIcon className="size-5" />
				<p>{t("onboarding.create.uploadLogoNotice")}</p>
			</div>

			<Button type="submit" disabled={isSubmitting || !isValid}>
				{t("onboarding.create.submit")}
			</Button>
		</form>
	);
};
