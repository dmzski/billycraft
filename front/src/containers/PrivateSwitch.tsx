import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Quote from "../pages/Quote";
import BillPage from "../pages/Bill";
import Dashboard from "../pages/Dashboard";
import { useUser } from "../providers/UserProvider";
import { ROUTES } from "../routes";
import QuoteForm from "../pages/QuoteForm";
import Customer from "../pages/Customer";
import CustomerForm from "../pages/CustomerForm";
import Settings from "../pages/Settings";
import Onboarding from "../pages/Onboarding";
import Loader from "../components/Loader";

const PrivateSwitch = () => {
  const user = useUser();
  const { keycloak } = useKeycloak();
  const history = useHistory();

  React.useEffect(() => {
    if (user.data && keycloak.authenticated) {
      if (!user.data.company && history.location.pathname !== ROUTES.ONBOARDING_COMPANY.path) {
        history.push(ROUTES.ONBOARDING_COMPANY.path);
      }
      if (user.data.company && history.location.pathname === ROUTES.ONBOARDING_COMPANY.path) {
        history.push(ROUTES.DASHBOARD.path);
      }
    }
  }, [user, history, keycloak.authenticated]);

  if (!user.data || !keycloak.authenticated) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <Switch>
      <Route path={ROUTES.DASHBOARD.path} component={Dashboard} />
      <Route path={ROUTES.QUOTES.path} exact={ROUTES.QUOTES.exact} component={Quote} />
      <Route path={ROUTES.BILLS.path} exact={ROUTES.BILLS.exact} component={BillPage} />
      <Route path={ROUTES.QUOTE_FORM.path} component={QuoteForm} />
      <Route path={ROUTES.CUSTOMERS.path} exact={ROUTES.CUSTOMERS.exact} component={Customer} />

      <Route path={ROUTES.QUOTES.path + "/:id"} component={Quote} />
      <Route path={ROUTES.BILLS.path + "/:id"} component={BillPage} />
      <Route path={ROUTES.CUSTOMERS.path + "/:id"} component={Customer} />

      <Route path={ROUTES.CUSTOMER_FORM.path} component={CustomerForm} />
      <Route path={ROUTES.SETTINGS.path} exact={ROUTES.SETTINGS.exact} component={Settings} />
      <Route path={ROUTES.ONBOARDING_COMPANY.path} component={Onboarding} />
      <Route>
        <Redirect to={ROUTES.DASHBOARD.path} />
      </Route>
    </Switch>
  );
};

export default PrivateSwitch;
