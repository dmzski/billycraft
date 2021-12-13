interface QuoteEmailCustomization {
  id?: number
  body: string
  object: string
  sendAutomatically: boolean
  companyId: number
}

export default QuoteEmailCustomization
