import { API_URL } from 'constants/global'
import User from 'models/User'
import { HttpClient } from './HttpClient'

export const USER_URL = `${API_URL}/users`

export const UserApi = {
  getMyInformation: (): Promise<User> => HttpClient.GET(`${USER_URL}/me`),
}
