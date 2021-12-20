export type SupplierRequest = {
  color?: string
  name: string
}

type Supplier = {
  id: number
  name: string
  color?: string
  createdBy: string
  companyId: number
}

export default Supplier
