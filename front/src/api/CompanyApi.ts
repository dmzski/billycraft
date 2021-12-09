import Company from 'models/Company'
import { API_URL } from '../constants/global'
import { HttpClient } from './HttpClient'

export const COMPANY_URL = `${API_URL}/company`

export const CompanyApi = {
  uploadLogo: (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('logo', file)
    return fetch(`${COMPANY_URL}/upload-logo`, {
      method: 'POST',
      body: formData,
    })
      .then((res: Response) =>
        res.status === 200 ? res.text() : Promise.reject(new Error('Error when uploading file')),
      )
      .then((url: string) => url)
  },
  getMine: (): Promise<Company> => HttpClient.GET(`${COMPANY_URL}/mine`),
  updateMine: (company: Partial<Company>): Promise<Company> =>
    HttpClient.PATCH(`${COMPANY_URL}/mine`, company),
  createOrUpdate: ({ id, ...company }: Company): Promise<Company> =>
    !id
      ? HttpClient.POST(`${COMPANY_URL}`, company)
      : HttpClient.PATCH(`${COMPANY_URL}/mine`, company),
}
