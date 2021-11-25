import React from "react";
import SearchBar from "layout/SearchBar";
import SideBar from "./SideBar";
import useBreakpoint from "hooks/useBreakpoint";
import MobileLayout from "./MobileLayout";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const breakpoint = useBreakpoint();

  if (!breakpoint.isMd) {
    return <MobileLayout>{children}</MobileLayout>;
  }

  return (
    <div className="min-h-screen w-screen flex overflow-hidden">
      <aside className="shadow w-64 overflow-y-auto fixed h-screen">
        <SideBar />
      </aside>
      <div className="w-full pl-64">
        <aside className="flex items-center justify-end w-full px-2 h-12 shadow">
          <SearchBar />
        </aside>
        <main className="w-full flex flex-col p-10">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
