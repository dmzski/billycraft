import { ToastProvider } from '@coco-ui/core'
import { AuthProvider } from './AuthProvider'
import { UserProvider } from './UserProvider'
import { DataLoaderProvider } from '@scaleway/use-dataloader'
import { ReactNode } from 'react'
import { sendErrorToSentry } from '@/utils/errors'
import { I18nProvider } from '@/i18n'

type MainProviderProps = {
  children: ReactNode
}
const MainProvider = ({ children }: MainProviderProps) => (
  <I18nProvider locale="fr">
    <DataLoaderProvider
      onError={err => {
        sendErrorToSentry(err)
      }}
    >
      <AuthProvider useAuthorizationHeader={window.location.hostname.includes('localhost')}>
        <ToastProvider>
          <UserProvider>{children}</UserProvider>
        </ToastProvider>
      </AuthProvider>
    </DataLoaderProvider>
  </I18nProvider>
)

export default MainProvider
