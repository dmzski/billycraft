import React from "react";
import { ReportDTO } from "../../models/dtos/Report";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, parseJSON } from "date-fns";

const YearReportGraph: React.FC<{ report: ReportDTO }> = ({ report }) => {
  const data = React.useMemo(() => {
    if (report) {
      return report.details.map((monthReport) => {
        return {
          name: format(parseJSON(monthReport.endDate), "MM-yyyy"),
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
        <Legend margin={{ top: 10, bottom: 50 }} />
        <Bar dataKey="articleSales" stackId="1" fill="#795548" name="Vente de matériels" />
        <Bar dataKey="serviceSales" stackId="1" fill="#48bb78" name="Vente de services commerciaux ou artisanaux" />
        <Bar dataKey="otherSales" stackId="1" fill="#a0aec0" name="Vente d'autres types de service" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default YearReportGraph;
