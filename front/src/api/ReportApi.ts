import { formatRFC3339 } from "date-fns";
import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const REPORT_URL = API_URL + "/reports";

export const ReportApi = {
  getMonthReport: async (date: Date): Promise<any> =>
    HttpClient.GET(
      `${REPORT_URL}/month?${new URLSearchParams({
        date: formatRFC3339(date),
      })}`
    ),
  getYearReport: async (date: Date): Promise<any> => {
    return HttpClient.GET(
      `${REPORT_URL}/year?${new URLSearchParams({
        date: formatRFC3339(date),
      })}`
    );
  },
};
