import { ProductGroup } from '@/models/ProductGroup'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'
import { ProductGroupCreateRequest } from '@/models/dtos/ProductGroupCreateRequest'
import { ProductGroupUpdateRequest } from '@/models/dtos/ProductGroupUpdateRequest'

export const PRODUCT_URL = `${API_URL}/product-groups`

export const ProductGroupApi = {
  delete: async (id: ProductGroup['id']) => HttpClient.DELETE(`${PRODUCT_URL}/${id}`, {}),
  findAll: () => HttpClient.GET<ProductGroup[]>(`${PRODUCT_URL}`),
  create: (data: ProductGroupCreateRequest) =>
    HttpClient.POST<ProductGroup>(`${PRODUCT_URL}`, data),
  update: ({ id, ...data }: ProductGroupUpdateRequest) =>
    HttpClient.PATCH<ProductGroup>(`${PRODUCT_URL}/${id}`, data),
}
