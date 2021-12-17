import { Button, Grid, Icon } from '@coco-ui/core'
import { AppointmentApi } from 'api/AppointmentApi'
import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  formatRFC3339,
  isAfter,
  isBefore,
  isEqual,
  parseJSON,
  startOfWeek,
  subWeeks,
} from 'date-fns'
import Appointment from 'models/Appointment'
import { useCallback, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import AppointmentCell from './AppointmentCalendar'
import DayColumn from './DayColumn'
import AddAppointment from './modals/AddAppointment'
import TimeColumn from './TimeColumn'

const Calendar = () => {
  const { isLoading, data, refetch } = useQuery(`appointments`, AppointmentApi.findAll)
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
        startDate: formatRFC3339(startDate),
        endDate: formatRFC3339(endDate),
        name: '',
      }),
    [],
  )

  const onSubmitSuccess = useCallback(() => {
    refetch()
  }, [refetch])

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
      <div className="relative flex mt-8">
        <TimeColumn />
        <div className="absolute top-12 left-6 right-0 bottom-0 overflow-y-hidden container">
          {data
            ?.filter(({ startDate }) => {
              const parsedDate = parseJSON(startDate)
              return (
                (isAfter(parsedDate, startOfWeekDate) && isBefore(parsedDate, endOfWeekDate)) ||
                isEqual(parsedDate, startOfWeekDate) ||
                isEqual(parsedDate, endOfWeekDate)
              )
            })
            .map((appointment: Appointment) => (
              <AppointmentCell
                onAppointmentClick={value => setSelectedAppointment(value)}
                key={`appointment-${appointment.id}`}
                appointment={appointment}
                appointments={data}
              />
            ))}
        </div>
        <Grid gap={0} cols={7} className="absolute top-0 left-6 right-0 container">
          {datesOfWeek.map(dateOfWeek => (
            <DayColumn onCellClick={handleCellClick} key={dateOfWeek.getTime()} date={dateOfWeek} />
          ))}
        </Grid>
      </div>
      <AddAppointment
        onSubmitSuccess={onSubmitSuccess}
        appointment={selectedAppointment ?? ({} as Partial<Appointment>)}
        isOpen={selectedAppointment !== undefined}
        onClose={() => setSelectedAppointment(undefined)}
      />
    </div>
  )
}

export default Calendar
