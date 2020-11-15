import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Redirect, Route, Switch, useHistory, useLocation } from "react-router-dom";
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
import ProductsPage from "../pages/ProductsPage";
import NewsModal from "./modals/NewsModal";
import Layout from "./layout/Layout";

import { TransitionGroup, CSSTransition } from "react-transition-group";

const PrivateSwitch = () => {
  const user = useUser();
  const { keycloak } = useKeycloak();
  const history = useHistory();
  const location = useLocation();

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

  return keycloak.authenticated ? (
    <>
      {!user.data ? (
        <Switch location={location}>
          <Route>
            <div className="flex justify-center items-center h-full">
              <Loader />
            </div>
          </Route>
        </Switch>
      ) : (
        <Layout>
          <TransitionGroup className="transition-group">
            <CSSTransition key={location.key} timeout={{ enter: 350, exit: 350 }} classNames={"slide"}>
              <div className="route main">
                <Switch location={location}>
                  <Route path={ROUTES.DASHBOARD.path} component={Dashboard} />
                  <Route path={ROUTES.QUOTES.path} exact={ROUTES.QUOTES.exact} component={Quote} />
                  <Route path={ROUTES.BILLS.path} exact={ROUTES.BILLS.exact} component={BillPage} />
                  <Route path={ROUTES.CUSTOMERS.path} exact={ROUTES.CUSTOMERS.exact} component={Customer} />
                  <Route path={ROUTES.PRODUCTS.path} exact={ROUTES.PRODUCTS.exact} component={ProductsPage} />

                  <Route path={ROUTES.QUOTES.path + "/:id"} component={Quote} />
                  <Route path={ROUTES.BILLS.path + "/:id"} component={BillPage} />
                  <Route path={ROUTES.CUSTOMERS.path + "/:id"} component={Customer} />

                  <Route path={ROUTES.QUOTE_FORM.path} component={QuoteForm} />
                  <Route path={ROUTES.CUSTOMER_FORM.path} component={CustomerForm} />

                  <Route path={ROUTES.SETTINGS.path} exact={ROUTES.SETTINGS.exact} component={Settings} />
                  <Route path={ROUTES.ONBOARDING_COMPANY.path} component={Onboarding} />
                  <Route>
                    <Redirect to={ROUTES.DASHBOARD.path} />
                  </Route>
                </Switch>
              </div>
            </CSSTransition>
          </TransitionGroup>
        </Layout>
      )}
      <NewsModal />
    </>
  ) : (
    <div className="flex justify-center items-center h-full">
      <Loader />
    </div>
  );
};

export default PrivateSwitch;
