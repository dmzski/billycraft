import clsx from 'clsx'
import { useCallback, useMemo } from 'react'

type HourButtonProps = {
  selected?: Date
  hour: number
  onHourClick?: (hour: number) => void
}

const HourButton = ({
  selected,
  hour,
  onHourClick,
}: HourButtonProps) => {
  const isSelected = useMemo(
    () => selected?.getHours() === hour,
    [selected, hour]
  )

  return (
    <button
      type="button"
      onClick={() => onHourClick?.(hour)}
      className={clsx('py-2 w-full outline-none focus:bg-primary focus:text-primary-content', {
        ['bg-primary text-primary-content']: isSelected,
        ['hover:bg-primary hover:text-primary-content']: true,
      })}
    >
      {`${hour}`.padStart(2, '0')}
    </button>
  )
}

type MinuteButtonProps = {
  selected?: Date
  minute: number
  onMinuteClick?: (minute: number) => void
}

const MinuteButton = ({
  selected,
  minute,
  onMinuteClick,
}: MinuteButtonProps) => {
  const isSelected = useMemo(
    () => selected?.getMinutes() === minute,
    [selected, minute]
  )

  return (
    <button
      type="button"
      onClick={() => onMinuteClick?.(minute)}
      className={clsx('py-2 w-full outline-none focus:bg-primary focus:text-primary-content', {
        ['bg-primary text-primary-content']: isSelected,
        ['hover:bg-primary hover:text-primary-content']: true,
      })}
    >
      {`${minute}`.padStart(2, '0')}
    </button>
  )
}

type TimeCalendarProps = {
  selected?: Date
  onTimeClick: (hours: number, minutes: number) => void
}
const TimeCalendar = ({
  selected,
  onTimeClick,
}: TimeCalendarProps) => {
  const options = useMemo(
    () => ({
      hours: Array.from({ length: 24 }, (_, index) => index),
      minutes: [0, 30],
    }),
    []
  )

  const handleHourClick = useCallback(
    (hour: number) => {
      onTimeClick(hour, selected?.getMinutes() ?? 0)
    },
    [onTimeClick, selected]
  )

  const handleMinuteClick = useCallback(
    (minute: number) => {
      onTimeClick(selected?.getHours() ?? 0, minute)
    },
    [onTimeClick, selected]
  )

  return (
    <div className="w-40 overflow-hidden">
      <div className="h-12 bg-primary-700"></div>
      <div className="grid grid-cols-2 pt-2 border">
        <div className="flex flex-col items-center h-60">
          <div className="text-gray-500 mb-2">Heures</div>
          <div className="text-sm flex flex-col items-center overflow-y-auto w-20 max-h-56">
            {options.hours.map((hour) => (
              <HourButton
                hour={hour}
                selected={selected}
                key={`hour-${hour}`}
                onHourClick={handleHourClick}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center border-l">
          <div className="text-gray-500 mb-2">Minutes</div>
          <div className="text-sm flex flex-col items-center overflow-y-scroll w-20 max-h-60">
            {options.minutes.map((minute) => (
              <MinuteButton
                minute={minute}
                selected={selected}
                key={`minute-${minute}`}
                onMinuteClick={handleMinuteClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeCalendar
