import {
  differenceInMinutes,
  eachMinuteOfInterval,
  endOfDay,
  isEqual,
  parseJSON,
  startOfDay,
} from 'date-fns'
import Appointment from 'models/Appointment'
import { MouseEvent, useCallback, useMemo, useRef } from 'react'

type AppointmentCellProps = {
  appointment: Appointment
  appointments: Appointment[]
  onAppointmentClick: (appointment: Appointment) => void
}

const BASE_APPOINTMENTS_CLASS =
  'absolute rounded p-2 appearance-none flex overflow-ellipsis truncate text-left overflow-y-hidden mt-12 ml-6'
const AppointmentClassNames = [
  `${BASE_APPOINTMENTS_CLASS} border-l-4 border-primary-700 text-primary-700 bg-primary-100 focus:bg-primary-200`,
  `${BASE_APPOINTMENTS_CLASS} border-l-4 border-error-700 text-error-700 bg-error-100 focus:bg-error-200`,
  `${BASE_APPOINTMENTS_CLASS} border-l-4 border-success-700 text-success-700 bg-success-100 focus:bg-success-200`,
  `${BASE_APPOINTMENTS_CLASS} border-l-4 border-info-700 text-info-700 bg-info-100 focus:bg-info-200`,
  `${BASE_APPOINTMENTS_CLASS} border-l-4 border-warning-700 text-warning-700 bg-warning-100 focus:bg-warning-200`,
]

const BASE_REM_CELL_WIDTH = 13
const BASE_REM_CELL_HEIGHT = 3.5

const AppointmentCell = ({
  appointment,
  onAppointmentClick,
  appointments,
}: AppointmentCellProps): JSX.Element => {
  const ref = useRef<HTMLButtonElement>(null)
  const startDate = useMemo(() => parseJSON(appointment.startDate), [appointment])
  const endDate = useMemo(() => parseJSON(appointment.endDate), [appointment])
  const endOfAppointmentDay = useMemo(() => endOfDay(startDate), [startDate])

  const hoursOfDay = useMemo(
    () =>
      eachMinuteOfInterval(
        {
          start: startOfDay(startDate),
          end: endOfDay(startDate),
        },
        {
          step: 30,
        },
      ),
    [startDate],
  )

  const numberOfMinutes = useMemo(() => Math.abs(differenceInMinutes(startDate, endDate)) / 30, [
    startDate,
    endDate,
  ])

  const concurrentDates = useMemo(
    () =>
      appointments?.filter(anotherAppointment =>
        isEqual(startDate, new Date(anotherAppointment.startDate)),
      ) ?? [],
    [startDate, appointments],
  )

  const cellWidth = useMemo(
    () =>
      concurrentDates.length > 0
        ? BASE_REM_CELL_WIDTH / concurrentDates.length
        : BASE_REM_CELL_WIDTH,
    [concurrentDates],
  )
  const zIndex = useMemo(() => Math.abs(startDate.getHours() + startDate.getMinutes()) + 10, [
    startDate,
  ])

  const left = useMemo(
    () =>
      BASE_REM_CELL_WIDTH * (startDate.getDay() !== 0 ? startDate.getDay() - 1 : 6) +
      (concurrentDates.length > 0
        ? cellWidth * concurrentDates.findIndex(same => same === appointment)
        : 0),
    [cellWidth, appointment, startDate],
  )

  const top = useMemo(
    () =>
      BASE_REM_CELL_HEIGHT *
      hoursOfDay.findIndex(
        hour =>
          hour.getHours() === startDate.getHours() && hour.getMinutes() === startDate.getMinutes(),
      ),
    [startDate],
  )

  const handleBlur = useCallback(() => {
    if (ref.current) ref.current.style.zIndex = `${zIndex}`
  }, [zIndex])

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      if (ref.current)
        ref.current.style.zIndex = `${
          Math.abs(endOfAppointmentDay.getHours() + endOfAppointmentDay.getMinutes()) + 11
        }`
    },
    [appointment, endOfAppointmentDay],
  )

  return (
    <button
      ref={ref}
      key={appointment.id}
      onMouseDown={handleMouseDown}
      onTouchEnd={() => onAppointmentClick(appointment)}
      onDoubleClick={() => onAppointmentClick(appointment)}
      onBlur={handleBlur}
      type="button"
      className={`${AppointmentClassNames[appointment.id % AppointmentClassNames.length]}`}
      style={{
        left: `${left}rem`,
        top: `${top}rem`,
        height: `${3.5 * numberOfMinutes}rem`,
        width: `${cellWidth}rem`,
        zIndex,
      }}
    >
      <div className="w-full">
        <div className="overflow-ellipsis font-bold text-xs w-full">{appointment.name}</div>
        <div className="text-gray-700 w-full text-xs overflow-hidden overflow-ellipsis">
          {appointment.assignees.join(', ')}
        </div>
        <p className="text-xs mb-1 overflow-hidden overflow-ellipsis w-full whitespace-pre-line">
          {appointment.description}
        </p>
      </div>
    </button>
  )
}

export default AppointmentCell
