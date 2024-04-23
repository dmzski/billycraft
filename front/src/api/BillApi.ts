import { API_URL } from '@/constants/global'
import Bill, { BillStatusEnum } from '@/models/Bill'
import { HttpClient } from './HttpClient'
import { BillUpdateRequest } from '@/models/dtos/BillUpdateRequest'
import { BillCreateRequest } from '@/models/dtos/BillCreateRequest'

export const BILL_URL = `${API_URL}/bills`

export const BillApi = {
  findAll: async () => HttpClient.GET<Bill[]>(`${BILL_URL}`),
  findAllNotArchived: async () => HttpClient.GET<Bill[]>(`${BILL_URL}?not_status=["ARCHIVED"]`),
  findAllNotArchivedAndNotRefused: async () =>
    HttpClient.GET<Bill[]>(`${BILL_URL}?not_status=["ARCHIVED", "REFUSED"]`),
  findAllArchived: async () =>
    HttpClient.GET<Bill[] | undefined>(`${BILL_URL}?status=["ARCHIVED"]`),
  findAllRefused: async () => HttpClient.GET<Bill[]>(`${BILL_URL}?status=["REFUSED"]`),
  findAllNotPaid: async () => HttpClient.GET<Bill[]>(`${BILL_URL}?filter=not_paid`),
  create: async ({ customerId, lines, status, title, tva }: BillCreateRequest) => {
    const data = {
      customerId,
      lines: (lines || []).map(({ name, description, line, price, quantity, type, productId }) => ({
        type,
        name,
        description,
        quantity,
        price,
        line,
        productId,
      })),
      status,
      title,
      tva,
    }

    return HttpClient.POST<Bill>(`${BILL_URL}`, data)
  },
  update: async ({ id, customerId, lines, status, title, tva }: BillUpdateRequest) => {
    const data = {
      customerId,
      lines: (lines ?? []).map(({ name, description, line, price, quantity, type, productId }) => ({
        type,
        name,
        description,
        quantity,
        price,
        line,
        productId,
      })),
      status,
      title,
      tva,
    }

    return HttpClient.PATCH<Bill>(`${BILL_URL}/${id}`, data)
  },
  findById: async (id: string): Promise<Bill> => HttpClient.GET<Bill>(`${BILL_URL}/${id}`),
  send: async (id: string): Promise<Bill> => HttpClient.POST<Bill>(`${BILL_URL}/${id}/send`, {}),
  createFromQuote: async (quoteId: string): Promise<Bill> =>
    HttpClient.POST<Bill>(`${BILL_URL}/from-quote/${quoteId}`, {}),
  updateStatus: async ({ id, status }: { id: string; status: BillStatusEnum }) =>
    HttpClient.PATCH(`${BILL_URL}/${id}`, { status }),
}
