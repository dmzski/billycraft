import { compareAsc, format, isAfter, parseJSON } from "date-fns";
import { QUOTE_STATUS } from "../constants/quote";
import { Bill, BillLine } from "../models/Bill";

export function sortBills(array: any[]) {
  return array.sort((quoteA, quoteB) => {
    const updateAtCompare = compareAsc(new Date(quoteA.updatedAt), new Date(quoteB.updatedAt));
    if (updateAtCompare === 0) {
      const statusA = Object.values(QUOTE_STATUS).find((s) => s.enum === quoteA.status);
      const statusB = Object.values(QUOTE_STATUS).find((s) => s.enum === quoteB.status);
      return statusA!.weight > statusB!.weight ? 1 : statusA!.weight < statusB!.weight ? -1 : 0;
    }
    return updateAtCompare;
  });
}

export function filterBills(array: any[], filters: any) {
  if (!array) return [];
  if (!filters) return array;
  const arrayFiltered = [...array];
  return arrayFiltered.filter((quote: Bill) => {
    let takeIt = true;
    if (filters.customer && !quote.customer?.name.toLowerCase().trim().includes(filters.customer.toLowerCase().trim())) {
      takeIt = false;
    }
    if (filters.title && !quote.title?.toLowerCase().trim().includes(filters.title.toLowerCase().trim())) {
      takeIt = false;
    }
    if (filters.createdAt && quote.createdAt && !format(parseJSON(quote.createdAt), "dd/MM/yyyy à HH:mm").includes(filters.createdAt)) {
      takeIt = false;
    }
    return takeIt;
  });
}

export function calculatePriceTTC(line: BillLine, tva = 0) {
  const price = parseFloat(line.price as any);
  return price + price * (tva / 100);
}

export function getBillTotal(quote: Bill) {
  let total = 0;
  total = quote.lines
    .map((quoteLine: BillLine) => calculatePriceTTC(quoteLine, quote.tva) * quoteLine.quantity)
    .reduce((previousValue: number, currentValue: number) => previousValue + currentValue);
  return total;
}
