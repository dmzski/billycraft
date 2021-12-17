import { eachMinuteOfInterval, endOfDay, startOfDay } from 'date-fns'
import { useMemo } from 'react'

type DayColumnProps = {
  date: Date
  onCellClick: (startDate: Date, endDate: Date) => () => void
}

const HourCell = ({ date, onCellClick }: DayColumnProps): JSX.Element => (
  <button
    aria-label="Add appointment"
    onDoubleClick={onCellClick(date, date)}
    type="button"
    className="w-full appearance-none h-14 flex items-center justify-center border-t border-gray-200"
  />
)

const DayColumn = ({ date, onCellClick }: DayColumnProps): JSX.Element => {
  const hoursOfDay = useMemo(
    () =>
      eachMinuteOfInterval(
        {
          start: startOfDay(date),
          end: endOfDay(date),
        },
        {
          step: 30,
        },
      ),
    [],
  )

  return (
    <section className="border-r border-b border-gray-300 w-52">
      <h2 className="text-center text-lg h-12 flex justify-center items-center">
        {date.toLocaleString(undefined, { weekday: 'long', day: 'numeric' }).toLocaleUpperCase()}
      </h2>
      {hoursOfDay.map((hour: Date) => (
        <HourCell key={`hour-${hour.getTime()}`} onCellClick={onCellClick} date={hour} />
      ))}
    </section>
  )
}

export default DayColumn
