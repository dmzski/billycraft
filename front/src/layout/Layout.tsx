import useBreakpoint from '@/hooks/useBreakpoint'
import SideBar from './SideBar'
import TopBar from './TopBar'
import { ReactNode } from 'react'

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const breakpoint = useBreakpoint()

  return (
    <div className="min-h-screen w-screen flex overflow-hidden">
      {!breakpoint.isLg ? <TopBar /> : <SideBar />}
      <div className='w-full pt-10 lg:pt-0 lg:pl-72'>
        <main className='w-full flex flex-col h-full lg:px-20 lg:py-14 p-4'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
