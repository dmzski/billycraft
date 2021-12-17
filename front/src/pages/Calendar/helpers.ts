import { eachMinuteOfInterval, endOfDay, startOfDay } from 'date-fns'

export const hoursOfDay = eachMinuteOfInterval(
  {
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  },
  {
    step: 30,
  },
)
