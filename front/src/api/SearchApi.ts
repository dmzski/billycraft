import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const SEARCH_URL = API_URL + "/search";

export const SearchApi = {
  searchContains: async (search: string): Promise<any> =>
    HttpClient.GET(`${SEARCH_URL}/all?query=${search}`),
};
