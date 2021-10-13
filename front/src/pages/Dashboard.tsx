import { startOfMonth, startOfYear } from "date-fns";
import React from "react";
import { useQuery } from "react-query";
import { ReportApi } from "../api/ReportApi";
import Loader from "../components/Loader";
import ReportCards from "../containers/reports/ReportCards";
import YearReportGraph from "../containers/reports/YearReportGraph";
import { ReportDTO } from "../models/dtos/Report";

const Dashboard = (): JSX.Element => {
  const [dateTarget] = React.useState(new Date());
  const monthReportQuery = useQuery<ReportDTO>(
    ["month-report", startOfMonth(dateTarget)],
    (_, month: string) => ReportApi.getMonthReport(month),
    {
      refetchOnWindowFocus: false,
    }
  );
  const yearReportQuery = useQuery<ReportDTO>(
    ["year-report", startOfYear(dateTarget)],
    (_, year: string) => ReportApi.getYearReport(year),
    {
      refetchOnWindowFocus: false,
    }
  );

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
