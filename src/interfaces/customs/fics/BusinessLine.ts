export interface IBusinessLine {
  code: string
  description: string
  type: number
  status_id?: number
  initial_status_id?: number
  cancellation_reason?: string
  consolidated_participation_type?: boolean | null

}

export interface IBusinessLineItem {
  id: number
  code: string
  description: string
  type: number
  status_id?: number
  initial_status_id?: number
  cancellation_reason?: string
}

export type BusinessLineType = 'business_lines' | 'participation_types'
