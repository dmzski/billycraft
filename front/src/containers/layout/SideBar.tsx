import { Icon } from "@coco-ui/core";
import { useKeycloak } from "@react-keycloak/web";
import React from "react";
import { Link } from "react-router-dom";
import { VERSION } from "../../constants/global";
import { useUser } from "../../providers/UserProvider";
import { ROUTES } from "../../routes";
import SideBarMenu from "./SideBarMenu";

const SideBar = (): JSX.Element => {
  const user = useUser();
  const { keycloak } = useKeycloak();

  const logout = () => {
    keycloak.logout();
  };

  return (
    <div className="w-full bg-white flex flex-col h-full border-r-2 border-primary-600 z-10">
      <div className="flex flex-col items-center justify-center mt-3">
        {user.data?.company?.logo ? <img src={user.data?.company?.logo} className="h-24 mb-2" alt="Logo" /> : <div className="h-24"></div>}
        <p>Hello {user.data ? user.data.firstName : ""} 👋</p>
        <p className="font-bold mt-1">{user.data?.company?.name}</p>
      </div>

      <div className="flex flex-col h-full justify-between mt-3 flex-grow overflow-y-auto">
        <div className="flex-grow">
          <SideBarMenu />
        </div>

        <div className="bottom-0 mt-10 mb-3 w-full">
          <a
            className="mb-2 flex items-center py-2 px-8 text-warning-500 hover:bg-warning-100 border-r-4 border-white hover:border-warning-500"
            href="https://www.paypal.com/paypalme/dorianmaliszewski?locale.x=fr_FR"
            target="blank"
          >
            <Icon name="heart" />
            <span className="mx-4 font-medium">Faire un don</span>
          </a>
          <Link
            className="mb-2 flex items-center py-2 px-8 text-info-600 hover:bg-info-100 border-r-4 border-white hover:border-info-600"
            to={ROUTES.SUPPORT.path}
          >
            <Icon name="question-mark-circle" />
            <span className="mx-4 font-medium">Support</span>
          </Link>
          <Link
            to="#"
            className="border-r-4 border-white flex items-center py-2 px-8 text-error-700 hover:bg-error-200 hover:border-error-700"
            onClick={logout}
          >
            <Icon name="logout" type="outline" />
            <span className="mx-4 font-medium">Déconnexion</span>
          </Link>
          <div className="text-xs text-center">{VERSION}</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
