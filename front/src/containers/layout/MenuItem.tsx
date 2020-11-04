import React from "react";
import { NavLink, useHistory, useRouteMatch } from "react-router-dom";

const MenuItem: React.FC<any> = ({ text, icon, path, exact }) => {
  const history = useHistory();
  const match = useRouteMatch({
    path,
    exact,
  });
  const navigate = function () {
    history.push(path);
  };

  return (
    <div onClick={navigate} className={"flex mt-5 items-center py-2 px-8 menu-item " + (match ? "active" : "")}>
      <span className="h-5 w-5 material-icons">{icon}</span>

      <span className="mx-4 font-medium">{text}</span>
    </div>
  );
};

export default MenuItem;
