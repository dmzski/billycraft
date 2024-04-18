import Customer from '@/models/Customer'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'
import { CustomerCreateRequest } from '@/models/dtos/CustomerCreateRequest'
import { CustomerUpdateRequest } from '@/models/dtos/CustomerUpdateRequest'

export const CUSTOMER_URL = `${API_URL}/customers`

export const CustomerApi = {
  findAll: () => HttpClient.GET<Customer[]>(`${CUSTOMER_URL}`),
  findAllNotDeleted: () =>
    HttpClient.GET<Customer[] | undefined>(`${CUSTOMER_URL}`).then((res: Customer[]) =>
      res.filter(({ deleted }) => !deleted),
    ),
  create: (data: CustomerCreateRequest) => HttpClient.POST<Customer>(`${CUSTOMER_URL}`, data),
  update: ({ id, ...data }: CustomerUpdateRequest) =>
    HttpClient.PATCH<Customer>(`${CUSTOMER_URL}/${id}`, data),
  findById: (id: Customer['id']) => HttpClient.GET<Customer | undefined>(`${CUSTOMER_URL}/${id}`),
  findAllByNameContains: (search: Customer['name']) =>
    HttpClient.GET<Customer[] | undefined>(`${CUSTOMER_URL}?search=${search}`),
  delete: (id: Customer['id']) => HttpClient.DELETE(`${CUSTOMER_URL}/${id}`),
}
