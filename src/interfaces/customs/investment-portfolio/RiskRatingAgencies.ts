export interface IRiskRatingAgencies {
  id: number
  code: number
  description: string
  guy: string
  history_risk_rating_agencie?: IHistoryRiskRatingAgencies
}

export interface IHistoryRiskRatingAgencies {
  created_at: string
  creator_data: string
  updated_at: string
  update_data: string
}
