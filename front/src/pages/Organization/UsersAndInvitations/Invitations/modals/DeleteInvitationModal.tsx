import { Form } from "@/components/form/Form";
import { Submit } from "@/components/form/Submit";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { useI18n } from "@/i18n";
import { InvitationsService } from "@/sdk";
import { sendErrorToSentry } from "@/utils/errors";
import { Modal, useToast } from "@billycraft/ui";
import type { ComponentProps } from "react";
import { useForm } from "react-hook-form";

type DeleteInvitationModalProps = {
	disclosure: ComponentProps<typeof Modal>["disclosure"];
	onSubmitSuccess: () => Promise<void>;
	email: string;
};

type DeleteInvitationFormProps = Omit<DeleteInvitationModalProps, "disclosure">;

const DeleteInvitationForm = ({
	onSubmitSuccess,
	email,
}: DeleteInvitationFormProps) => {
	const { scopedT, t } = useI18n();
	const toast = useToast();
	const pageT = scopedT("settings.users.invitations.modals.delete");
	const methods = useForm({
		mode: "onSubmit",
	});

	const onSubmit = async () => {
		try {
			await InvitationsService.deleteInvitations({
				body: {
					email,
				},
			});

			toast.show(pageT("submit.success"));
			await onSubmitSuccess();
		} catch (err) {
			sendErrorToSentry(err);
			methods.setError("root", { message: t("genericFormError") });
		}
	};

	return (
		<Form methods={methods} onSubmit={onSubmit}>
			<div className="flex flex-col gap-10">
				<h2 className="text-3xl">{pageT("title")}</h2>
				<p className="text-destructive font-semibold">{pageT("description")}</p>
				<FormErrorAlert />
				<Submit variant="destructive">{pageT("submit")}</Submit>
			</div>
		</Form>
	);
};

export const DeleteInvitationModal = ({
	onSubmitSuccess,
	email,
	disclosure,
}: DeleteInvitationModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<DeleteInvitationForm
				email={email}
				onSubmitSuccess={async () => {
					await onSubmitSuccess();
					close();
				}}
			/>
		)}
	</Modal>
);
