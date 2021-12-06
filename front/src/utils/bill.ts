import { compareAsc, format, parseJSON } from "date-fns";
import Customer from "models/Customer";
import { BILL_STATUS } from "../constants/bill";
import Bill, { BillLine } from "../models/Bill";

export function sortBills(array: Bill[]): Bill[] {
  return array.sort((billA, billB) => {
    const updateAtCompare = compareAsc(
      new Date(billA.updatedAt),
      new Date(billB.updatedAt)
    );
    if (updateAtCompare === 0) {
      const statusA = Object.values(BILL_STATUS).find(
        (s) => s.enum === billA.status
      ) || { weight: 0 };
      const statusB = Object.values(BILL_STATUS).find(
        (s) => s.enum === billB.status
      ) || { weight: 0 };
      return statusA.weight > statusB.weight
        ? 1
        : statusA.weight < statusB.weight
        ? -1
        : 0;
    }
    return updateAtCompare;
  });
}

export function filterBills(
  array: Bill[],
  filters: Record<string, string>,
  customers: Customer[]
): any[] {
  if (!array) return [];
  if (!filters) return array;
  const arrayFiltered = [...array];
  return arrayFiltered.filter((bill: Bill) => {
    let takeIt = true;
    const customer = customers.find((c) => c.id === bill.customerId);
    if (
      filters.customer &&
      !customer?.name
        .toLowerCase()
        .trim()
        .includes(filters.customer.toLowerCase().trim())
    ) {
      takeIt = false;
    }
    if (
      filters.title &&
      !bill.title
        ?.toLowerCase()
        .trim()
        .includes(filters.title.toLowerCase().trim())
    ) {
      takeIt = false;
    }
    if (
      filters.createdAt &&
      bill.createdAt &&
      !format(parseJSON(bill.createdAt), "dd/MM/yyyy à HH:mm").includes(
        filters.createdAt
      )
    ) {
      takeIt = false;
    }
    if (
      filters.sentAt &&
      ((bill.sentAt &&
        !format(parseJSON(bill.sentAt), "dd/MM/yyyy à HH:mm").includes(
          filters.sentAt
        )) ||
        !bill.sentAt)
    ) {
      takeIt = false;
    }
    return takeIt;
  });
}

export function calculatePriceTTC(
  price?: number | string | null,
  tva = 0
): number {
  if (!price) {
    return 0;
  }
  const finalPrice = Number(`${price}`);
  return finalPrice + finalPrice * (tva / 100);
}

export function getBillTotal(bill: Bill): number {
  const array = bill.lines
    .filter((billLine: BillLine) => billLine.price && billLine.quantity)
    .map(
      (billine: BillLine) =>
        calculatePriceTTC(billine.price, bill.tva) * (billine.quantity ?? 0)
    );

  if (array && array.length > 0) {
    return array.reduce(
      (previousValue: number, currentValue: number) =>
        previousValue + currentValue
    );
  }
  return 0;
}
