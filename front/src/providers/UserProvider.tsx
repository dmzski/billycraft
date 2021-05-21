import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { useQuery } from "react-query";
import { UserGraphQL } from "../graphql/UserGraphQL";

const UserContext = React.createContext<any>({} as any);

type UserProviderProps = {
  children: React.ReactNode;
};
const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const { keycloak } = useKeycloak();
  const myInformationQuery = useQuery("my-information", UserGraphQL.getMyInformation, { enabled: keycloak.authenticated });

  return <UserContext.Provider value={{ ...myInformationQuery }}>{children}</UserContext.Provider>;
};

const useUser = (): any => {
  return React.useContext(UserContext);
};

export { UserProvider, useUser };
