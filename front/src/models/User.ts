import { RoleName } from './dtos/Role'

export type User = {
  email: string
  firstName: string
  lastName: string
  companyId?: string
  role: RoleName
}
