import { useKeycloak } from '@react-keycloak/web'
import { CompanyApi } from 'api/CompanyApi'
import { UserApi } from 'api/UserApi'
import Company from 'models/Company'
import User from 'models/User'
import { useMemo } from 'react';
import * as React from 'react';
import { QueryResult, useQuery } from 'react-query'

type UserContextType = QueryResult<User, unknown> & {
  company?: Company
}
const UserContext = React.createContext<UserContextType>({} as UserContextType)

type UserProviderProps = {
  children: React.ReactNode
}
const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const { keycloak } = useKeycloak()
  const myInformationQuery = useQuery('my-information', UserApi.getMyInformation, {
    enabled: keycloak.authenticated,
    refetchOnWindowFocus: false,
  })
  const myCompany = useQuery('my-company', CompanyApi.getMine, {
    enabled: myInformationQuery.data?.companyId !== undefined && keycloak.authenticated,
    refetchOnWindowFocus: false,
  })

  const value = useMemo(() => ({ ...myInformationQuery, company: myCompany.data }), [
    myInformationQuery,
    myCompany.data,
  ])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useUser = (): UserContextType => React.useContext(UserContext)

export { UserProvider, useUser }
