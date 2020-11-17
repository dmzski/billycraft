import { addMinutes, subMinutes } from "date-fns";

export const getNormalizedDate = (date: Date) => {
  return date.getTimezoneOffset() > 0 ? addMinutes(date, date.getTimezoneOffset()) : subMinutes(date, date.getTimezoneOffset());
};
