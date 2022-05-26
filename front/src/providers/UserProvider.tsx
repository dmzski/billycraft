import { useKeycloak } from '@react-keycloak/web'
import { CompanyApi } from 'api/CompanyApi'
import { UserApi } from 'api/UserApi'
import Company from 'models/Company'
import User from 'models/User'
import { useMemo } from 'react'
import * as React from 'react'
import { useQuery } from 'react-query'
import * as Sentry from '@sentry/react'

type UserContextType = {
  user?: User
  company?: Company
}
const UserContext = React.createContext<UserContextType>({} as UserContextType)

type UserProviderProps = {
  children: React.ReactNode
}
const UserProvider = ({ children }: UserProviderProps): JSX.Element => {
  const { keycloak } = useKeycloak()
  const { data: user } = useQuery('my-information', UserApi.getMyInformation, {
    enabled: keycloak.authenticated,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
  })
  const { data: company } = useQuery('my-company', CompanyApi.getMine, {
    enabled: user?.companyId && keycloak.authenticated,
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
  })

  const value = useMemo(() => ({ user, company }), [user, company])

  React.useEffect(() => {
    if (user) {
      Sentry.setUser({ email: user.email })
      Sentry.setExtra('companyId', user.companyId)
    }
  }, [user])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useUser = (): UserContextType => React.useContext(UserContext)

export { UserProvider, useUser }
