import { API_URL } from '@/constants/global'
import BillEmailCustomization from '@/models/BillEmailCustomization'
import { HttpClient } from './HttpClient'

export const BILL_EMAIL_CUSTOMIZATION_URL = `${API_URL}/bill-email-customization`

export const BillEmailCustomizationApi = {
  findMine: (): Promise<BillEmailCustomization> =>
    HttpClient.GET(`${BILL_EMAIL_CUSTOMIZATION_URL}/mine`),
  updateMine: (customization: BillEmailCustomization): Promise<BillEmailCustomization> =>
    customization.id
      ? HttpClient.PATCH(`${BILL_EMAIL_CUSTOMIZATION_URL}/${customization.id}`, customization)
      : HttpClient.POST(`${BILL_EMAIL_CUSTOMIZATION_URL}`, customization),
}
