import { Redirect, Route, Switch } from "react-router-dom";
import { ROUTES } from "@/routes";
import Customer from ".";
import { Overview } from "./Overview/Overview";
import { Create } from "./Create/Create";
import { Edit } from "./Edit/Edit";

const CustomerSwitch = () => (
	<Switch>
		<Route
			path={ROUTES.CUSTOMERS.path()}
			exact={ROUTES.CUSTOMERS.exact}
			component={Customer}
		/>
		<Route path={ROUTES.CUSTOMER_EDIT.path()} component={Edit} />
		<Route path={ROUTES.CUSTOMER_ADD.path()} component={Create} />
		<Route path={ROUTES.CUSTOMER_OVERVIEW.path()} component={Overview} />
		<Route render={() => <Redirect to={ROUTES.CUSTOMERS.path()} />} />
	</Switch>
);

export default CustomerSwitch;
