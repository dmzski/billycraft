import { API_URL } from "constants/global";
import { HttpClient } from "./HttpClient";

export const SETTING_URL = API_URL + "/settings";

export const SettingApi = {
  findAll: (): Promise<any> => HttpClient.GET<any>(`${SETTING_URL}`),
};
