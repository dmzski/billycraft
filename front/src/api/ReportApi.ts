import { parseJSON } from "date-fns";
import { API_URL } from "../constants/global";
import { getNormalizedDate } from "../utils/date";
import { HttpClient } from "./HttpClient";

export const REPORT_URL = API_URL + "/reports";

export const ReportApi = {
  getMonthReport: async (_: any, month: string) => {
    const { query, abort } = HttpClient.GET(`${REPORT_URL}/month?query=${getNormalizedDate(parseJSON(month)).toJSON()}`);
    let promise = query.then((res: any) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw res;
      }
    });

    promise.cancel = abort;

    return promise;
  },
  getYearReport: async (_: any, year: string) => {
    const { query, abort } = HttpClient.GET(`${REPORT_URL}/year?query=${getNormalizedDate(parseJSON(year)).toJSON()}`);
    let promise = query.then((res: any) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw res;
      }
    });

    promise.cancel = abort;

    return promise;
  },
};
