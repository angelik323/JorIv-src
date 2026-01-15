export interface IPortfolioClassificationResponse {
  id: number
  type: string
  days_start: number
  days_end: number
  credit_bureau: number
}

export interface IPortfolioClassificationList {
  id: number
  type: string
  days_start: number
  days_end: number
  credit_bureau: number
  comission_settlement_statuses_id: number
  status_id?: number | null
}

export interface IPortfolioClassificationForm {
  type: string | null
  days_start: number | null
  days_end: number | null
}
