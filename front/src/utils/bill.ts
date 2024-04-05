import Customer from '@/models/Customer'
import Bill, { BillLine } from '../models/Bill'
import formatISO9075 from 'date-fns/formatISO9075'
import parseJSON from 'date-fns/parseJSON'

export function filterBills(
  array: Bill[],
  filters: Record<string, string>,
  customers: Customer[],
): Bill[] {
  if (!array) return []
  if (!filters) return array
  const arrayFiltered = [...array]
  return arrayFiltered.filter((bill: Bill) => {
    let takeIt = true
    const customer = customers.find(c => c.id === bill.customerId)
    if (filters.id && !bill.id.trim().includes(filters.id.toUpperCase().trim())) {
      takeIt = false
    }
    if (filters.status && filters.status !== 'none' && bill.status !== filters.status) {
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
      !bill.title?.toLowerCase().trim().includes(filters.title.toLowerCase().trim())
    ) {
      takeIt = false
    }
    if (
      filters.createdAt &&
      bill.createdAt &&
      !formatISO9075(parseJSON(bill.createdAt)).includes(filters.createdAt)
    ) {
      takeIt = false
    }
    return takeIt
  })
}

export function calculatePriceTTC(price?: number | string | null, tva = 0): number {
  if (!price || Number.isNaN(price)) {
    return 0
  }
  const finalPrice = Number(`${price}`)
  return finalPrice + finalPrice * (tva / 100)
}

export function getBillTotal(bill: Bill): number {
  const array = bill.lines
    .filter((billLine: BillLine) => billLine.price && billLine.quantity)
    .map(
      (billine: BillLine) => calculatePriceTTC(billine.price, bill.tva) * (billine.quantity ?? 0),
    )

  if (array && array.length > 0) {
    return array.reduce(
      (previousValue: number, currentValue: number) => previousValue + currentValue,
    )
  }
  return 0
}
