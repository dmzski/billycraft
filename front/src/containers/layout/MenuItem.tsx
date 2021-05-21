import { Icon } from "@coco-ui/core";
import React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const MenuItem = ({ text, icon, path, exact }: any): JSX.Element => {
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
        match ? "border-primary-600 font-bold bg-primary-200" : "bg-white border-white"
      }`}
    >
      <Icon name={icon} />
      <span className="mx-4">{text}</span>
    </div>
  );
};

export default MenuItem;
