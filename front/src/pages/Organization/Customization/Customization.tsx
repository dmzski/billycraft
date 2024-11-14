import { useI18n } from "@/i18n";
import { ROUTES } from "@/routes";
import { Redirect, Route, Switch } from "react-router-dom";
import { Tabs } from "@billycraft/ui";
import { RRTab } from "@/components/RRTab";
import { Bill } from "./Bill/Bill";
import { Quote } from "./Quote/Quote";

export const Customization = () => {
	const { scopedT } = useI18n();

	const pageT = scopedT("organization.customization");

	return (
		<div className="flex flex-col gap-10">
			<h1 className="text-3xl font-semibold">{pageT("title")}</h1>
			<div>
				<Tabs>
					<RRTab
						to={ROUTES.ORGANIZATION.routes.CUSTOMIZATION.routes.BILL.path()}
					>
						{pageT("tabs.bill")}
					</RRTab>
					<RRTab
						to={ROUTES.ORGANIZATION.routes.CUSTOMIZATION.routes.QUOTE.path()}
					>
						{pageT("tabs.quote")}
					</RRTab>
				</Tabs>
			</div>
			<Switch>
				<Route
					path={ROUTES.ORGANIZATION.routes.CUSTOMIZATION.routes.BILL.path()}
					component={Bill}
				/>
				<Route
					path={ROUTES.ORGANIZATION.routes.CUSTOMIZATION.routes.QUOTE.path()}
					component={Quote}
				/>
				<Route
					render={() => (
						<Redirect
							to={ROUTES.ORGANIZATION.routes.CUSTOMIZATION.routes.BILL.path()}
						/>
					)}
				/>
			</Switch>
		</div>
	);
};
