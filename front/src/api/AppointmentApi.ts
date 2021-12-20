import Appointment, { AppointmentRequest } from 'models/Appointment'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'

export const APPOINTMENT_URL = `${API_URL}/appointments`

export const AppointmentApi = {
  delete: async (id: number): Promise<undefined> =>
    HttpClient.DELETE(`${APPOINTMENT_URL}/${id}`, {}),
  findAll: (): Promise<Appointment[]> => HttpClient.GET<Appointment[]>(`${APPOINTMENT_URL}`),
  findAllStartDateBetween: (dateA: string, dateB: string): Promise<Appointment[]> =>
    HttpClient.GET<Appointment[]>(
      `${APPOINTMENT_URL}?${new URLSearchParams({
        start_date_from: dateA,
        start_date_to: dateB,
      })}`,
    ),
  findById: (id: number): Promise<Appointment> => HttpClient.GET(`${APPOINTMENT_URL}/${id}}`),
  create: (request: AppointmentRequest): Promise<Appointment> =>
    HttpClient.POST(`${APPOINTMENT_URL}`, request),
  update: (id: number, request: AppointmentRequest): Promise<Appointment> =>
    HttpClient.PATCH(`${APPOINTMENT_URL}/${id}`, request),
}
