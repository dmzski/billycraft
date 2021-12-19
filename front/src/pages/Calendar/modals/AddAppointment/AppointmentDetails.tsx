import { Button, DateTimePicker, Input, Modal, Select, TextArea } from '@coco-ui/core'
import { AppointmentApi } from 'api/AppointmentApi'
import { BillApi } from 'api/BillApi'
import { CustomerApi } from 'api/CustomerApi'
import { QuoteApi } from 'api/QuoteApi'
import { UserApi } from 'api/UserApi'
import { STRINGS } from 'constants/strings'
import { formatRFC3339, isBefore } from 'date-fns'
import Appointment, { AppointmentRequest } from 'models/Appointment'
import { useToast } from 'providers/ToastProvider'
import { useCallback, useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { ROUTES } from 'routes'

type AppointmentDetailsProps = {
  appointment: Appointment
  onClose: () => void
}

type DescriptionProps = {
  label: string
  text?: string
  link?: string
}
const Description = ({ label, text, link }: DescriptionProps): JSX.Element => (
  <div className="mb-4">
    <div className="text-sm text-gray-500">{label}</div>
    {link ? (
      <Link className="text-info-700 underline" to={link}>
        {text}
      </Link>
    ) : (
      <div>{text}</div>
    )}
  </div>
)

const AppointmentDetails = ({ appointment, onClose }: AppointmentDetailsProps): JSX.Element => {
  const { data: customers } = useQuery(['customers', 'not-deleted'], CustomerApi.findAllNotDeleted)
  const { data: quotes } = useQuery('quotes', QuoteApi.findAllNotArchived)
  const { data: bills } = useQuery('bills', BillApi.findAllNotArchived)
  const { data: users } = useQuery('users', UserApi.findAll)

  return (
    <div className="py-2 flex flex-col w-full">
      <div className="mb-4 border-b-2 flex pl-2 pb-2 items-center">
        <h2 className="text-xl w-full truncate">{appointment.name}</h2>
      </div>
      <div className="ml-4">
        <Description
          label="Client"
          text={customers?.find(({ id }) => id === appointment.customerId)?.name ?? '-'}
          link={
            appointment.customerId
              ? ROUTES.CUSTOMER_FORM.path.replace(':id', appointment.customerId.toString())
              : undefined
          }
        />
        <Description label="Description" text={appointment.description} />
        <Description label="Date de début" text={appointment.startDate} />
        <Description label="Date de fin" text={appointment.endDate} />
        <Description
          label="Assigné à"
          text={
            users
              ?.filter(({ email }) => appointment.assignees.includes(email))
              .map(({ firstName, lastName }) => `${firstName} ${lastName}`)
              .join(', ') ?? '-'
          }
        />
        <Description
          label="Devis lié"
          text={quotes?.find(({ id }) => id === appointment.quoteId)?.title ?? '-'}
          link={
            appointment.quoteId
              ? ROUTES.QUOTE_FORM.path.replace(':id', appointment.quoteId)
              : undefined
          }
        />
        <Description
          label="Facture liée"
          text={bills?.find(({ id }) => id === appointment.billId)?.title ?? '-'}
          link={
            appointment.billId
              ? ROUTES.BILL_FORM.path.replace(':id', appointment.billId)
              : undefined
          }
        />
      </div>
      <div className="mt-2 mx-4">
        <div className="text-xs text-center text-gray-500">
          La date de début du rendez-vous est dépassée, vous ne pouvez plus le modifier.
        </div>
        <Button className="w-full" variant="primary" onClick={onClose} type="button">
          Fermer
        </Button>
      </div>
    </div>
  )
}

export default AppointmentDetails
