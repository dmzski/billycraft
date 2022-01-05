import { formatRFC3339 } from 'date-fns'
import { ReportRequest, ReportResponse } from 'models/Report'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'

export const REPORT_URL = `${API_URL}/reports`

export const ReportApi = {
  getMonthReport: async (date: Date | number): Promise<ReportResponse> =>
    HttpClient.GET(
      `${REPORT_URL}/month?${new URLSearchParams({
        date: formatRFC3339(date),
      })}`,
    ),
  getYearReport: async (date: Date | number): Promise<ReportResponse> =>
    HttpClient.GET(
      `${REPORT_URL}/year?${new URLSearchParams({
        date: formatRFC3339(date),
      })}`,
    ),
  delete: async (id: number): Promise<undefined> => HttpClient.DELETE(`${REPORT_URL}/${id}`, {}),

  findAll: (): Promise<ReportResponse[]> => HttpClient.GET(`${REPORT_URL}`),
  findById: (id: string): Promise<ReportResponse> => HttpClient.GET(`${REPORT_URL}/${id}`),
  create: (request: ReportRequest): Promise<ReportResponse> =>
    HttpClient.POST(`${REPORT_URL}`, request),
  update: (id: string, request: ReportRequest): Promise<ReportResponse> =>
    HttpClient.PATCH(`${REPORT_URL}/${id}`, request),
}
