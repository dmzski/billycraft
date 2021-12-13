type Appointment = {
  id?: number
  startDate?: string
  endDate?: string
  description?: string
  quoteId?: string
  billId?: string
  assignees?: string[]
  createdBy?: string
  customerId?: number
  doneBy?: string
  done?: boolean
  name: string
}

export default Appointment
