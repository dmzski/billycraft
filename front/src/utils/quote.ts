import { compareAsc, formatISO9075, parseJSON } from 'date-fns'
import Customer from 'models/Customer'
import { QUOTE_STATUS } from '../constants/quote'
import Quote, { QuoteLine } from '../models/Quote'

export function sortQuotes(array: Quote[]): Quote[] {
  return array.sort((quoteA, quoteB) => {
    const updateAtCompare = compareAsc(new Date(quoteA.updatedAt), new Date(quoteB.updatedAt))
    if (updateAtCompare === 0) {
      const statusA = Object.values(QUOTE_STATUS).find(s => s.enum === quoteA.status) || {
        weight: 0,
      }
      const statusB = Object.values(QUOTE_STATUS).find(s => s.enum === quoteB.status) || {
        weight: 0,
      }
      if (statusA.weight > statusB.weight) {
        return 1
      }

      return statusA.weight < statusB.weight ? -1 : 0
    }
    return updateAtCompare
  })
}

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
    if (
      filters.sentAt &&
      ((quote.sentAt && !formatISO9075(parseJSON(quote.sentAt)).includes(filters.sentAt)) ||
        !quote.sentAt)
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
    QUOTE_STATUS.ARCHIVED.enum,
    QUOTE_STATUS.ACCEPTED.enum,
    QUOTE_STATUS.DEPOSIT_ASK.enum,
    QUOTE_STATUS.DEPOSIT_PAID.enum,
  ].includes(status)
