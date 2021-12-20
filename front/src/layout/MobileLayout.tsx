import { Drawer, Icon } from '@coco-ui/core'
import * as React from 'react'
import SideBar from './SideBar'

type MobileLayoutProps = {
  children: React.ReactNode
}
const MobileLayout = ({ children }: MobileLayoutProps): JSX.Element => {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-md flex flex-col fixed w-full top-0 h-10 justify-center px-2">
        <Icon name="menu" role="button" onClick={() => setMenuOpen(current => !current)} />
      </div>
      <Drawer position="left" onClose={() => setMenuOpen(false)} open={menuOpen} hasBackdrop>
        <div className="overflow-y-auto h-full">
          <SideBar />
        </div>
      </Drawer>
      <main className="container mt-14 pb-4 overflow-x-auto h-full px-4">{children}</main>
    </div>
  )
}

export default MobileLayout
