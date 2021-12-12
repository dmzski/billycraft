type Appointment = {
  id?: number
  startDate?: string
  endDate?: string
  description?: string
  quoteId?: string
  billId?: string
  assignee?: string
  createdBy?: string
  doneBy?: string
  done?: boolean
  name: string
}

export default Appointment
