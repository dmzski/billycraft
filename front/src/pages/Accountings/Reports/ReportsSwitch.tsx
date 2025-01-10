import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/routes";
import DetailsPage from "./DetailsPage";
import ListPage from "./ListPage";
import OverviewPage from "./OverviewPage";
import { useI18n } from "@/i18n";
import type { ReactNode } from "react";
import { RRTab } from "@/components/RRTab";
import { Tabs } from "@billycraft/ui";

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
  <Routes>
    <Route
      path={routes.OVERVIEW.route}
      element={
        <ReportLayout>
          <OverviewPage />
        </ReportLayout>
      }
    />
    <Route
      path={routes.LIST.route}
      element={
        <ReportLayout>
          <ListPage />
        </ReportLayout>
      }
    />
    <Route
      path={routes.DETAILS.route}
      element={<DetailsPage />}
    />
    <Route
      path="*"
      element={<Navigate to={routes.OVERVIEW.path()} replace />}
    />
  </Routes>
);

export default ReportsSwitch;
