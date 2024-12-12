import { useToast } from "@billycraft/ui";
import { useI18n } from "@/i18n";
import { useForm } from "react-hook-form";
import { sendErrorToSentry } from "@/utils/errors";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "@/providers/UserProvider";
import { OrganizationService, type OrganizationRequest } from "@/sdk";
import { useOrganization } from "@/providers/OrganizationProvider";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { Form } from "@/components/form/Form";
import { Submit } from "@/components/form/Submit";
import { InputField } from "@/components/form/InputField";

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

const initialValues: CreateOrganizationFormValues = {
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
};

export const CreateOrganization = () => {
	const toast = useToast();
	const { t } = useI18n();
	const { reload: reloadUser } = useUser();
	const { reload: reloadOrganization } = useOrganization();

	const methods = useForm<CreateOrganizationFormValues>({
		mode: "onChange",
		values: initialValues,
	});

	const onSubmit = async (values: CreateOrganizationFormValues) => {
		try {
			const data = {
				...values,
				articlesTax: Number(values.articlesTax) || 0,
				servicesTax: Number(values.servicesTax) || 0,
				othersTax: Number(values.othersTax) || 0,
			} as OrganizationRequest;
			await OrganizationService.postOrganization({ body: data });
			await Promise.all([reloadUser(), reloadOrganization()]);
			toast.show(t("onboarding.create.success"));
		} catch (err) {
			sendErrorToSentry(err);
			toast.destructive(t("genericFormError"));
		}
	};

	return (
		<div className="md:w-1/2">
			<Form methods={methods} onSubmit={onSubmit}>
				<div className="px-8 flex flex-col gap-8">
					<h2 className="text-3xl font-bold text-center">
						{t("onboarding.create.title")}
					</h2>
					<div className="border rounded p-4 flex flex-col gap-4">
						<div className="text-lg font-bold">
							{t("onboarding.create.sections.information.title")}
						</div>
						<div className="grid grid-cols-2 gap-4">
							<InputField
								control={methods.control}
								name="name"
								label={t(
									"onboarding.create.sections.information.fields.name.label",
								)}
								placeholder="Billycraft"
								required
							/>
							<InputField
								control={methods.control}
								name="siret"
								label={t(
									"onboarding.create.sections.information.fields.id.label",
								)}
								placeholder="SIRET"
								required
							/>
							<InputField
								control={methods.control}
								name="address"
								label={t(
									"onboarding.create.sections.information.fields.address.label",
								)}
								placeholder="Adresse"
								className="col-span-2"
								required
							/>
							<InputField
								control={methods.control}
								name="postalCode"
								label={t(
									"onboarding.create.sections.information.fields.postalCode.label",
								)}
								placeholder="00000"
								required
							/>
							<InputField
								name="city"
								control={methods.control}
								label={t(
									"onboarding.create.sections.information.fields.city.label",
								)}
								placeholder="San Francisco"
								required
							/>
							<InputField
								name="phoneNumber"
								control={methods.control}
								id="phone-number"
								label={t(
									"onboarding.create.sections.information.fields.phone.label",
								)}
								placeholder="0611223344"
								maxLength={10}
							/>

							<InputField
								name="email"
								control={methods.control}
								id="email"
								label={t(
									"onboarding.create.sections.information.fields.email.label",
								)}
								placeholder="coco@example.com"
								required
							/>
						</div>
					</div>

					<div className="flex flex-col gap-4 border rounded p-4">
						<div className="text-lg font-bold">
							{t("onboarding.create.sections.vat.title")}
						</div>
						<div className="grid md:grid-cols-3 gap-4">
							<InputField
								control={methods.control}
								name="articlesTax"
								className="w-full"
								label={t("onboarding.create.sections.vat.fields.sellVat.label")}
								type="number"
								step={0.01}
								max={100}
								min={0}
							/>
							<InputField
								control={methods.control}
								name="servicesTax"
								className="w-full"
								label={t(
									"onboarding.create.sections.vat.fields.serviceVat.label",
								)}
								type="number"
								step={0.01}
								max={100}
								min={0}
							/>
							<InputField
								name="othersTax"
								control={methods.control}
								className="w-full"
								label={t(
									"onboarding.create.sections.vat.fields.otherVat.label",
								)}
								step={0.01}
								max={100}
								min={0}
								type="number"
							/>
						</div>
					</div>
					<FormErrorAlert />
					<div className="flex flex-row gap-2 justify-start items-center">
						<InformationCircleIcon className="size-5" />
						<p>{t("onboarding.create.uploadLogoNotice")}</p>
					</div>
					<div className="flex justify-end">
						<Submit>{t("onboarding.create.submit")}</Submit>
					</div>
				</div>
			</Form>
		</div>
	);
};
