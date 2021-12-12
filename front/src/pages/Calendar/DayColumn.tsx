import { eachMinuteOfInterval, endOfDay, startOfDay } from 'date-fns'
import { useMemo } from 'react'

type DayColumnProps = {
  date: Date
  onCellClick: (startDate: Date, endDate: Date) => () => void
}
const DayColumn = ({ date, onCellClick }: DayColumnProps): JSX.Element => {
  const hours = useMemo(
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
    [date],
  )

  return (
    <section className="border-r border-b border-gray-300">
      <h2 className="text-center text-lg h-12 flex justify-center items-center">
        {date.toLocaleString(undefined, { weekday: 'long' }).toLocaleUpperCase()}
      </h2>
      <div className="flex-col">
        {hours.map((hour: Date) => (
          <button
            onClick={onCellClick(hour, hour)}
            type="button"
            className="w-full appearance-none h-14 flex items-center justify-center border-t border-gray-200"
          >
            -
          </button>
        ))}
      </div>
    </section>
  )
}

export default DayColumn
