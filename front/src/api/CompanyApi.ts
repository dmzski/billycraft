import Company from "models/Company";
import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const COMPANY_URL = API_URL + "/company";

export const CompanyApi = {
  uploadLogo: (file: File): Promise<string> =>
    HttpClient.POST<string>(`${COMPANY_URL}/upload-logo`, file, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    })
      .then((res: any) => res.text())
      .then((url: any) => url),
  getMine: (): Promise<Company> => HttpClient.GET(`${COMPANY_URL}/mine`),
  createOrUpdate: ({ id, ...company }: Company): Promise<Company> =>
    !id
      ? HttpClient.POST(`${COMPANY_URL}`, company)
      : HttpClient.PATCH(`${COMPANY_URL}/${id}`, company),
};
