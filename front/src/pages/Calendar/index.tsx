import { Button, Grid } from '@coco-ui/core'
import { eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns'
import Appointment from 'models/Appointment'
import { useCallback, useMemo, useState } from 'react'
import DayColumn from './DayColumn'
import AddAppointment from './modals/AddAppointment'
import TimeColumn from './TimeColumn'

const Calendar = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined)
  const [date, setDate] = useState(new Date())

  const datesOfWeek = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      }),
    [date],
  )

  const handleClick = useCallback(() => setSelectedAppointment({} as Appointment), [])
  const handleCellClick = useCallback(
    (startDate: Date, endDate: Date) => () =>
      setSelectedAppointment({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        name: '',
      }),
    [],
  )
  return (
    <div className="flex-col flex flex-grow">
      <div className="flex justify-between">
        <h1 className="text-2xl flex-grow">Calendrier</h1>
        <Button onClick={handleClick}>Ajouter un rendez-vous</Button>
      </div>
      <div className="flex mt-8">
        <TimeColumn />
        <Grid gap={0} cols={7} className="flex-grow">
          {datesOfWeek.map(dateOfWeek => (
            <DayColumn onCellClick={handleCellClick} key={dateOfWeek.getTime()} date={dateOfWeek} />
          ))}
        </Grid>
      </div>
      <AddAppointment
        appointment={selectedAppointment ?? ({} as Appointment)}
        isOpen={selectedAppointment !== undefined}
        onClose={() => setSelectedAppointment(undefined)}
      />
    </div>
  )
}

export default Calendar
