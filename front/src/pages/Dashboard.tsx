import { startOfMonth, startOfYear, addMinutes, formatISO, formatISO9075 } from "date-fns";
import { subMinutes } from "date-fns/esm";
import React from "react";
import { useQuery } from "react-query";
import { HttpClient } from "../api/HttpClient";
import { ReportApi } from "../api/ReportApi";
import Loader from "../components/Loader";
import { VERSION } from "../constants/global";
import DashboardCard from "../containers/cards/DashboardCard";
import Layout from "../containers/layout/Layout";
import ReportCards from "../containers/reports/ReportCards";
import YearReportGraph from "../containers/reports/YearReportGraph";
import CounterAnimated from "../containers/texts/CounterAnimated";
import { ReportDTO } from "../models/dtos/Report";

const Dashboard = () => {
  const [dateTarget, setDateTarget] = React.useState(new Date());
  const monthReportQuery = useQuery<ReportDTO>(["month-report", startOfMonth(dateTarget)], ReportApi.getMonthReport, {
    refetchOnWindowFocus: false,
  });
  const yearReportQuery = useQuery<ReportDTO>(["year-report", startOfYear(dateTarget)], ReportApi.getYearReport, {
    refetchOnWindowFocus: false,
  });

  if (monthReportQuery.isLoading || !monthReportQuery.data) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const monthReport = monthReportQuery.data || new ReportDTO();
  const yearReport = yearReportQuery.data || new ReportDTO();

  return (
    <div className="px-10">
      <div className="flex flex-col justify-center items-center">
        <h2 className="text-center font-bold text-2xl">Mois en cours</h2>
        {monthReportQuery.isLoading ? (
          <div>
            <Loader />
          </div>
        ) : (
          <ReportCards report={monthReport} />
        )}
      </div>
      <div className="mt-2 flex flex-col justify-center items-center">
        <h2 className="text-center font-bold text-2xl">Année en cours</h2>
        <ReportCards report={yearReport} />
        <div className="w-full bg-white shadow-lg rounded-md mt-2">
          <YearReportGraph report={yearReport} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
