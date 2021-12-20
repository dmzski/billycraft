import Outgoing, { OutgoingRequest } from 'models/Outgoing'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'

export const OUTGOING_URL = `${API_URL}/outgoings`

export const OutgoingApi = {
  delete: async (id: number): Promise<undefined> => HttpClient.DELETE(`${OUTGOING_URL}/${id}`, {}),

  findAll: (): Promise<Outgoing[]> => HttpClient.GET<Outgoing[]>(`${OUTGOING_URL}`),
  create: (request: OutgoingRequest): Promise<Outgoing> =>
    HttpClient.POST(`${OUTGOING_URL}`, request),
  update: (id: number, request: OutgoingRequest): Promise<Outgoing> =>
    HttpClient.PATCH(`${OUTGOING_URL}/${id}`, request),
}
