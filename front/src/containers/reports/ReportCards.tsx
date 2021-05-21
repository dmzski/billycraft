import React from "react";
import { ReportDTO } from "../../models/dtos/Report";
import DashboardCard from "../cards/DashboardCard";
import CounterAnimated from "../texts/CounterAnimated";

const ReportCards = ({ report }: { report: ReportDTO }): JSX.Element => {
  return (
    <div className="flex flex-wrap justify-between w-full items-center">
      <DashboardCard size="w-full md:w-1/2 lg:w-1/5" icon="cash" title="Chiffre d'affaire">
        <span className="text-2xl mr-3">
          <CounterAnimated value={Math.round(report.sales * 100) / 100} />
        </span>
        <span className="text-sm font-normal">€</span>
      </DashboardCard>
      <DashboardCard size="w-full md:w-1/2 lg:w-1/5" icon="cube" title="CA Matériels" color="text-info-600">
        <span className="text-2xl mr-3">
          <CounterAnimated value={Math.round(report.articleSales * 100) / 100} />
        </span>
        <span className="text-sm font-normal">€</span>
      </DashboardCard>
      <DashboardCard size="w-full md:w-1/2 lg:w-1/5" icon="hand" title="CA Services" color="text-success-600">
        <span className="text-2xl mr-3">
          <CounterAnimated value={Math.round(report.serviceSales * 100) / 100} />
        </span>
        <span className="text-sm font-normal">€</span>
      </DashboardCard>
      <DashboardCard size="w-full md:w-1/2 lg:w-1/5" icon="question-mark-circle" title="CA Autres types de services" color="text-gray-600">
        <span className="text-2xl mr-3">
          <CounterAnimated value={Math.round(report.otherSales * 100) / 100} />
        </span>
        <span className="text-sm font-normal">€</span>
      </DashboardCard>
    </div>
  );
};

export default ReportCards;
