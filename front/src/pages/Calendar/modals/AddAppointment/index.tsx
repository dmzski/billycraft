import { Modal } from '@coco-ui/core'
import { isAfter, parseJSON } from 'date-fns'
import Appointment from 'models/Appointment'
import AppointmentDetails from './AppointmentDetails'
import AppointmentForm from './AppointmentForm'

type AddAppointmentProps = {
  appointment: Partial<Appointment>
  isOpen?: boolean
  onClose: () => void
  onSubmitSuccess?: (data: Appointment) => void | Promise<void>
}

const AddAppointment = ({
  appointment,
  isOpen,
  onClose,
  onSubmitSuccess,
}: AddAppointmentProps): JSX.Element => (
  <Modal onClose={onClose} open={isOpen}>
    {appointment.id &&
    appointment.startDate &&
    isAfter(new Date(), parseJSON(appointment.startDate)) ? (
      <AppointmentDetails appointment={appointment as Appointment} onClose={onClose} />
    ) : (
      <AppointmentForm
        appointment={appointment}
        onClose={onClose}
        onSubmitSuccess={onSubmitSuccess}
      />
    )}
  </Modal>
)

export default AddAppointment
