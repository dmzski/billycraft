import { API_URL } from '@/constants/global'
import { User } from '@/models/User'
import { HttpClient } from './HttpClient'
import { RemoveUserRequest } from '@/models/dtos/User'

export const USER_URL = `${API_URL}/users`

export const UserApi = {
  getMyInformation: (): Promise<User> => HttpClient.GET(`${USER_URL}/me`),
  findAll: (): Promise<User[]> => HttpClient.GET(`${USER_URL}`),
  removeUser: (params: RemoveUserRequest) => HttpClient.DELETE(`${USER_URL}/remove-user`, params)
}
