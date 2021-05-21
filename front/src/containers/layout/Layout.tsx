import React from "react";
import SearchBar from "../../components/SearchBar";
import SideBar from "./SideBar";
import useBreakpoint from "../../hooks/useBreakpoint";
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
    <div className="h-full w-full">
      <aside className="h-screen fixed w-64">
        <SideBar />
      </aside>
      <div className="pl-64 flex flex-col">
        <SearchBar />
        <div className="mt-4 pb-2 mx-2 h-full relative">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
