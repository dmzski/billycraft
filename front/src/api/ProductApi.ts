import Product from '@/models/Product'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'

export const PRODUCT_URL = `${API_URL}/products`

export const ProductApi = {
  delete: async (id: Product['id']) => HttpClient.DELETE(`${PRODUCT_URL}/${id}`, {}),

  findAll: () => HttpClient.GET<Product[]>(`${PRODUCT_URL}`),
  findAllContains: (search: string) => HttpClient.GET<Product[] | undefined>(`${PRODUCT_URL}?contains=${search}`),
  createOrUpdate: ({ id, ...product }: Partial<Product>): Promise<Product | undefined> =>
    !id
      ? HttpClient.POST(`${PRODUCT_URL}`, product)
      : HttpClient.PATCH(`${PRODUCT_URL}/${id}`, product),
}
