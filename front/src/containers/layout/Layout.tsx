import React from "react";
import SearchBar from "../../components/SearchBar";
import SideBar from "./SideBar";

const Layout: React.FC<any> = (props) => {
  return (
    <div className="flex h-full w-full">
      <SideBar />
      <div className="flex w-full flex-col fixed ml-64 h-10 z-10">
        <SearchBar />
      </div>
      <div className="main pl-64 pt-10 w-full">{props.children}</div>
    </div>
  );
};

export default Layout;
