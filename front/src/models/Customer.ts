interface Customer {
  id: string
  name: string
  contact: string
  phoneNumber: string
  city: string
  postalCode: string
  address: string
  email: string
  createdAt: string
  updatedAt: string
  companyId: string
  deleted?: boolean
}

export default Customer
