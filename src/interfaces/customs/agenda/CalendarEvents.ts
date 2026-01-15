import { Moment } from 'moment'

export interface IOffDays {
  day: number
  isHoliday: boolean
  isMarkedDay: boolean
  markingReason: string
}

export type ICalendarFilters = Record<
  string,
  string | number | boolean | undefined
>

export interface ICalendarDay {
  date: Moment
  dateStr: string
}

export interface IFormInformation {
  id?: number
  title: string
  description: string
  start_date: string
  start_time: string
  end_date: string
  end_time: string
  repeat: string
  required_confirm: boolean
}

export interface IFormNotification {
  users: { id: number; name: string }[]
  roles: { id: number; name: string }[]
  business: { id: number; name: string }[]
  emails: string[]
}

export interface ICalendarEvent {
  id?: number
  title: string
  description?: string
  start_date: string
  end_date: string
  repeat: string
  required_confirm?: boolean
  notifications: {
    users?: number[]
    roles?: number[]
    business?: number[]
    emails?: string[]
  }
  confirmations?: {
    users?: number[]
    roles?: number[]
    business?: number[]
    emails?: string[]
  }
  type?: string
}

export interface ICalendarEventResponse extends ICalendarEvent {
  created_at?: string
  updated_at?: string
  created_by?: number
  updated_by?: number
  status_id?: number
}

export interface ICalendarEventView {
  id?: number
  title: string
  description: string
  start_date: string
  end_date: string
  repeat: string
  required_confirm: boolean
  status_id?: number
  notifications: IFormNotification
  confirmations?: IFormNotification
}

export interface ICalendarAgendaItem {
  countEvents: number
  isMarkedDay: boolean
  isHoliday: boolean
}

export interface IDailyAgenda {
  visualization_type: 'daily'
  month: number
  year: number
  days: Record<string, Array<ICalendarEvent>>
}

export interface IWeeklyAgenda {
  visualization_type: 'weekly'
  month: number
  year: number
  week: Record<string, Record<string, Array<ICalendarEvent>>>
}

export interface IMonthlyYearlyAgenda {
  month: {}
  visualization_type: 'monthly' | 'yearly'
  year: number
  events: Record<
    string,
    Record<
      string,
      {
        countEvents: number
        isMarkedDay: boolean
        isHoliday: boolean
      }
    >
  >
}

export type ICalendarAgenda =
  | IDailyAgenda
  | IWeeklyAgenda
  | IMonthlyYearlyAgenda

export interface IMarkedDay {
  is_holyday?: boolean
  marked_day: string
  marking_reason?: string
  id?: number | null
}
