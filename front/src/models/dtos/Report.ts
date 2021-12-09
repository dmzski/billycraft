export type ReportDTO = {
  startDate: string
  endDate: string
  sales: number
  articleSales: number
  serviceSales: number
  otherSales: number
  details: ReportDTO[]
}
