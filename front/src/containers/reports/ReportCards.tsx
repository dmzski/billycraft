import React from "react";
import { ReportDTO } from "../../models/dtos/Report";
import DashboardCard from "../cards/DashboardCard";
import CounterAnimated from "../texts/CounterAnimated";

const ReportCards: React.FC<{ report: ReportDTO }> = ({ report }) => {
  return (
    <div className="flex flex-wrap justify-between w-full">
      <DashboardCard size="w-1/5" icon="payment" title="Chiffre d'affaire">
        <span className="text-2xl mr-3">
          <CounterAnimated value={Math.round(report.sales * 100) / 100} />
        </span>
        <span className="text-sm font-normal">€</span>
      </DashboardCard>
      <DashboardCard size="w-1/5" icon="widgets" title="CA Matériels" color="text-secondary-600">
        <span className="text-2xl mr-3">
          <CounterAnimated value={Math.round(report.articleSales * 100) / 100} />
        </span>
        <span className="text-sm font-normal">€</span>
      </DashboardCard>
      <DashboardCard size="w-1/5" icon="construction" title="CA Services" color="text-green-600">
        <span className="text-2xl mr-3">
          <CounterAnimated value={Math.round(report.serviceSales * 100) / 100} />
        </span>
        <span className="text-sm font-normal">€</span>
      </DashboardCard>
      <DashboardCard size="w-1/5" icon="help_outline" title="CA Autres types de services" color="text-gray-600">
        <span className="text-2xl mr-3">
          <CounterAnimated value={Math.round(report.otherSales * 100) / 100} />
        </span>
        <span className="text-sm font-normal">€</span>
      </DashboardCard>
    </div>
  );
};

export default ReportCards;
