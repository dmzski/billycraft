interface QuoteCustomization {
  id?: string
  companyId?: string
  afterTable: string
  footer: string
  mainColor: string
  displayCompanyEmail: boolean
  displayCompanyPhoneNumber: boolean
  displayCustomerEmail: boolean
  displayCustomerPhoneNumber: boolean
  createdAt?: string
  updatedAt?: string
}

export default QuoteCustomization
