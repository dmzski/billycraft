import { API_URL } from 'constants/global'
import Bill from 'models/Bill'
import Quote, { QuoteStatusEnum } from 'models/Quote'
import { HttpClient } from './HttpClient'

export const QUOTE_URL = `${API_URL}/quotes`

export const QuoteApi = {
  findAll: async (): Promise<Quote[]> => HttpClient.GET<Quote[]>(`${QUOTE_URL}`),
  findAllNotArchivedAndNotRefused: async (): Promise<Quote[]> =>
    HttpClient.GET<Quote[]>(
      `${QUOTE_URL}?${new URLSearchParams({
        not_status: JSON.stringify(['ARCHIVED', 'REFUSED']),
      })}`,
    ),
  findAllNotArchived: async (): Promise<Quote[]> =>
    HttpClient.GET<Quote[]>(
      `${QUOTE_URL}?${new URLSearchParams({
        not_status: JSON.stringify(['ARCHIVED']),
      })}`,
    ),
  findAllArchived: async (): Promise<Quote[]> =>
    HttpClient.GET<Quote[]>(`${QUOTE_URL}?${new URLSearchParams([['status', '["ARCHIVED"]']])}`),
  findAllRefused: async (): Promise<Quote[]> =>
    HttpClient.GET<Quote[]>(`${QUOTE_URL}?${new URLSearchParams([['status', '["REFUSED"]']])}`),
  createOrUpdate: async ({ id, customerId, lines, status, title, tva }: Quote): Promise<Quote> => {
    const data = {
      id,
      customerId,
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
      ? HttpClient.POST<Quote>(`${QUOTE_URL}`, data)
      : HttpClient.PATCH<Quote>(`${QUOTE_URL}/${id}`, data)

    return promise
  },
  findById: async (id: string): Promise<Quote> => HttpClient.GET<Quote>(`${QUOTE_URL}/${id}`),
  send: async (id: string): Promise<Quote> => HttpClient.POST<Quote>(`${QUOTE_URL}/${id}/send`, {}),
  updateStatus: async ({ id, status }: { id: string; status: QuoteStatusEnum }): Promise<Quote> =>
    HttpClient.PATCH(`${QUOTE_URL}/${id}`, { status }),
  createBill: async ({ id }: { id: string }): Promise<Bill> =>
    HttpClient.POST<Bill>(`${QUOTE_URL}/${id}/bill`, {}),
}
