import Customer from '@/models/Customer'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'

export const CUSTOMER_URL = `${API_URL}/customers`

export const CustomerApi = {
  findAll: () => HttpClient.GET<Customer[]>(`${CUSTOMER_URL}`),
  findAllNotDeleted: () =>
    HttpClient.GET<Customer[] | undefined>(`${CUSTOMER_URL}`).then((res: Customer[]) =>
      res.filter(({ deleted }) => !deleted),
    ),
  createOrUpdate: ({ id, ...data }: Customer): Promise<Customer | undefined> =>
    id ? HttpClient.PATCH(`${CUSTOMER_URL}/${id}`, data) : HttpClient.POST(`${CUSTOMER_URL}`, data),
  findById: (id: number) => HttpClient.GET<Customer | undefined>(`${CUSTOMER_URL}/${id}`),
  findAllByNameContains: (search: string) =>
    HttpClient.GET<Customer[] | undefined>(`${CUSTOMER_URL}?search=${search}`),
  delete: (id: number) => HttpClient.DELETE(`${CUSTOMER_URL}/${id}`),
}
