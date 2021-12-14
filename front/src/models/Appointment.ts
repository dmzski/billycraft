type Appointment = {
  id: number
  name: string
  description?: string
  createdAt: string
  startDate: string
  endDate: string
  updatedAt: string
  doneAt?: string
  customerId?: number
  billId?: string
  quoteId?: string
  assignees: string[]
  createdBy: string
  doneBy?: string
}

export type AppointmentRequest = {
  name: string
  description?: string
  startDate: string
  endDate: string
  customerId?: number
  billId?: string
  quoteId?: string
  assignees: string[]
  doneBy?: string
}

export default Appointment
