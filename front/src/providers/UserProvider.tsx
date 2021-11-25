import { useKeycloak } from "@react-keycloak/web";
import { CompanyApi } from "api/CompanyApi";
import { UserApi } from "api/UserApi";
import React from "react";
import { useQuery } from "react-query";

const UserContext = React.createContext<any>({} as any);

type UserProviderProps = {
  children: React.ReactNode;
};
const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const { keycloak } = useKeycloak();
  const myInformationQuery = useQuery(
    "my-information",
    UserApi.getMyInformation,
    { enabled: keycloak.authenticated, refetchOnWindowFocus: false }
  );
  const myCompany = useQuery("my-company", CompanyApi.getMine, {
    enabled:
      myInformationQuery.data?.companyId !== undefined &&
      keycloak.authenticated,
    refetchOnWindowFocus: false,
  });

  return (
    <UserContext.Provider
      value={{ ...myInformationQuery, company: myCompany.data }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = (): any => {
  return React.useContext(UserContext);
};

export { UserProvider, useUser };
