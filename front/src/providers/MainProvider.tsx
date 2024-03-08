import { ToastProvider } from '@coco-ui/core'
import * as React from 'react'
import { QueryCache, ReactQueryCacheProvider } from 'react-query'
import { AuthProvider } from './AuthProvider'
import { UserProvider } from './UserProvider'

const queryCache = new QueryCache()


type MainProviderProps = {
  children: React.ReactNode
}
const MainProvider = ({ children }: MainProviderProps): JSX.Element => (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <AuthProvider>
        <ToastProvider>
          <UserProvider>{children}</UserProvider>
        </ToastProvider>
      </AuthProvider>
    </ReactQueryCacheProvider>
  )

export default MainProvider
