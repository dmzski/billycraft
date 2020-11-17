import React from "react";
import { useRouteMatch } from "react-router-dom";
import { ROUTES } from "../../routes";
import MenuItem from "./MenuItem";

const menuRoutes = [ROUTES.DASHBOARD, ROUTES.QUOTES, ROUTES.BILLS, ROUTES.CUSTOMERS, ROUTES.PRODUCTS, ROUTES.SETTINGS];

const SideBarMenu = () => {
  return (
    <div className="h-full">
      {menuRoutes
        .sort((routeA, routeB) => routeA.title.localeCompare(routeB.title))
        .map((route) => (
          <MenuItem key={route.path} text={route.title} icon={route.icon} path={route.path} />
        ))}
    </div>
  );
};

export default SideBarMenu;
