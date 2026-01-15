import { IGenericResource } from './Common'

export interface IFinancialObligationResource extends IGenericResource {
  id: number
  business_trust_id: number
  obligation_number: string | null
  amount: string | null
  interest_rate: string | null
  periodicity_type: string | null
  quotas: number | null
}

export interface IPaymentPlanQuotasResource extends IGenericResource {
  financial_obligation_id: number
  number_quota: number
  initial_balance: string
  interest_quota: string
  capital_quota: string
  total_quota: string
  final_balance: string
  payment_date: string
  status_quota_id: number
  status_quota: {
    id: number
    name: string
  }
}
