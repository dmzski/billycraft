import { Form } from "@/components/form/Form";
import { InputField } from "@/components/form/InputField";
import { Submit } from "@/components/form/Submit";
import { FormErrorAlert } from "@/components/FormErrorAlert";
import { useI18n } from "@/i18n";
import { useAuth } from "@/providers/AuthProvider";
import { useUser } from "@/providers/UserProvider";
import { useToast } from "@billycraft/ui";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

type MySettingsFormValues = {
	name?: string;
	oldPassword?: string;
	password?: string;
};

export const MySettings = () => {
	const { scopedT } = useI18n();
	const pageT = scopedT("mySettings");
	const { user } = useUser();
	const toast = useToast();
	const { updateUser } = useAuth();
	const initialValues = useMemo<MySettingsFormValues>(
		() => ({
			name: user ? `${user.firstName} ${user.lastName}` : "",
			password: "",
			oldPassword: "",
		}),
		[user],
	);
	const methods = useForm({
		mode: "onChange",
		values: initialValues,
	});

	const onSubmit = async (values: MySettingsFormValues) => {
		await updateUser(values);
		toast.show(pageT("submit.success"));
	};

	return (
		<div className="flex flex-col gap-12">
			<h1>{pageT("title")}</h1>
			<Form methods={methods} onSubmit={onSubmit}>
				<div className="flex flex-col gap-8">
					<InputField
						control={methods.control}
						name="name"
						required
						minLength={3}
					/>
					<InputField
						control={methods.control}
						name="oldPassword"
						type="password"
						autoComplete="password"
					/>
					<InputField
						control={methods.control}
						name="password"
						type="password"
						autoComplete="new-password"
					/>
					<FormErrorAlert />
					<div className="flex justify-end">
						<Submit>{pageT("submit")}</Submit>
					</div>
				</div>
			</Form>
		</div>
	);
};
