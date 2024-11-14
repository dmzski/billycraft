import { Form } from "@/components/form/Form";
import { InputField } from "@/components/form/InputField";
import { Submit } from "@/components/form/Submit";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { useI18n } from "@/i18n";
import { useAuth } from "@/providers/AuthProvider";
import { useUser } from "@/providers/UserProvider";
import { UsersService } from "@/sdk";
import { useToast } from "@billycraft/ui";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

type AccountFormValues = {
	firstName: string;
	lastName: string;
	oldPassword: string;
	password: string;
};

export const Account = () => {
	const { scopedT } = useI18n();
	const pageT = scopedT("account");
	const { user } = useUser();
	const toast = useToast();
	const { updateUser } = useAuth();
	const initialValues = useMemo<AccountFormValues>(
		() => ({
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
			password: "",
			oldPassword: "",
		}),
		[user],
	);
	const methods = useForm({
		mode: "onChange",
		values: initialValues,
	});

	const onSubmit = async ({
		firstName,
		lastName,
		oldPassword,
		password,
	}: AccountFormValues) => {
		await updateUser({
			name: `${firstName} ${lastName}`,
			oldPassword: oldPassword.length > 0 ? oldPassword : undefined,
			password: password.length > 0 ? password : undefined,
		});
		if (user) {
			await UsersService.patchUsersMe({
				body: {
					...user,
					lastName,
					firstName,
				},
			});
		}
		toast.show(pageT("submit.success"));
	};

	return (
		<div className="flex flex-col gap-12">
			<h1 className="text-3xl font-semibold">{pageT("title")}</h1>
			<div>
				<h2>{pageT("updateMyInformation")}</h2>
				<Form methods={methods} onSubmit={onSubmit}>
					<div className="flex flex-col gap-8 border p-4 rounded-md">
						<div className="grid md:grid-cols-2 gap-8">
							<InputField
								label={pageT("fields.firstName.label")}
								control={methods.control}
								name="firstName"
								required
								minLength={3}
							/>
							<InputField
								label={pageT("fields.lastName.label")}
								control={methods.control}
								name="lastName"
								required
								minLength={3}
							/>
							<InputField
								label={pageT("fields.oldPassword.label")}
								control={methods.control}
								name="oldPassword"
								type="password"
								autoComplete="password"
							/>
							<InputField
								label={pageT("fields.newPassword.label")}
								control={methods.control}
								name="password"
								type="password"
								autoComplete="new-password"
							/>
						</div>
						<FormErrorAlert />
						<div className="flex justify-end">
							<Submit>{pageT("submit")}</Submit>
						</div>
					</div>
				</Form>
			</div>
		</div>
	);
};
