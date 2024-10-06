import Product from '@/models/Product'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'
import { ProductCreateRequest } from '@/models/dtos/ProductCreateRequest'
import { ProductUpdateRequest } from '@/models/dtos/ProductUpdateRequest'
import { ProductUpdateStocksRequest } from '@/models/dtos/ProductUpdateStocksRequest'

export const PRODUCT_URL = `${API_URL}/products`

export const ProductApi = {
  delete: async (id: Product['id']) => HttpClient.DELETE(`${PRODUCT_URL}/${id}`, {}),
  findAll: () => HttpClient.GET<Product[]>(`${PRODUCT_URL}`),
  findAllContains: (search: string) =>
    HttpClient.GET<Product[] | undefined>(`${PRODUCT_URL}?contains=${search}`),
  create: (data: ProductCreateRequest) => HttpClient.POST<Product>(`${PRODUCT_URL}`, data),
  update: ({ id, ...data }: ProductUpdateRequest) =>
    HttpClient.PATCH<Product>(`${PRODUCT_URL}/${id}`, data),
  updateStocks: (data: ProductUpdateStocksRequest) =>
    HttpClient.POST(`${PRODUCT_URL}/update-stocks`, data),
}
