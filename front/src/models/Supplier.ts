export type SupplierRequest = {
  color?: string
  name: string
  vat: number
}

type Supplier = {
  id: string
  name: string
  color?: string
  vat: number
  createdBy: string
  companyId: string
}

export default Supplier
