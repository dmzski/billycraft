import { Icon } from "@coco-ui/core";
import { IconName } from "@coco-ui/core/dist/components/Icon";
import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

type MenuItemProps = {
  text: string;
  icon: IconName;
  path: string;
  exact?: boolean;
};
const MenuItem = ({ text, icon, path, exact }: MenuItemProps): JSX.Element => {
  const history = useHistory();
  const match = useRouteMatch({
    path,
    exact,
  });
  const navigate = function () {
    history.push(path);
  };

  return (
    <div
      onClick={navigate}
      className={`flex items-center py-3 px-8 text-primary-600 border-r-4 cursor-pointer ${
        match
          ? "border-primary-600 font-bold bg-primary-200"
          : "bg-white border-white"
      }`}
    >
      <Icon name={icon} />
      <span className="mx-4">{text}</span>
    </div>
  );
};

export default MenuItem;
