export interface NotificationListProps {
  open: boolean
}

export interface INotificationList {
  id: number
  title: string
  description: string
  start_date: string
  end_date?: string
  repeat?: string
  status_id: number
  is_confirm_required?: boolean
}

export interface INotificationsList {
  id: number
  description: string
  source_module: string
  date: string
  status: string
  status_id: number
}
