import { Loader } from '@coco-ui/core'
import { AppointmentApi } from 'api/AppointmentApi'
import { addDays, formatISO9075, formatRFC3339, parseJSON } from 'date-fns'
import React, { Fragment } from 'react'
import { useQuery } from 'react-query'

const NextAppointmentList = () => {
  const { data: appointments, isLoading } = useQuery('appointment-dashboard', () =>
    AppointmentApi.findAllStartDateBetween(
      formatRFC3339(Date.now()),
      formatRFC3339(addDays(Date.now(), 3)),
    ),
  )

  return (
    <div>
      <h2 className="text-xl mb-2">Prochains rendez-vous (3 prochains jours)</h2>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : null}
      {!isLoading && appointments ? (
        <div className="flex flex-col">
          <div className="grid grid-cols-3 px-2">
            <div>Début</div>
            <div>Assigné à</div>
            <div>Titre</div>
          </div>
          {appointments.map(appointment => (
            <div className="shadow grid grid-cols-3 my-2 p-2" key={appointment.id}>
              <div>{formatISO9075(parseJSON(appointment.startDate))}</div>
              <div>
                {appointment.assignees.map(email => (
                  <p>{email}</p>
                ))}
              </div>
              <div>{appointment.name}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default NextAppointmentList
