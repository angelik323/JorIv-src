export interface IConfigCalendarRequest {
  id?: number
  marked_day: string
  marking_reason: string
  created_by?: number
  updated_by?: number
  status_id?: number
  created_at?: string
  updated_at?: string
}

export interface IConfigCalendarData {
  id?: number
  marked_day: string
  marking_reason: string
  is_holyday?: boolean
}
