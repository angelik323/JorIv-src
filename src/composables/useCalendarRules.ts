import moment from 'moment'

export const useCalendarRules = () => {
  return {
    rule_older_than: (
      date_str: string,
      min_years: number = 18,
      max_years: number = 110
    ): boolean => {
      const date = moment(date_str, 'YYYY-MM-DD')
      const minLimit = moment().subtract(min_years, 'years')
      const maxLimit = moment().subtract(max_years, 'years')

      return (
        date.isSameOrBefore(minLimit, 'day') &&
        date.isSameOrAfter(maxLimit, 'day')
      )
    },

    only_last_day_month: (date_str: string): boolean => {
      const date = moment(date_str, 'YYYY-MM-DD')
      return date.isSame(date.clone().endOf('month'), 'day')
    },

    only_until: (max_date: string) => {
      return (date_str: string) => {
        const date = moment(date_str, 'YYYY-MM-DD')
        const maxDate = moment(max_date, 'YYYY-MM-DD')
        return date.isSameOrBefore(maxDate, 'day')
      }
    },

    only_after: (min_date: string) => {
      return (date_str: string) => {
        const date = moment(date_str, 'YYYY-MM-DD')
        const maxDate = moment(min_date, 'YYYY-MM-DD')
        return date.isSameOrAfter(maxDate, 'day')
      }
    },

    only_weekdays: () => {
      return (date_str: string) => {
        const date = moment(date_str, 'YYYY-MM-DD')
        const day = date.day()
        return day !== 0 && day !== 6
      }
    },

    is_after: (start_date: string, end_date: string): boolean => {
      const a = moment(start_date, 'YYYY-MM-DD')
      const b = moment(end_date, 'YYYY-MM-DD')
      return a.isAfter(b, 'day')
    },

    is_before: (dateA: string, dateB: string): boolean => {
      const a = moment(dateA, 'YYYY-MM-DD')
      const b = moment(dateB, 'YYYY-MM-DD')
      return a.isBefore(b, 'day')
    },
  }
}
