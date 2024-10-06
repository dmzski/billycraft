import {
  AcceptInvitationRequest,
  DeleteInvitationRequest,
  InvitationFindAllParams,
  InvitationRequest,
  InvitationResponse,
  MyInvitationResponse,
} from '@/models/dtos/Invitation'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'

const BASE_URL = `${API_URL}/invitations`

export const InvitationApi = {
  findMinePending: async (): Promise<MyInvitationResponse[]> =>
    HttpClient.GET(`${BASE_URL}/mine/pending`),
  findAll: async (params?: InvitationFindAllParams) =>
    HttpClient.GET<InvitationResponse[]>(
      `${BASE_URL}/${params ? `?${new URLSearchParams(params).toString()}` : ''}`,
    ),
  accept: async (params: AcceptInvitationRequest) => HttpClient.POST(`${BASE_URL}/accept`, params),
  refuse: async (params: AcceptInvitationRequest) => HttpClient.POST(`${BASE_URL}/refuse`, params),
  delete: async (params: DeleteInvitationRequest) => HttpClient.DELETE(`${BASE_URL}/`, params),
  create: async (params: InvitationRequest) => HttpClient.POST(`${BASE_URL}/`, params),
}
