export interface IOperatingOfficeExtended {
  id: number
  regional_code: string
  regional_description: string
  web: boolean
  status_id: number
  offices: IOperatingOfficeChildExtended[]
  created_at?: string
  updated_at?: string
}

export interface IOperatingOfficeChildExtended {
  id?: number
  office_code: string
  office_description: string
  office_schedule_start: string
  office_schedule_end: string
  extended_schedule_start: string
  extended_schedule_end: string
  status_id: number
  created_at?: string
  updated_at?: string
}
