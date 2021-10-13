import { API_URL } from "constants/global";
import { HttpClient } from "./HttpClient";

export const USER_URL = API_URL + "/users";

export const UserApi = {
  getMyInformation: async (): Promise<any> => HttpClient.GET(`${USER_URL}/me`),
};
