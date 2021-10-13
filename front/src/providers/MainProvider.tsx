import { ReactKeycloakProvider } from "@react-keycloak/web";
import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { fetchRegister } from "../utils/fetch-interceptor";
import keycloak from "../utils/keycloak";
import { ToastProvider } from "./ToastProvider";
import { UserProvider } from "./UserProvider";

const queryCache = new QueryCache();

const keycloakProviderInitConfig: any = {
  onLoad: "login-required",
  promiseType: "native",
  checkLoginIframe: false,
};

type MainProviderProps = {
  children: React.ReactNode;
};
const MainProvider = ({ children }: MainProviderProps): JSX.Element => {
  const onKeycloakTokens = (tokens: any) => {
    if (tokens.idToken) {
      fetchRegister(tokens.idToken);
    }
  };

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <ReactKeycloakProvider onTokens={onKeycloakTokens} initOptions={keycloakProviderInitConfig} authClient={keycloak}>
        <ToastProvider>
          <UserProvider>{children}</UserProvider>
        </ToastProvider>
      </ReactKeycloakProvider>
    </ReactQueryCacheProvider>
  );
};

export default MainProvider;
