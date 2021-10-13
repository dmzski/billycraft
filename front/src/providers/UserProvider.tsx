import { useKeycloak } from "@react-keycloak/web";
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

  return (
    <UserContext.Provider value={{ ...myInformationQuery }}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = (): any => {
  return React.useContext(UserContext);
};

export { UserProvider, useUser };
