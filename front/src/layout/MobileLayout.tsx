import * as React from 'react'
import SideBar from './SideBar'

type MobileLayoutProps = {
  children: React.ReactNode
}
const MobileLayout = ({ children }: MobileLayoutProps): JSX.Element => {
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <div className="flex flex-col h-full">
      <div className=" z-10 bg-white shadow-md flex flex-col fixed w-full top-0 h-auto items-center">
        {menuOpen && (
          <button
            type="button"
            className="block appearance-none z-10 h-screen w-full"
            onClick={() => setMenuOpen(false)}
          >
            <SideBar />
          </button>
        )}
      </div>
      <div className="pt-10 w-full h-full z-0">{children}</div>
    </div>
  )
}

export default MobileLayout
