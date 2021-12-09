import { addMinutes, subMinutes } from 'date-fns'

export const getNormalizedDate = (date: Date): Date =>
  date.getTimezoneOffset() > 0
    ? addMinutes(date, date.getTimezoneOffset())
    : subMinutes(date, date.getTimezoneOffset())
