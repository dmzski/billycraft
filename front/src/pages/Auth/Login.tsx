import { Link as ReactRouterLink } from "react-router-dom";
import { Button, Link, useToast } from "@billycraft/ui";
import { SUPPORT_EMAIL } from "@/constants/global";
import { useI18n } from "@/i18n";
import { ApiError } from "@/lib/ApiError";
import { useAuth } from "@/providers/AuthProvider";
import { useForm } from "react-hook-form";
import { ROUTES } from "@/routes";
import { sendErrorToSentry } from "@/utils/errors";
import { InputField } from "@/components/form/InputField";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

type LoginFormValues = {
	email: string;
	password: string;
};

export const Login = () => {
	const { login } = useAuth();
	const toast = useToast();
	const navigate = useNavigate();
	const { control, handleSubmit } = useForm<LoginFormValues>({
		mode: "onChange",
		values: {
			password: "",
			email: "",
		},
	});
	const { t } = useI18n();

	const onSubmit = async ({ password, email }: LoginFormValues) => {
		try {
			await login({ email, password });
			toast.show(t("login.success"));
			navigate(ROUTES.DASHBOARD.path());
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
				<form
					className="border rounded p-8 flex flex-col gap-12"
					onSubmit={handleSubmit(onSubmit)}
				>
					<h2 className="text-3xl text-center">{t("login.title")}</h2>
					<div className="flex flex-col gap-4">
						<InputField
							control={control}
							required
							autoComplete="email"
							type="email"
							label={t("login.fields.email.label")}
							name="email"
							placeholder="email@exemple.com"
						/>
						<InputField
							control={control}
							required
							autoComplete="password"
							type="password"
							label={t("login.fields.password.label")}
							name="password"
							placeholder="*******"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Button type="submit">{t("login.submit")}</Button>
						<Button asChild variant="outline">
							<ReactRouterLink to={ROUTES.REGISTER.path()}>{t("login.register")}</ReactRouterLink>
						</Button>
					</div>
				</form>
				<small className="text-xs">
					{t("supportPrefix")}
					<Link href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>
				</small>
			</div>
      <ThemeToggle />
		</div>
	);
};
