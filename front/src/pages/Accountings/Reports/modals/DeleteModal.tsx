import { ReportApi } from "@/api/ReportApi";
import { useI18n } from "@/i18n";
import { Alert, Button, Modal, useToast } from "@billycraft/ui";
import { ComponentProps } from "react";
import { useForm } from "react-hook-form";

type DeleteModalProps = {
	onSubmitSuccess?: () => void | Promise<void>;
	disclosure?: ComponentProps<typeof Modal>["disclosure"];
	id: string;
};

type ReportDeleteFormProps = Omit<DeleteModalProps, "disclosure">;

const ReportDeleteForm = ({ onSubmitSuccess, id }: ReportDeleteFormProps) => {
	const { t } = useI18n();
	const {
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();
	const toast = useToast();

	const onSubmit = async () => {
		try {
			await ReportApi.delete(id);
			toast.show(t("accounting.reports.modals.delete.submit.success"));
			await onSubmitSuccess?.();
		} catch {
			toast.destructive(t("genericFormError"));
		}
	};

	return (
		<form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
			<h2 className="text-2xl font-bold border-b pb-2">
				{t("accounting.reports.modals.delete.title")}
			</h2>
			<div className="flex flex-col gap-5">
				<p>{t("accounting.reports.modals.delete.description")}</p>
				<Alert variant="destructive">
					{t("accounting.reports.modals.delete.warning")}
				</Alert>
			</div>
			<Button
				type="submit"
				disabled={isSubmitting}
				variant="destructive"
				className="w-full mt-4"
			>
				{t("accounting.reports.modals.delete.submit")}
			</Button>
		</form>
	);
};

const DeleteModal = ({ id, onSubmitSuccess, disclosure }: DeleteModalProps) => {
	return (
		<Modal disclosure={disclosure}>
			{({ close }) => (
				<ReportDeleteForm
					id={id}
					onSubmitSuccess={async () => {
						await onSubmitSuccess?.();
						close();
					}}
				/>
			)}
		</Modal>
	);
};

export default DeleteModal;
