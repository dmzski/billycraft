import { Icon } from '@coco-ui/core'
import { useKeycloak } from '@react-keycloak/web'
import { Link } from 'react-router-dom'
import { useUser } from 'providers/UserProvider'
import { ROUTES } from 'routes'
import SideBarMenu from './SideBarMenu'

const SideBar = (): JSX.Element => {
  const user = useUser()
  const { keycloak } = useKeycloak()

  const logout = () => {
    keycloak.logout()
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col items-center justify-center mt-4">
        {user.user ? (
          <p className="text-xs">
            Connecté en tant que <span className="text-primary-700">{user.user.firstName}</span>
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

        <div className="mt-10 mb-4 w-full">
          <a
            className="mb-2 flex items-center py-2 px-8 text-warning-500 hover:bg-warning-100 border-r-4 border-white hover:border-warning-500"
            href="https://www.paypal.com/paypalme/dorianmaliszewski?locale.x=fr_FR"
            target="blank"
          >
            <Icon name="heart" />
            <span className="mx-4 font-medium">Faire un don</span>
          </a>
          <Link
            className="mb-2 flex items-center py-2 px-8 text-info-600 hover:bg-info-100 border-r-4 border-white hover:border-info-600"
            to={ROUTES.SUPPORT.path}
          >
            <Icon name="question-mark-circle" />
            <span className="mx-4 font-medium">Support</span>
          </Link>
          <button
            type="button"
            className="appearance-none border-r-4 border-white flex items-center py-2 px-8 text-error-700 hover:bg-error-200 hover:border-error-700"
            onClick={logout}
          >
            <Icon name="logout" type="outline" />
            <span className="mx-4 font-medium">Déconnexion</span>
          </button>
          <div className="text-xs text-center">{process.env.VERSION}</div>
        </div>
      </div>
    </div>
  )
}

export default SideBar
