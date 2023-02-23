import * as React from 'react'
import SideBar from './SideBar'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps): JSX.Element => (
  <div className="min-h-screen w-screen flex overflow-hidden">
    <aside className="shadow w-64 overflow-y-auto fixed h-screen">
      <SideBar />
    </aside>
    <div className="w-full pl-64">
      <main className="w-full flex flex-col p-10 h-full">{children}</main>
    </div>
  </div>
)

export default Layout
