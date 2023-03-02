import * as React from 'react'
import useBreakpoint from 'hooks/useBreakpoint'
import clsx from 'clsx'
import SideBar from './SideBar'
import TopBar from './TopBar'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const breakpoint = useBreakpoint()

  return (
    <div className="min-h-screen w-screen flex overflow-hidden">
      {!breakpoint.isLg ? <TopBar /> : <SideBar />}
      <div className={clsx('w-full', breakpoint.isLg ? 'pl-72' : 'pt-10')}>
        <main className={clsx('w-full flex flex-col h-full', breakpoint.isLg ? 'p-8' : 'p-4')}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
