import { Company } from "@/models/Company"
import { createContext } from "react"

type OrganizationContextValue = {
  organization: Company
}
const OrganizationContext = createContext({})
export const OrganizationProvider = () => {
  return null

}
