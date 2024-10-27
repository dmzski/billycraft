import { Redirect, Route, Switch } from "react-router-dom";
import { ROUTES } from "@/routes";
import DetailsPage from "./DetailsPage";
import ListPage from "./ListPage";
import OverviewPage from "./OverviewPage";
import { useI18n } from "@/i18n";
import { ReactNode } from "react";
import { RRTab } from "@/components/RRTab";
import { Tabs } from "@coco-ui/core";

const { routes } = ROUTES.ACCOUNTINGS.routes.REPORTS;

type ReportLayoutProps = {
	children: ReactNode;
};

const ReportLayout = ({ children }: ReportLayoutProps) => {
	const { t } = useI18n();
	return (
		<div className="flex flex-col gap-10 mb-4">
			<div className="flex flex-col gap-5">
				<h1 className="text-3xl">{t("accounting.reports.title")}</h1>
				<div>
					<Tabs>
						<RRTab to={routes.OVERVIEW.path()}>
							{t("accounting.reports.heading.overview")}
						</RRTab>
						<RRTab to={routes.LIST.path()}>
							{t("accounting.reports.heading.list")}
						</RRTab>
					</Tabs>
				</div>
			</div>
			{children}
		</div>
	);
};

const ReportsSwitch = () => (
	<Switch>
		<Route path={routes.OVERVIEW.path()}>
			<ReportLayout>
				<OverviewPage />
			</ReportLayout>
		</Route>
		<Route path={routes.LIST.path()} exact={routes.LIST.exact}>
			<ReportLayout>
				<ListPage />
			</ReportLayout>
		</Route>
		<Route path={routes.DETAILS.path()}>
			<DetailsPage />
		</Route>
		<Route>
			<Redirect to={routes.OVERVIEW.path()} />
		</Route>
	</Switch>
);

export default ReportsSwitch;
