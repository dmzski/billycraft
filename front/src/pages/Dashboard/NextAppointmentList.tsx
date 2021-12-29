import { Icon, Loader } from '@coco-ui/core'
import { AppointmentApi } from 'api/AppointmentApi'
// eslint-disable-next-line import/no-duplicates
import { addDays, formatRelative, formatRFC3339, parseJSON } from 'date-fns'
// eslint-disable-next-line import/no-duplicates
import fr from 'date-fns/locale/fr'
import { useQuery } from 'react-query'

const NextAppointmentList = () => {
  const { data: appointments, isLoading } = useQuery(['appointments', 'dashboard'], () =>
    AppointmentApi.findAllStartDateBetween(
      formatRFC3339(Date.now()),
      formatRFC3339(addDays(Date.now(), 4)),
    ),
  )

  return (
    <div>
      <div className="md:pl-2 text-xl mb-2 flex">
        <Icon name="calendar" className="mr-2" />
        <h2>
          Prochains rendez-vous <span className="text-xs text-gray-600">(3 prochains jours)</span>
        </h2>
      </div>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : null}
      {!isLoading && appointments && appointments.length === 0 ? (
        <div className="text-center">Aucun rendez-vous</div>
      ) : null}
      {!isLoading && appointments && appointments.length > 0 ? (
        <div className="md:pl-4 flex flex-col">
          <div className="grid grid-cols-3 px-2">
            <div>Début</div>
            <div>Assigné à</div>
            <div>Titre</div>
          </div>
          {appointments.map(appointment => (
            <div className="shadow grid grid-cols-3 my-2 p-2" key={appointment.id}>
              <div>
                {formatRelative(parseJSON(appointment.startDate), Date.now(), {
                  weekStartsOn: 1,
                  locale: fr,
                })}
              </div>
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
