import { useI18n } from "@/i18n";
import { Link, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/routes";
import { CreateOrganization } from "./CreateOrganization";
import { JoinOrganization } from "./JoinOrganization";
import { Button } from "@billycraft/ui";
import { useAuth } from "@/providers/AuthProvider";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { SUPPORT_EMAIL } from "@/constants/global";

export const Onboarding = () => {
	const { t } = useI18n();
	const { logout } = useAuth();

	return (
		<div className="flex flex-col gap-6 min-h-screen">
			<div className="p-5 py-10 flex flex-col gap-4 items-center bg-accent shadow-xl text-accent-foreground">
				<h1 className="text-6xl font-bold">{t("onboarding.home.title")}</h1>
				<p>{t("onboarding.home.description")}</p>
			</div>
			<div className="flex flex-col flex-grow">
				<div className="rounded p-5 bg-background flex flex-col gap-6 px-5 md:px-10 pb-5 items-center">
					<div className="grid grid-cols-2 gap-4">
						<Button asChild>
							<Link to={ROUTES.ONBOARDING.routes.CREATE.path()}>
								{t("onboarding.home.button.create")}
							</Link>
						</Button>
						<Button asChild variant="outline">
							<Link to={ROUTES.ONBOARDING.routes.JOIN.path()}>
								{t("onboarding.home.button.join")}
							</Link>
						</Button>
					</div>
					<Routes>
						<Route
							path={ROUTES.ONBOARDING.routes.CREATE.route}
							element={<CreateOrganization />}
						/>
						<Route
							path={ROUTES.ONBOARDING.routes.JOIN.route}
							element={<JoinOrganization />}
						/>
						<Route path="*" element={<CreateOrganization />} />
					</Routes>
				</div>
			</div>
			<div className="flex justify-end p-4 items-center gap-4 text-xs text-muted-foreground">
				<p>v{APP_VERSION}</p>
				<p>
					{t("supportPrefix")}
					<Link to={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</Link>
				</p>
				<Button variant="destructive" onClick={logout}>
					<ArrowRightStartOnRectangleIcon />
					<span>{t("logout")}</span>
				</Button>
			</div>
		</div>
	);
};

export default Onboarding;
