import React from "react";
import SideBar from "./SideBar";

const Layout: React.FC<any> = (props) => {
  return (
    <div className="flex h-full w-full">
      <SideBar />
      <div className="flex w-full flex-col fixed ml-64 h-10">
        <div className="flex bg-white pt-3 pb-3 rounded-md shadow-sm search-div">
          <div className="inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:leading-5 material-icons mr-3">search</span>
          </div>
          <input className="search-input" placeholder="Rechercher" />
        </div>
      </div>
      <div className="main pl-64 pt-10 w-full">{props.children}</div>
    </div>
  );
};

export default Layout;
