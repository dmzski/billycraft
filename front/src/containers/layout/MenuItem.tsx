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
    <div onClick={navigate} className={`flex mt-5 items-center py-2 px-8 text-primary-600 cursor-pointer ${match ? "font-bold bg-primary-200" : "bg-white"}`}>
      <span className="h-5 w-5 material-icons">{icon}</span>

      <span className="mx-4">{text}</span>
    </div>
  );
};

export default MenuItem;
