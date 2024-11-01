import { Company } from '@/models/Company'
import { User } from '@/models/User'
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo } from 'react'
import * as Sentry from '@sentry/react'
import { useAuth } from './AuthProvider'
import { useMyInformationQuery } from '@/queries/useMyInformationQuery'
import { useMyOrganizationQuery } from '@/queries/useMyOrganizationQuery'

type UserContextType = {
  user?: User
  organization?: Company
  reload: () => Promise<void>
}
const UserContext = createContext<UserContextType>({ reload: () => Promise.resolve() })

type UserProviderProps = {
  children: ReactNode
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { isAuthenticated } = useAuth()
  const { data: user, reload: reloadUser } = useMyInformationQuery({
    enabled: isAuthenticated,
  })
  const { data: organization, reload: reloadOrganization } = useMyOrganizationQuery({
    enabled: !!user?.companyId && isAuthenticated,
  })

  const fullReload = useCallback(async () => {
    await Promise.all([reloadUser(), reloadOrganization()])
  }, [reloadOrganization, reloadUser])

  const value = useMemo(
    () => ({ user, organization, reload: fullReload }),
    [user, organization, fullReload],
  )

  useEffect(() => {
    if (user) {
      Sentry.setUser({ email: user.email })
      Sentry.setExtra('companyId', user.companyId)
    }
  }, [user])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = (): UserContextType => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used inside UserProvider')
  }
  return context
}
