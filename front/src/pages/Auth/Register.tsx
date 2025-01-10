import { Link as ReactRouterLink } from "react-router-dom";
import { Button, Link, useToast } from "@billycraft/ui";
import { SUPPORT_EMAIL } from "@/constants/global";
import { useI18n } from "@/i18n";
import { ApiError } from "@/lib/ApiError";
import { useAuth } from "@/providers/AuthProvider";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/routes";
import { sendErrorToSentry } from "@/utils/errors";
import { Form } from "@/components/form/Form";
import { InputField } from "@/components/form/InputField";
import { Submit } from "@/components/form/Submit";
import { CheckboxField } from "@/components/form/CheckboxField";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

type RegisterFormValues = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	tos: boolean;
};

export const Register = () => {
	const { t } = useI18n();
	const { register } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();

	const initialValues = useMemo(
		() =>
			({
				firstName: "",
				lastName: "",
				email: "",
				password: "",
				tos: false,
			}) as RegisterFormValues,
		[],
	);

	const methods = useForm({
		values: initialValues,
		mode: "onChange",
	});
	const onSubmit = async (params: RegisterFormValues) => {
		try {
			await register({
				password: params.password,
				email: params.email,
				name: `${params.firstName} ${params.lastName}`,
			});
			toast.show(t("register.success"));
			navigate(ROUTES.LOGIN.path());
		} catch (err) {
			if (!(err instanceof ApiError) || err.code === 500) {
				sendErrorToSentry(err);
			}
			if (err instanceof ApiError) {
				toast.destructive(err.message);
			} else {
				toast.destructive(t("genericFormError"));
			}
		}
	};
	return (
		<div className="min-h-screen flex flex-col gap-4 items-center justify-center p-4">
			<h1 className="text-5xl text-center">{t("appName")}</h1>
			<div className="md:w-1/3">
				<Form methods={methods} onSubmit={onSubmit}>
					<div className="border rounded p-8 flex flex-col gap-6">
						<h2 className="text-3xl text-center">{t("register.title")}</h2>
						<div className="flex flex-col gap-2">
							<InputField
								control={methods.control}
								required
								autoComplete="email"
								type="email"
								label={t("register.fields.email.label")}
								name="email"
								placeholder="email@exemple.com"
							/>
							<InputField
								control={methods.control}
								required
								autoComplete="password"
								type="password"
								label={t("register.fields.password.label")}
								name="password"
								placeholder="*******"
								minLength={8}
							/>
							<InputField
								required
								control={methods.control}
								autoComplete="firstname"
								type="text"
								label={t("register.fields.firstName.label")}
								name="firstName"
								placeholder="John"
							/>
							<InputField
								required
								control={methods.control}
								autoComplete="lastname"
								type="text"
								label={t("register.fields.lastName.label")}
								name="lastName"
								placeholder="Doe"
							/>
              <div className="flex items-center gap-2">
                <CheckboxField
                  required
                  control={methods.control}
                  labelPosition="right"
                  name="tos"
                />
                <Link href="/tos.txt" target="_blank">
                  {t("register.fields.tos.label")}
                </Link>
              </div>
						</div>
						<div className="flex flex-col gap-2">
							<Submit>{t("register.submit")}</Submit>
							<Button asChild variant="outline">
								<ReactRouterLink to={ROUTES.LOGIN.path()}>{t("login.title")}</ReactRouterLink>
							</Button>
						</div>
						<small className="text-xs">
							{t("supportPrefix")}
							<Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>
						</small>
					</div>
				</Form>
			</div>
							<ThemeToggle />
		</div>
	);
};
