import { ReactKeycloakProvider } from "@react-keycloak/web";
import React from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import { graphQLClient } from "../graphql/GraphQLClient";
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

const MainProvider: React.FC<any> = ({ children }) => {
  const onKeycloakTokens = (tokens: any) => {
    if (tokens.idToken) {
      fetchRegister(tokens.idToken);
      graphQLClient.setHeader("Authorization", "Bearer " + tokens.idToken);
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
