import { FormErrorAlert } from "@/components/FormErrorAlert";
import { Form } from "@/components/form/Form";
import { Submit } from "@/components/form/Submit";
import { ROLES } from "@/constants/roles";
import { useI18n } from "@/i18n";
import { InvitationsService, type RoleEnum } from "@/sdk";
import { sendErrorToSentry } from "@/utils/errors";
import { Input, Modal, Select, useToast } from "@billycraft/ui";
import { type ComponentProps, useMemo } from "react";
import { useController, useForm } from "react-hook-form";

type InviteUserModalProps = {
	disclosure: ComponentProps<typeof Modal>["disclosure"];
	onSubmitSuccess: () => Promise<void>;
};

type InviteUserFormProps = Omit<InviteUserModalProps, "disclosure">;

type InviteUserFormValues = {
	email: string;
	role: RoleEnum;
};

const initValues: InviteUserFormValues = {
	email: "",
	role: "VIEWER",
};

const InviteUserForm = ({ onSubmitSuccess }: InviteUserFormProps) => {
	const { scopedT, t } = useI18n();
	const toast = useToast();

	const pageT = scopedT("settings.users.invitations.modals.invite");
	const methods = useForm({
		mode: "onChange",
		defaultValues: initValues,
	});

	const roleOptions: ComponentProps<typeof Select>["options"] = useMemo(
		() =>
			ROLES.filter((aRole) => aRole !== "OWNER").map((aRole) => ({
				value: aRole,
				label: t(`roles.${aRole}`),
			})),
		[t],
	);

	const { field: emailField, fieldState: emailFieldState } = useController({
		control: methods.control,
		name: "email",
		rules: {
			required: true,
		},
	});
	const { field: roleField, fieldState: roleFieldState } = useController({
		control: methods.control,
		name: "role",
		rules: {
			required: true,
		},
	});

	const onSubmit = async ({ email, role }: InviteUserFormValues) => {
		try {
			await InvitationsService.postInvitations({
				body: {
					role,
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
			<div className="flex flex-col gap-5">
				<h2 className="text-3xl">{pageT("title")}</h2>
				<p>{pageT("description")}</p>
				<Input
					label={pageT("fields.email.label")}
					placeholder={pageT("fields.email.placeholder")}
					value={emailField.value}
					onChange={emailField.onChange}
					onBlur={emailField.onBlur}
					required
					type="email"
					error={emailFieldState.invalid}
				/>
				<Select
					options={roleOptions}
					error={roleFieldState.invalid}
					value={roleField.value}
					onChange={roleField.onChange}
					required
					label={pageT("fields.role.label")}
				/>
				<FormErrorAlert />
				<Submit>{pageT("submit")}</Submit>
			</div>
		</Form>
	);
};

export const InviteUserModal = ({
	disclosure,
	onSubmitSuccess,
}: InviteUserModalProps) => (
	<Modal disclosure={disclosure}>
		{({ close }) => (
			<InviteUserForm
				onSubmitSuccess={async () => {
					await onSubmitSuccess();
					close();
				}}
			/>
		)}
	</Modal>
);
