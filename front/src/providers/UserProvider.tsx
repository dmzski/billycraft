import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { UserGraphQL } from "../graphql/UserGraphQL";
import { ROUTES } from "../routes";

const UserContext = React.createContext<any>({} as any);

const UserProvider: React.FC<any> = ({ children }) => {
  const { keycloak } = useKeycloak();
  const myInformationQuery = useQuery("my-information", UserGraphQL.getMyInformation, { enabled: keycloak.authenticated });
  const history = useHistory();

  React.useEffect(() => {
    if (myInformationQuery.data && keycloak.authenticated) {
      if (!myInformationQuery.data.company && history.location.pathname !== ROUTES.ONBOARDING_COMPANY.path) {
        history.push(ROUTES.ONBOARDING_COMPANY.path);
      }
      if (myInformationQuery.data.company && history.location.pathname === ROUTES.ONBOARDING_COMPANY.path) {
        history.push(ROUTES.DASHBOARD.path);
      }
    }
  }, [myInformationQuery, history]);

  return <UserContext.Provider value={{ ...myInformationQuery }}>{children}</UserContext.Provider>;
};

const useUser = () => {
  return React.useContext(UserContext);
};

export { UserProvider, useUser };
