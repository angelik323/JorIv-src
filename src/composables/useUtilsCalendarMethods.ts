import { HOLIDAYS } from '@/constants/calendars'
import moment from 'moment'

export const useUtilsCalendarMethods = () => {
  const options_calendar_date_less_than_or_equal_to_the_current_date = (
    date: string
  ) => date <= moment().format('YYYY/MM/DD')

  /**
   * Valida si una fecha es día hábil (no festivo ni fin de semana)
   * @param date - Fecha a validar
   * @returns boolean
   */
  const isBusinessDay = (date: string | null): boolean => {
    if (!date) return false

    const selectedDate = moment(date)
    const isWeekday = selectedDate.isoWeekday() <= 5
    const dateISO = selectedDate.format('YYYY-MM-DD')
    const isHoliday = HOLIDAYS.includes(dateISO)

    return isWeekday && !isHoliday
  }

  const addDays = (
    dateStr: string,
    days: number,
    type: moment.unitOfTime.DurationConstructor = 'days'
  ): string => {
    const date = moment(dateStr, 'YYYY-MM-DD')
    return date.add(days, type).format('YYYY-MM-DD')
  }

  return {
    options_calendar_date_less_than_or_equal_to_the_current_date,
    isBusinessDay,
    addDays,
  }
}
