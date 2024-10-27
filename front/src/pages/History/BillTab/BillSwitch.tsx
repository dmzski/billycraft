import { Redirect, Route, Switch } from "react-router-dom";
import { HISTORY_ROUTES } from "../constant";
import HistoryTab from "./HistoryTab";
import RefusedTab from "./RefusedTab";
import { useI18n } from "@/i18n";
import { Tabs } from "@coco-ui/core";
import { RRTab } from "@/components/RRTab";

const BILL_ROUTES = HISTORY_ROUTES.BILLS.routes;
const BillSwitch = () => {
	const { t } = useI18n();

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-2xl">{t("history.tabs.bill.title")}</h1>
			<div>
				<Tabs>
					<RRTab to={BILL_ROUTES.ARCHIVED.path()}>
						{t("history.tabs.bill.links.archived")}
					</RRTab>
					<RRTab to={BILL_ROUTES.REFUSED.path()}>
						{t("history.tabs.bill.links.refused")}
					</RRTab>
				</Tabs>
			</div>
			<Switch>
				<Route path={BILL_ROUTES.ARCHIVED.path()} component={HistoryTab} />
				<Route path={BILL_ROUTES.REFUSED.path()} component={RefusedTab} />
				<Route render={() => <Redirect to={BILL_ROUTES.ARCHIVED.path()} />} />
			</Switch>
		</div>
	);
};

export default BillSwitch;
