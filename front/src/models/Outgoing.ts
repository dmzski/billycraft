export type OutgoingLineResponse = {
  supplierId?: number
  supplierBillReference?: string
  billId?: string
  totalHT: number
  vat: number
  line: number
}

export type OutgoingResponse = {
  id: string
  name: string
  startDate: string
  endDate: string
  lines: OutgoingLineResponse[]
  companyId: number
  createdBy: string
}

export type OutgoingLineRequest = {
  supplierId?: number
  supplierBillReference?: string
  billId?: string
  totalHT: number
  vat: number
  line: number
}

export type OutgoingRequest = {
  name: string
  startDate: string
  endDate: string
  lines: OutgoingLineRequest[]
}
