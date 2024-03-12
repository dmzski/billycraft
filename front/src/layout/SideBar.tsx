import { useUser } from '@/providers/UserProvider'
import SideBarMenu from './SideBarMenu'
import { BuildingOfficeIcon } from '@heroicons/react/24/solid'

const SideBar = () => {
  const user = useUser()

  return (
    <aside className="bg-base-200 bg-opacity-20 border-r w-72 overflow-y-auto fixed h-screen">
      <div className="w-full h-full flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className='flex gap-3 items-center text-lg p-5'>
            <div className='rounded-full p-3 mask mask-hexagon-2 bg-primary bg-opacity-50'>
              <BuildingOfficeIcon className='w-6 fill-primary-content' />
            </div>
            <p>
              {user.company?.name}
            </p>
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
