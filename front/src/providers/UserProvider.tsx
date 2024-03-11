import { CompanyApi } from '@/api/CompanyApi'
import { UserApi } from '@/api/UserApi'
import Company from '@/models/Company'
import User from '@/models/User'
import { ReactNode, createContext, useContext, useEffect, useMemo } from 'react'
import * as Sentry from '@sentry/react'
import { useAuth } from './AuthProvider'
import { useDataLoader } from '@scaleway/use-dataloader'

type UserContextType = {
  user?: User
  company?: Company
}
const UserContext = createContext<UserContextType>({})

type UserProviderProps = {
  children: ReactNode
}
const UserProvider = ({ children }: UserProviderProps) => {
  const { isAuthenticated } = useAuth()
  const { data: user } = useDataLoader('my-information', () => UserApi.getMyInformation(), {
    enabled: isAuthenticated,
    pollingInterval: 10000,
    needPolling: isAuthenticated
  })
  const { data: company } = useDataLoader('my-company', () => CompanyApi.getMine(), {
    enabled: !!user?.companyId && isAuthenticated,
    pollingInterval: 10000,
    needPolling: isAuthenticated && !!user?.companyId
  })

  const value = useMemo(() => ({ user, company }), [user, company])

  useEffect(() => {
    if (user) {
      Sentry.setUser({ email: user.email })
      Sentry.setExtra('companyId', user.companyId)
    }
  }, [user])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

const useUser = (): UserContextType => useContext(UserContext)

export { UserProvider, useUser }
