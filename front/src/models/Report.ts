export type Report = {
  startDate: string
  endDate: string
  sales: number
  articleSales: number
  serviceSales: number
  otherSales: number
  articleTaxes: number
  serviceTaxes: number
  otherTaxes: number
  outgoings: number
  details: Report[]
}

export type ReportOutgoingLineResponse = {
  line: number
  supplierId?: string
  billId?: string
  supplierBillReference?: string
  totalHT: number
  vat: number
}

export type ReportBillResponse = {
  title: string
  billId: string
  paidAt: string
  sentAt: string
  articleSales: number
  serviceSales: number
  otherSales: number
  articleTaxes: number
  servicetaxes: number
  otherTaxes: number
  createdBy: string
}

export type ReportOutgoingResponse = {
  outgoingId: string
  name: string
  startDate: string
  endDate: string
  createdBy: string
  lines: ReportOutgoingLineResponse[]
}

export type ReportResponse = {
  id: string
  name: string
  startDate: string
  endDate: string
  sales: number
  articleSales: number
  serviceSales: number
  otherSales: number
  articleTaxes: number
  serviceTaxes: number
  otherTaxes: number
  totalOutgoings: number
  createdAt: string
  bills: ReportBillResponse[]
  outgoings: ReportOutgoingResponse[]
}

export type ReportRequest = {
  startDate: string
  endDate: string
  name: string
}
