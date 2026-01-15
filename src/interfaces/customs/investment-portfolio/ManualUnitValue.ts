export interface IManualUnitValueForm {
  id?: number | null
  emitter_id?: number | null
  description?: string
  participation_description?: string | null
  action_type?: string
  start_date?: string
  end_date?: string
  has_participations?: boolean
  has_actions?: boolean
  unit_value?: number | null
  created_at?: string
  creator_data?: string
  updated_at?: string
  updated_by_user?: string
  document_third?: string
  radio?: boolean | undefined
}
