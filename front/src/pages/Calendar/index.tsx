import { Button, Grid, Icon } from '@coco-ui/core'
import { addWeeks, eachDayOfInterval, endOfWeek, startOfWeek, subWeeks } from 'date-fns'
import Appointment from 'models/Appointment'
import { useCallback, useMemo, useState } from 'react'
import DayColumn from './DayColumn'
import AddAppointment from './modals/AddAppointment'
import TimeColumn from './TimeColumn'

const Calendar = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Partial<Appointment> | undefined>(
    undefined,
  )
  const [date, setDate] = useState(new Date())

  const startOfWeekDate = useMemo(() => startOfWeek(date, { weekStartsOn: 1 }), [date])
  const endOfWeekDate = useMemo(() => endOfWeek(date, { weekStartsOn: 1 }), [date])

  const datesOfWeek = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeekDate,
        end: endOfWeekDate,
      }),
    [startOfWeekDate, endOfWeekDate],
  )

  const handleClick = useCallback(() => setSelectedAppointment({} as Partial<Appointment>), [])
  const handleCellClick = useCallback(
    (startDate: Date, endDate: Date) => () =>
      setSelectedAppointment({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        name: '',
      }),
    [],
  )

  const goPreviousWeek = useCallback(() => {
    setDate(current => subWeeks(current, 1))
  }, [])

  const goNextWeek = useCallback(() => {
    setDate(current => addWeeks(current, 1))
  }, [])

  const goToday = useCallback(() => {
    setDate(new Date())
  }, [])

  return (
    <div className="flex-col flex flex-grow">
      <div className="flex justify-between">
        <h1 className="text-3xl flex-grow">Calendrier</h1>
        <Button onClick={handleClick}>Ajouter un rendez-vous</Button>
      </div>
      <Grid cols={3} className="my-4">
        <div className="flex items-center">
          <Button onClick={goPreviousWeek} variant="transparent">
            <Icon name="arrow-left" />
          </Button>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-center text-xl mb-2">{`${startOfWeekDate.toLocaleDateString(
            undefined,
            {
              day: '2-digit',
              year: 'numeric',
              month: '2-digit',
            },
          )}-${endOfWeekDate.toLocaleDateString(undefined, {
            day: '2-digit',
            year: 'numeric',
            month: '2-digit',
          })}`}</div>
          <Button size="xs" variant="secondary" onClick={goToday}>
            Aujourd&apos;hui
          </Button>
        </div>
        <div className="flex justify-end items-center">
          <Button onClick={goNextWeek} variant="transparent">
            <Icon name="arrow-right" />
          </Button>
        </div>
      </Grid>
      <div className="flex mt-8">
        <TimeColumn />
        <Grid gap={0} cols={7} className="flex-grow">
          {datesOfWeek.map(dateOfWeek => (
            <DayColumn onCellClick={handleCellClick} key={dateOfWeek.getTime()} date={dateOfWeek} />
          ))}
        </Grid>
      </div>
      <AddAppointment
        appointment={selectedAppointment ?? ({} as Partial<Appointment>)}
        isOpen={selectedAppointment !== undefined}
        onClose={() => setSelectedAppointment(undefined)}
      />
    </div>
  )
}

export default Calendar
