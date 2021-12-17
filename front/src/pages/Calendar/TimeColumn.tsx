import { eachMinuteOfInterval, endOfToday, startOfToday } from 'date-fns'

const hours = eachMinuteOfInterval(
  {
    start: startOfToday(),
    end: endOfToday(),
  },
  {
    step: 30,
  },
)

const TimeColumn = () => (
  <div className="w-6 text-gray-400 border-r text-right pr-2 pt-12">
    {hours.map((hourDate: Date) => (
      <div
        className="relative h-14"
        key={hourDate.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })}
      >
        <span className="absolute right-0 top-0 transform -translate-y-1/2">
          {hourDate.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    ))}
  </div>
)

export default TimeColumn
