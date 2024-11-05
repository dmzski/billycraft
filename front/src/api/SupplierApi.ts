import Supplier, { SupplierRequest } from "@/models/Supplier";
import { API_URL } from "../constants/global";
import { HttpClient } from "./HttpClient";

export const SUPPLIER_URL = `${API_URL}/suppliers`;

export const SupplierApi = {
	delete: async (id: Supplier["id"]): Promise<undefined> =>
		HttpClient.DELETE(`${SUPPLIER_URL}/${id}`, {}),

	findAll: (): Promise<Supplier[]> =>
		HttpClient.GET<Supplier[]>(`${SUPPLIER_URL}`),
	create: (request: SupplierRequest): Promise<Supplier> =>
		HttpClient.POST(`${SUPPLIER_URL}`, request),
	update: (id: Supplier["id"], request: SupplierRequest): Promise<Supplier> =>
		HttpClient.PATCH(`${SUPPLIER_URL}/${id}`, request),
};
