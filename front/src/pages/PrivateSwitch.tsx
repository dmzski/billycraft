import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import BillDashboard from "./Bills";
import BillForm from "./Bills/Form";
import Customer from "./Customers";
import CustomerForm from "./Customers/Form";
import Dashboard from "./Dashboard";
import Layout from "../layout/Layout";
import Loader from "components/Loader";
import Onboarding from "./Onboarding";
import ProductsPage from "./Products";
import Quote from "./Quotes";
import QuoteForm from "./Quotes/Form";
import { ROUTES } from "routes";
import React from "react";
import Settings from "./Settings";
import SupportPage from "./SupportPage";
import { useKeycloak } from "@react-keycloak/web";
import { useUser } from "providers/UserProvider";
import History from "./History";

const PrivateSwitch = (): JSX.Element => {
  const user = useUser();
  const { keycloak } = useKeycloak();
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    if (user.data && keycloak.authenticated) {
      if (
        user.data.companyId === undefined &&
        history.location.pathname !== ROUTES.ONBOARDING_COMPANY.path
      ) {
        history.push(ROUTES.ONBOARDING_COMPANY.path);
      }
      if (
        user.data.companyId &&
        history.location.pathname === ROUTES.ONBOARDING_COMPANY.path
      ) {
        history.push(ROUTES.DASHBOARD.path);
      }
    }
  }, [user, history, keycloak.authenticated]);

  return keycloak.authenticated ? (
    <>
      {!user.data ? (
        <Switch location={location}>
          <Route>
            <div className="flex justify-center items-center h-full">
              <Loader />
              <span className="ml-3">Chargement de vos données...</span>
            </div>
          </Route>
        </Switch>
      ) : user.data.companyId === undefined ? (
        <Switch location={location}>
          <Route path={ROUTES.ONBOARDING_COMPANY.path} component={Onboarding} />
          <Route>
            <Redirect to={ROUTES.ONBOARDING_COMPANY.path} />
          </Route>
        </Switch>
      ) : (
        <Layout>
          <Switch location={location}>
            <Route path={ROUTES.DASHBOARD.path} component={Dashboard} />
            <Route path={ROUTES.QUOTE_FORM.path} component={QuoteForm} />
            <Route
              path={ROUTES.QUOTES.path}
              exact={ROUTES.QUOTES.exact}
              component={Quote}
            />
            <Route
              path={ROUTES.BILLS.path}
              exact={ROUTES.BILLS.exact}
              component={BillDashboard}
            />
            <Route
              path={ROUTES.CUSTOMERS.path}
              exact={ROUTES.CUSTOMERS.exact}
              component={Customer}
            />
            <Route
              path={ROUTES.PRODUCTS.path}
              exact={ROUTES.PRODUCTS.exact}
              component={ProductsPage}
            />

            <Route path={ROUTES.QUOTE_FORM.path} component={QuoteForm} />
            <Route path={ROUTES.BILL_FORM.path} component={BillForm} />
            <Route path={ROUTES.CUSTOMERS.path + "/:id"} component={Customer} />

            <Route path={ROUTES.CUSTOMER_FORM.path} component={CustomerForm} />

            <Route
              path={ROUTES.SETTINGS.path}
              exact={ROUTES.SETTINGS.exact}
              component={Settings}
            />

            <Route
              path={ROUTES.HISTORY.path}
              exact={ROUTES.HISTORY.exact}
              component={History}
            />

            <Route
              path={ROUTES.SUPPORT.path}
              exact={ROUTES.SUPPORT.exact}
              component={SupportPage}
            />

            <Route>
              <Redirect to={ROUTES.DASHBOARD.path} />
            </Route>
          </Switch>
        </Layout>
      )}
    </>
  ) : (
    <div className="flex justify-center items-center h-full">
      <Loader />
      <span className="ml-1">Initialisation</span>
    </div>
  );
};

export default PrivateSwitch;
