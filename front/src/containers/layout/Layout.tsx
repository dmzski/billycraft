import React from "react";
import SearchBar from "../../components/SearchBar";
import SideBar from "./SideBar";

import logo from "../../assets/img/logo.png";

const Layout: React.FC<any> = (props) => {
  return (
    <div className="flex h-full w-full">
      <SideBar />
      <div className="flex w-full flex-col fixed ml-64 h-10 z-10">
        <SearchBar />
      </div>
      <div className="main pl-64 pt-10 w-full relative">{props.children}</div>
      <div className="logo">
        <img src={logo} alt="Coco-erp" />
      </div>
    </div>
  );
};

export default Layout;
