import { ToastProvider } from '@coco-ui/core'
import { AuthProvider } from './AuthProvider'
import { UserProvider } from './UserProvider'
import { DataLoaderProvider } from '@scaleway/use-dataloader'
import { ReactNode } from 'react'



type MainProviderProps = {
  children: ReactNode
}
const MainProvider = ({ children }: MainProviderProps) => (
    <DataLoaderProvider>
      <AuthProvider>
        <ToastProvider>
          <UserProvider>{children}</UserProvider>
        </ToastProvider>
      </AuthProvider>
    </DataLoaderProvider>
  )

export default MainProvider
