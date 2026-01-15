import { IFileField } from '@/interfaces/global'

export type IFinancialPlanType =
  | 'financial-plan/create'
  | 'financial-plan/update'
  | 'financial-plan/add'
  | 'financial-plan/default'
export type IFinancialAlias = string | number | null

export interface IObligationsOptions {
  label: string
  value: number
  payload: {
    financialObligationNumber: string
    creditAmount: number
    paymentQuotas: number
    loanRate: string
    documentFile: boolean
    financialPlanning: boolean
  }
}

export interface IAmortizationList {
  businessName: string | null
  businessId: number | null
  businessCode: string | null
  options: IObligationsOptions[]
}

export interface IAmortizationObligationInfo {
  business_trust: {
    id: number
    name: string
    business_code: string
  }

  id: number
  amount: number
  balance: string
  quotas: number
  amortization_table_url: boolean
  obligation_number: string
  interest_rate: string
  document_file: boolean
  has_payment_plan: boolean
}

export interface IUploadDocumentsForm {
  documents: string | null
}

export interface IAmortizationTablesDocumentsForm {
  documents: string | null
  fileRowList: IFileField[]
}

export interface IFinancialPlanning {
  financialObligationId: number | null
  numberQuota: IFinancialAlias
  initialBalance: IFinancialAlias
  interestQuota: IFinancialAlias
  capitalQuota: IFinancialAlias
  totalQuota: IFinancialAlias
  finalBalance: IFinancialAlias
  paymentDate: string | null
  statusQuotaId: number | null
}


export interface IPlanningForm {
  financialObligationId: number;
  numberQuota: number;
  initialBalance: number;
  interestQuota: number;
  capitalQuota: number;
  totalQuota: number;
  finalBalance: number;
  paymentDate: string;
  statusQuotaId: number;
}

export interface IFinancialPlanForm extends IFinancialPlanning {
  statusQuota: string
}

export interface IFinancialInfoById {
  financial_obligation_id: number
  number_quota: number
  initial_balance: number
  interest_quota: number
  capital_quota: number
  total_quota: number
  final_balance: number
  payment_date: string
  status_quota_id: number
  status_quota: string
}

export interface IFinancialPlanningProps {
  obligationSelected: number
  action: IFinancialPlanType
}

export interface IAlertConfigPlansAdd {
  title: string
  description: string
  btnLabel: string
  type: IFinancialPlanType
  loader: boolean
  selectorLabel: string
  isDisabledConfirm: boolean
}
