import { parseJSON } from "date-fns";
import { API_URL } from "../constants/global";
import { getNormalizedDate } from "../utils/date";
import { HttpClient } from "./HttpClient";

export const REPORT_URL = API_URL + "/reports";

export const ReportApi = {
  getMonthReport: async (month: string): Promise<any> =>
    HttpClient.GET(
      `${REPORT_URL}/month?query=${getNormalizedDate(
        parseJSON(month)
      ).toJSON()}`
    ),
  getYearReport: async (year: string): Promise<any> =>
    HttpClient.GET(
      `${REPORT_URL}/year?query=${getNormalizedDate(parseJSON(year)).toJSON()}`
    ),
};
