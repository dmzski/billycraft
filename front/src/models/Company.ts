interface Company {
  id: string
  name: string
  city: string
  address: string
  postalCode: string
  phoneNumber: string
  logo?: string
  siret: string
  email: string
  createdBy: string
  createdAt: string
  updatedAt: string
  articlesTax: number
  servicesTax: number
  othersTax: number
  autoMonthReport: boolean
  autoYearReport: boolean
}

export default Company
