import { useUser } from '@/providers/UserProvider'
import SideBarMenu from './SideBarMenu'
import { BuildingOfficeIcon } from '@heroicons/react/24/solid'

const SideBar = () => {
  const { organization } = useUser()

  return (
    <aside className="bg-base-200 bg-opacity-20 border-r w-72 overflow-y-auto fixed h-screen">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="bg-primary shadow-box flex gap-5 pl-5 items-center text-lg py-5 text-primary-content">
            <BuildingOfficeIcon className="w-10" />
            <div className='flex flex-col overflow-hidden'>
              <small className='text-xs'>Entreprise</small>
              <p title={organization?.name} className='truncate'>{organization?.name}</p>
            </div>
          </div>
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
