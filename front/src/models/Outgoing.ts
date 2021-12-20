export type OutgoingRequest = {
  color?: string
  name: string
}

type Outgoing = {
  id: number
  name: string
  color?: string
  createdBy: string
  companyId: number
}

export default Outgoing
