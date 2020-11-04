import React from "react";
import { useRouteMatch } from "react-router-dom";
import { ROUTES } from "../../routes";
import MenuItem from "./MenuItem";

const menuRoutes = [ROUTES.DASHBOARD, ROUTES.QUOTES, ROUTES.CUSTOMERS, ROUTES.SETTINGS];

const SideBarMenu = () => {
  return (
    <nav className="mt-10">
      {menuRoutes.map((route) => (
        <MenuItem key={route.path} text={route.title} icon={route.icon} path={route.path} />
      ))}
    </nav>
  );
};

export default SideBarMenu;
