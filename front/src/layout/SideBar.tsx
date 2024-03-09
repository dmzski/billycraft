import { useUser } from '@/providers/UserProvider'
import SideBarMenu from './SideBarMenu'

const SideBar = () => {
  const user = useUser()

  return (
    <aside className="bg-base-200 bg-opacity-20 border-r w-72 overflow-y-auto fixed h-screen">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {user.company?.name ? (
            <p className="text-lg bg-primary w-full text-center py-4 text-primary-content">
              {user.company.name}
            </p>
          ) : null}
          {user.user ? (
            <p className="px-2 text-sm text-center">
              Connecté en tant que&nbsp;
              <span className="text-primary">{user.user.firstName}</span>
            </p>
          ) : null}
          {user.company?.logo ? (
            <div className="flex justify-center">
              <img src={user.company?.logo} className="h-24 w-24 object-contain" alt="Logo" />
            </div>
          ) : (
            <div className="h-24" />
          )}
        </div>

        <div className="flex flex-col flex-grow gap-2">
          <div className="flex-grow">
            <SideBarMenu />
          </div>
          <div className="text-xs text-center">{APP_VERSION}</div>
        </div>
      </div>
    </aside>
  )
}

export default SideBar
