import React from "react";
import { ReportDTO } from "../../models/dtos/Report";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseJSON } from "date-fns";
import { getNormalizedDate } from "../../utils/date";

const YearReportGraph = ({ report }: { report: ReportDTO }): JSX.Element => {
  const data = React.useMemo(() => {
    if (report) {
      return report.details.map((monthReport) => {
        return {
          name: format(getNormalizedDate(parseJSON(monthReport.startDate)), "MM-yyyy"),
          articleSales: monthReport.articleSales,
          serviceSales: monthReport.serviceSales,
          otherSales: monthReport.otherSales,
        };
      });
    }
  }, [report]);

  return (
    <ResponsiveContainer minWidth="100%" height={400}>
      <BarChart
        stackOffset="sign"
        data={data}
        margin={{
          top: 50,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="articleSales" stackId="1" fill="text-info-600" className="text-info-600 fill-current" name="Vente de matériels" />
        <Bar
          dataKey="serviceSales"
          stackId="1"
          fill="text-success-600"
          className="text-success-600 fill-current"
          name="Vente de services commerciaux ou artisanaux"
        />
        <Bar dataKey="otherSales" fill="text-gray-600" stackId="1" className="text-gray-600 fill-current" name="Vente d'autres types de service" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default YearReportGraph;
