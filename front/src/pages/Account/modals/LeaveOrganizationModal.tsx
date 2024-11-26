import { Form } from "@/components/form/Form";
import { InputField } from "@/components/form/InputField";
import { Submit } from "@/components/form/Submit";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { useI18n } from "@/i18n";
import { useOrganization } from "@/providers/OrganizationProvider";
import { OrganizationService } from "@/sdk";
import { Alert, Button, Modal, useToast } from "@billycraft/ui";
import { BellAlertIcon } from "@heroicons/react/24/solid";
import type { ComponentProps } from "react";
import { useForm } from "react-hook-form";

type LeaveOrganizationModalProps = {
	disclosure: ComponentProps<typeof Modal>["disclosure"];
	onSubmitSuccess: () => Promise<void>;
};

type LeaveOrganizationFormProps = Omit<
	LeaveOrganizationModalProps,
	"disclosure"
> & {
	onClose: () => void;
};

const LeaveOrganizationForm = ({
	onClose,
	onSubmitSuccess,
}: LeaveOrganizationFormProps) => {
	const { t, scopedT } = useI18n();
	const { organization } = useOrganization();
	const pageT = scopedT("account.modals.leaveOrganization");
	const methods = useForm({
		mode: "onChange",
		defaultValues: {
			confirm: "",
		},
	});
	const toast = useToast();
	const confirmationString = t("forms.confirmation.leave.pattern");

	if (!organization) {
		return (
			<Alert variant="destructive">
				<BellAlertIcon />
				<p>{t("dataloaderError")}</p>
			</Alert>
		);
	}

	const onSubmit = async () => {
		await OrganizationService.postCompanyByIdLeave({ path: { id: organization.id } });
		toast.show(pageT("submit.success"));
		onClose();
		await onSubmitSuccess();
	};

	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<div className="flex flex-col gap-8">
				<h2 className="text-xl font-semibold">{pageT("title")}</h2>
				<Alert
					variant="destructive"
					icon={<BellAlertIcon className="size-5" />}
				>
					{pageT("warning")}
				</Alert>
				<InputField
					control={methods.control}
					name="confirm"
					rules={{ pattern: new RegExp(`^${confirmationString}$`, "i") }}
					label={t("forms.confirmation.confirmation.label", {
						confirmationStr: confirmationString,
					})}
					placeholder={confirmationString}
					required
				/>
				<FormErrorAlert />
				<div className="flex justify-end gap-4">
					<Button variant="outline" onClick={onClose}>
						{t("cancel")}
					</Button>
					<Submit variant="destructive">{pageT("submit")}</Submit>
				</div>
			</div>
		</Form>
	);
};

export const LeaveOrganizationModal = ({
	disclosure,
	onSubmitSuccess,
}: LeaveOrganizationModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<LeaveOrganizationForm
				onClose={close}
				onSubmitSuccess={onSubmitSuccess}
			/>
		)}
	</Modal>
);
