import Customer from '@/models/Customer'
import Bill, { BillLine } from '../models/Bill'
import formatISO9075 from 'date-fns/formatISO9075'
import parseJSON from 'date-fns/parseJSON'
import { calculatePriceET, calculatePriceTTC } from './price'
import { LineTypeEnum } from '@/models/LineTypeEnum'

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

export function getBillTotalEt(bill: Bill): number {
  const array = bill.lines
    .filter((billLine: BillLine) => billLine.price && billLine.quantity)
    .map(
      (billine: BillLine) => calculatePriceET(billine.price) * (billine.quantity ?? 0),
    )

  if (array && array.length > 0) {
    return array.reduce(
      (previousValue: number, currentValue: number) => previousValue + currentValue,
    )
  }
  return 0
}

export function getBillTotalETForLineType(quote: Bill, type: LineTypeEnum): number {
  const array = quote.lines
    .filter((quoteLine: BillLine) => quoteLine.price && quoteLine.quantity && quoteLine.type === type)
    .map(
      (quoteLine: BillLine) =>
        calculatePriceET(quoteLine.price) *
        (quoteLine.quantity ? quoteLine.quantity : 0),
    )

  if (array && array.length > 0) {
    return array.reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0
    )
  }
  return 0
}

export function getBillTotalForLineType(quote: Bill, type: LineTypeEnum): number {
  const array = quote.lines
    .filter((quoteLine: BillLine) => quoteLine.price && quoteLine.quantity && quoteLine.type === type)
    .map(
      (quoteLine: BillLine) =>
        calculatePriceTTC(quoteLine.price, quote.tva) *
        (quoteLine.quantity ? quoteLine.quantity : 0),
    )

  if (array && array.length > 0) {
    return array.reduce(
      (previousValue, currentValue) => previousValue + currentValue, 0
    )
  }
  return 0
}
