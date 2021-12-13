import { API_URL } from 'constants/global'
import Bill, { BillStatusEnum } from 'models/Bill'
import { HttpClient } from './HttpClient'

export const BILL_URL = `${API_URL}/bills`

export const BillApi = {
  findAll: async (): Promise<Bill[]> => HttpClient.GET<Bill[]>(`${BILL_URL}`),
  findAllNotArchived: async (): Promise<Bill[]> =>
    HttpClient.GET<Bill[]>(`${BILL_URL}?filter=not_archived`),
  findAllArchived: async (): Promise<Bill[]> =>
    HttpClient.GET<Bill[]>(`${BILL_URL}?filter=archived`),
  createOrUpdate: async ({
    id,
    customerId,
    lines,
    status,
    title,
    tva,
    quoteId,
  }: Bill): Promise<Bill> => {
    const data = {
      id,
      customerId,
      quoteId,
      lines: (lines || []).map(({ name, description, line, price, quantity, type }) => ({
        type,
        name,
        description,
        quantity,
        price,
        line,
      })),
      status,
      title,
      tva,
    }

    const promise = !id
      ? HttpClient.POST<Bill>(`${BILL_URL}`, data)
      : HttpClient.PATCH<Bill>(`${BILL_URL}/${id}`, data)

    return promise
  },
  findById: async (id: string): Promise<Bill> => HttpClient.GET<Bill>(`${BILL_URL}/${id}`),
  send: async (id: string): Promise<Bill> => HttpClient.POST<Bill>(`${BILL_URL}/${id}/send`, {}),
  createFromQuote: async (quoteId: string): Promise<Bill> =>
    HttpClient.POST<Bill>(`${BILL_URL}/from-quote/${quoteId}`, {}),
  updateStatus: async ({ id, status }: { id: string; status: BillStatusEnum }): Promise<Bill> =>
    HttpClient.PATCH(`${BILL_URL}/${id}`, { status }),
}
