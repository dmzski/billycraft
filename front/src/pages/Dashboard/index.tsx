import React from "react";
import { useQuery } from "react-query";
import { ReportApi } from "../../api/ReportApi";
import Loader from "../../components/Loader";
import ReportCards from "./ReportCards";
import YearReportGraph from "./YearReportGraph";
import { ReportDTO } from "../../models/dtos/Report";
import TodoList from "./TodoList";
import { Icon } from "@coco-ui/core";

const Dashboard = (): JSX.Element => {
  const [dateTarget] = React.useState(new Date());
  const monthReportQuery = useQuery<ReportDTO>(
    ["month-report", dateTarget],
    () => ReportApi.getMonthReport(dateTarget),
    {
      refetchOnWindowFocus: false,
    }
  );
  const yearReportQuery = useQuery<ReportDTO>(
    ["year-report", dateTarget],
    () => ReportApi.getYearReport(dateTarget),
    {
      refetchOnWindowFocus: false,
    }
  );

  const monthReport = monthReportQuery.data || new ReportDTO();
  const yearReport = yearReportQuery.data || new ReportDTO();

  return (
    <div>
      <h1 className="text-3xl">Accueil</h1>
      <div className="mt-10 flex justify-between items-center">
        <h2 className="text-xl">Vos tâches en cours</h2>
        <div className="flex items-center ml-2 text-xs text-warning-600">
          <Icon size={14} name="exclamation" />
          &nbsp;Les tâches effectuées depuis une 1 semaine ne seront plus
          affichées
        </div>
      </div>
      <div className="mt-6 ml-4">
        <TodoList />
      </div>
      <hr className="my-10" />
      <h2 className="text-xl mt-10">Rapport du mois en cours</h2>
      <div className="flex flex-col justify-center items-center">
        {monthReportQuery.isLoading ? (
          <div>
            <Loader />
          </div>
        ) : (
          <ReportCards report={monthReport} />
        )}
      </div>
      <h2 className="mt-10 text-xl">Rapport de l&apos;année en cours</h2>
      <div className="px-4 flex flex-col justify-center items-center">
        <ReportCards report={yearReport} />
        <YearReportGraph report={yearReport} />
      </div>
    </div>
  );
};

export default Dashboard;
