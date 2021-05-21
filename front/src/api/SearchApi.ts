import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const SEARCH_URL = API_URL + "/search";

export const SearchApi = {
  searchContains: async (_: any, search: string): Promise<any> => {
    const { query, abort } = HttpClient.GET(`${SEARCH_URL}/all?query=${search}`);
    const promise = query.then((res: any) => {
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
