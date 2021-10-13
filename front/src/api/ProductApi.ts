import Product from "models/Product";
import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const PRODUCT_URL = API_URL + "/products";

export const ProductApi = {
  delete: async (id: number): Promise<undefined> =>
    HttpClient.DELETE(`${PRODUCT_URL}/${id}`, {}),

  findAll: (): Promise<Product[]> =>
    HttpClient.GET<Product[]>(`${PRODUCT_URL}`),
  findAllContains: (search: string): Promise<Product[]> =>
    HttpClient.GET<Product[]>(`${PRODUCT_URL}?contains=${search}`),
  createOrUpdate: ({ id, ...product }: Partial<Product>): Promise<Product> =>
    !id
      ? HttpClient.POST(`${PRODUCT_URL}`, product)
      : HttpClient.PUT(`${PRODUCT_URL}/${id}`, product),
};
