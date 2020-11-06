import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Link } from "react-router-dom";
import { VERSION } from "../../constants/global";
import { useUser } from "../../providers/UserProvider";
import SideBarMenu from "./SideBarMenu";

const SideBar = () => {
  const user = useUser();
  const { keycloak } = useKeycloak();

  const toggleDarkMode = () => {
    if (document.body.dataset.theme !== "dark") {
      document.body.dataset.theme = "dark";
      window.localStorage.setItem("theme", "dark");
    } else {
      document.body.dataset.theme = "light";
      window.localStorage.setItem("theme", "light");
    }
  };

  const logout = (e: any) => {
    keycloak.logout();
  };

  return (
    <div className="bg-gray-200 fixed sidebar">
      <div className="flex flex-col sm:flex-row sm:justify-around">
        <div className="w-64 bg-white h-screen relative">
          <div className="flex items-center justify-center mt-10">
            <p>Hello {user.data ? user.data.firstName : ""} </p>
          </div>

          <SideBarMenu />

          <div className="absolute bottom-0 mt-10 mb-3 w-full">
            <Link className="mb-3 flex items-center py-2 px-8 text-gray-500 hover:text-purple-700" to="/support">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM10 7C9.63113 7 9.3076 7.19922 9.13318 7.50073C8.85664 7.97879 8.24491 8.14215 7.76685 7.86561C7.28879 7.58906 7.12543 6.97733 7.40197 6.49927C7.91918 5.60518 8.88833 5 10 5C11.6569 5 13 6.34315 13 8C13 9.30622 12.1652 10.4175 11 10.8293V11C11 11.5523 10.5523 12 10 12C9.44773 12 9.00001 11.5523 9.00001 11V10C9.00001 9.44772 9.44773 9 10 9C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7ZM10 15C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13C9.44772 13 9 13.4477 9 14C9 14.5523 9.44772 15 10 15Z"
                  fill="currentColor"
                />
              </svg>

              <span className="mx-4 font-medium">Support</span>
            </Link>
            <Link to="#" className="flex items-center py-2 px-8 text-gray-500 hover:text-red-700" onClick={logout}>
              <span className="material-icons">no_meeting_room</span>
              <span className="mx-4 font-medium">Déconnexion</span>
            </Link>
            <div className="text-xs text-center">{VERSION}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
