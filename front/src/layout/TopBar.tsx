import { Drawer } from '@coco-ui/core'
import SideBar from './SideBar'
import { useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/solid'

const TopBar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex">
      <div className="bg-white shadow-md flex flex-col fixed w-full top-0 h-10 justify-center px-2">
        <Bars3Icon className="w-5" role="button" onClick={() => setMenuOpen(current => !current)} />
      </div>
      <Drawer position="left" onClose={() => setMenuOpen(false)} open={menuOpen} hasBackdrop>
        <div className="overflow-y-auto h-full">
          <SideBar />
        </div>
      </Drawer>
    </div>
  )
}

export default TopBar
