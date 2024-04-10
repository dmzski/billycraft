import { formatISO9075, parseJSON } from 'date-fns'
import Customer from '@/models/Customer'
import Quote, { QuoteLine, QuoteStatusEnum } from '../models/Quote'

export function filterQuotes(
  array: Quote[],
  filters: Record<string, string>,
  customers: Customer[],
): Quote[] {
  if (!array) return []
  if (!filters) return array
  const arrayFiltered = [...array]
  return arrayFiltered.filter((quote: Quote) => {
    let takeIt = true
    const customer = customers.find(c => c.id === quote.customerId)
    if (filters.id && !quote.id.trim().includes(filters.id.toUpperCase().trim())) {
      takeIt = false
    }
    if (filters.status && filters.status !== 'none' && quote.status !== filters.status) {
      takeIt = false
    }
    if (
      filters.customer &&
      !customer?.name.toLowerCase().trim().includes(filters.customer.toLowerCase().trim())
    ) {
      takeIt = false
    }
    if (
      filters.title &&
      !quote.title?.toLowerCase().trim().includes(filters.title.toLowerCase().trim())
    ) {
      takeIt = false
    }

    if (
      filters.createdAt &&
      quote.createdAt &&
      !formatISO9075(parseJSON(quote.createdAt)).includes(filters.createdAt)
    ) {
      takeIt = false
    }
    return takeIt
  })
}

export function calculatePriceTTC(price?: number | string | null, tva = 0): number {
  if (!price) {
    return 0
  }
  const finalPrice = Number(`${price}`)
  return finalPrice + finalPrice * (tva / 100)
}

export function getQuoteTotal(quote: Quote): number {
  const array = quote.lines
    .filter((quoteLine: QuoteLine) => quoteLine.price && quoteLine.quantity)
    .map(
      (quoteLine: QuoteLine) =>
        calculatePriceTTC(quoteLine.price, quote.tva) *
        (quoteLine.quantity ? quoteLine.quantity : 0),
    )

  if (array && array.length > 0) {
    return array.reduce(
      (previousValue: number, currentValue: number) => previousValue + currentValue,
    )
  }
  return 0
}

export const isQuoteMinimumAccepted = ({ status }: Quote): boolean =>
  [
    QuoteStatusEnum.ARCHIVED,
    QuoteStatusEnum.ACCEPTED,
    QuoteStatusEnum.DEPOSIT_ASK
  ].includes(status)
