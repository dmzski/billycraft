import { InvitationApi } from "@/api/InvitationApi";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { useI18n } from "@/i18n";
import { sendErrorToSentry } from "@/utils/errors";
import { Button, Modal, useToast } from "@billycraft/ui";
import { ComponentProps } from "react";
import { FormProvider, useForm } from "react-hook-form";

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
			await InvitationApi.delete({
				email,
			});

			toast.show(pageT("submit.success"));
			await onSubmitSuccess();
		} catch (err) {
			sendErrorToSentry(err);
			methods.setError("root", { message: t("genericFormError") });
		}
	};

	return (
		<FormProvider {...methods}>
			<form
				className="flex flex-col gap-10"
				onSubmit={methods.handleSubmit(onSubmit)}
			>
				<h2 className="text-3xl">{pageT("title")}</h2>
				<p className="text-destructive font-semibold">{pageT("description")}</p>
				<FormErrorAlert />
				<Button type="submit" variant="destructive">
					{pageT("submit")}
				</Button>
			</form>
		</FormProvider>
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
