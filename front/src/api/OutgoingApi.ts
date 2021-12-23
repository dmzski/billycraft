import { OutgoingRequest, OutgoingResponse } from 'models/Outgoing'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'

export const OUTGOING_URL = `${API_URL}/outgoings`

export const OutgoingApi = {
  delete: async (id: string): Promise<undefined> => HttpClient.DELETE(`${OUTGOING_URL}/${id}`, {}),

  findAll: (): Promise<OutgoingResponse[]> => HttpClient.GET(`${OUTGOING_URL}`),
  findCurrent: (): Promise<OutgoingResponse> => HttpClient.GET(`${OUTGOING_URL}/current`),
  create: (request: OutgoingRequest): Promise<OutgoingResponse> =>
    HttpClient.POST(`${OUTGOING_URL}`, request),
  update: (id: string, request: OutgoingRequest): Promise<OutgoingResponse> =>
    HttpClient.PATCH(`${OUTGOING_URL}/${id}`, request),
}
