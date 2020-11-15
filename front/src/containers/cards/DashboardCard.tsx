import React from "react";

type DashboardCardProps = {
  size: string;
  icon: string;
  title: string;
  children?: any;
  color?: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ size, icon, title, children, color = "text-primary-700" }) => {
  return (
    <div className={"flex bg-white shadow-lg rounded-md flex-col px-8 py-5 mx-2 my-3 " + size}>
      <div className={"flex flex-col font-bold justify-center items-center " + color}>
        <span className="material-icons mb-2 text-4xl">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="font-bold mt-8 flex justify-center items-center">{children}</div>
    </div>
  );
};

export default DashboardCard;
