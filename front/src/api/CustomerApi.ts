import Customer from 'models/Customer';
import { API_URL } from '../constants/global';
import { HttpClient } from './HttpClient';

export const CUSTOMER_URL = `${API_URL}/customers`;

export const CustomerApi = {
  findAll: (): Promise<Customer[]> => HttpClient.GET(`${CUSTOMER_URL}`),
  findAllNotDeleted: (): Promise<Customer[]> => HttpClient.GET(`${CUSTOMER_URL}`).then((res: Customer[]) => res.filter(({ deleted }) => !deleted)),
  createOrUpdate: ({ id, ...data }: Customer): Promise<Customer> => (id
    ? HttpClient.PATCH(`${CUSTOMER_URL}/${id}`, data)
    : HttpClient.POST(`${CUSTOMER_URL}`, data)),
  findById: (id: number): Promise<Customer> => HttpClient.GET(`${CUSTOMER_URL}/${id}`),
  findAllByNameContains: (search: string): Promise<Customer[]> => HttpClient.GET(`${CUSTOMER_URL}?search=${search}`),
  delete: (id: number): Promise<unknown> => HttpClient.DELETE(`${CUSTOMER_URL}/${id}`),
};
