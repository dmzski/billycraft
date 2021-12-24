import { formatRFC3339 } from 'date-fns'
import { ReportDTO } from 'models/dtos/Report'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'

export const REPORT_URL = `${API_URL}/reports`

export const ReportApi = {
  getMonthReport: async (date: Date | number): Promise<ReportDTO> =>
    HttpClient.GET(
      `${REPORT_URL}/month?${new URLSearchParams({
        date: formatRFC3339(date),
      })}`,
    ),
  getYearReport: async (date: Date | number): Promise<ReportDTO> =>
    HttpClient.GET(
      `${REPORT_URL}/year?${new URLSearchParams({
        date: formatRFC3339(date),
      })}`,
    ),
}
