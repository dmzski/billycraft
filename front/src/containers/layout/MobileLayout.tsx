import React from "react";
import SearchBar from "../../components/SearchBar";
import SideBar from "./SideBar";

const MobileLayout: React.FC<any> = (props) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className=" z-10 bg-white shadow-md flex flex-col fixed w-full top-0 h-auto items-center">
        <div className="flex w-full">
          <button className="material-icons p-2" onClick={(e) => setMenuOpen(!menuOpen)}>
            menu
          </button>
          <SearchBar />
        </div>
        {menuOpen && (
          <div className="z-10 h-screen w-full" onClick={(e) => setMenuOpen(false)}>
            <SideBar />
          </div>
        )}
      </div>
      <div className="pt-10 w-full h-full z-0">{props.children}</div>
    </div>
  );
};

export default MobileLayout;
