import React from "react";
import SearchBar from "../../components/SearchBar";
import SideBar from "./SideBar";

import useBreakpoint from "../../hooks/useBreakpoint";
import MobileLayout from "./MobileLayout";

const Layout: React.FC<any> = (props) => {
  const breakpoint = useBreakpoint();

  if (!breakpoint.isMd) {
    return <MobileLayout {...props} />;
  }

  return (
    <div className="flex h-full w-full">
      <div className="fixed left-0 top-0 h-full z-10 w-64">
        <SideBar />
      </div>
      <div className="flex w-full flex-col fixed pl-64 h-10 z-10">
        <SearchBar />
      </div>
      <div className="pl-64 pt-10 w-full relative">{props.children}</div>
    </div>
  );
};

export default Layout;
