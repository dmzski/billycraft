import { IconName } from "@coco-ui/core/dist/components/Icon";
import { ROUTES } from "routes";
import React from "react";
import MenuItem from "./MenuItem";

const menuRoutes = [
  ROUTES.DASHBOARD,
  ROUTES.QUOTES,
  ROUTES.BILLS,
  ROUTES.CUSTOMERS,
  ROUTES.PRODUCTS,
  ROUTES.HISTORY,
  ROUTES.SETTINGS,
];

const SideBarMenu = (): JSX.Element => {
  return (
    <>
      {menuRoutes
        .sort((routeA, routeB) => routeA.title.localeCompare(routeB.title))
        .map((route) => (
          <MenuItem
            key={route.path}
            text={route.title}
            icon={route.icon as IconName}
            path={route.path}
          />
        ))}
    </>
  );
};

export default SideBarMenu;
