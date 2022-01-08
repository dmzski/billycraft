export type SupplierRequest = {
  color?: string
  name: string
  vat: number
}

type Supplier = {
  id: number
  name: string
  color?: string
  vat: number
  createdBy: string
  companyId: number
}

export default Supplier
