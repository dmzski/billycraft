import { useUser } from 'providers/UserProvider'
import SideBarMenu from './SideBarMenu'

const SideBar = (): JSX.Element => {
  const user = useUser()

  return (
    <aside className="shadow w-64 overflow-y-auto fixed h-screen">
      <div className="w-full h-full flex flex-col gap-2">
        <div className="flex flex-col items-center justify-center mt-4">
          {user.user ? (
            <p className="text-xs">
              Connecté en tant que <span className="text-primary">{user.user.firstName}</span>
            </p>
          ) : null}
          {user.company?.name ? (
            <div className="border rounded my-2 px-2">
              <div className="text-xs opacity-30">Votre entreprise</div>
              <div className="text-lg">{user.company.name}</div>
            </div>
          ) : null}
          {user.company?.logo ? (
            <img src={user.company?.logo} className="h-24 mb-2 w-24 object-contain" alt="Logo" />
          ) : (
            <div className="h-24" />
          )}
        </div>

        <div className="flex flex-col mt-4 flex-grow">
          <div className="flex-grow">
            <SideBarMenu />
          </div>
          <div className="mt-2 text-xs text-center">{process.env.VERSION}</div>
        </div>
      </div>
    </aside>
  )
}

export default SideBar
