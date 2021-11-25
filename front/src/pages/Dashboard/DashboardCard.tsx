import { Icon } from "@coco-ui/core";
import React from "react";

type DashboardCardProps = {
  size: string;
  icon: string;
  title: string;
  children?: any;
  color?: string;
};

const DashboardCard = ({
  size,
  icon,
  title,
  children,
  color = "text-primary-700",
}: DashboardCardProps): JSX.Element => {
  return (
    <div className={"flex rounded-md flex-col px-8 py-5 mx-2 my-3 " + size}>
      <div
        className={
          "flex flex-col font-bold justify-center items-center " + color
        }
      >
        <Icon name={icon as any} className="mb-2 text-4xl" />
        <span>{title}</span>
      </div>
      <div className="font-bold mt-2 flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
