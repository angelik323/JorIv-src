export type ISelectorAddTypes = 'create' | 'edit' | 'view' | 'default'

export type IModalAction = 'credit-type' | 'payment-period' | 'default'

export type IFinancialTypeAction = 'financial/creation' | 'financial/edit'

export interface IBankList {
  id: number
  description: string
  bankCode: string | null
}

export interface IObligationStatusList {
  id: number
  description: string
}

export interface IObligationSelectorOptions {
  id: number
  name: string
}


export interface IInfoBasicForm {
  businessTrustId: number | null;
  businessTrustCode: string | null;
  businessTrustName: string | null;
  bankName: number | null;
  creditType: number | null;
  paymentPeriod: string | null;
  paymentValue:  number | null;
  paymentTerm: number | null;
  paymentNumber: string | null;
  interestRate: string | null;
  accountHolder: string | null;
  nitNumber: number | null;
  payDay: number | null;
  warningDays: number | null;
}

export interface IBusinessBusinessTrust {
  id: number
  business_code: string
  name: string
  start_date: string
  business_type_id: number
  business_subtype_id: number
  status_id: number
  type: {
    id: number
    name: string
  }
  sub_type: {
    id: number
    name: string
  }
  status: {
    id: number
    status: string
  }
}

export interface IBusinessTrust {
  id: number
  name: string
  business_code: string
}

export interface IObligationList {
  id: number
  credit_type_id: number
  periodicity_type: string
  bank_id: number

  obligation_status: {
    id: number
    name: string
  }
  credit_type: {
    id: number
    name: string
  }

  business_trust: {
    id: number
    name: string
    business_code: string
  }

  bank: {
    id: number
    description: string
  }
  amount: string
  balance: string
  quotas: number
  obligation_number: string
  interest_rate: string
  titular_name: string
  titular_nit: number
  payment_day: number
  alert_days: number
  date_updated_obligation: string | null
  created_at: string
  updated_at: string
}

export interface IPeriodicityType {
  label: string
  value: string
}

export interface ICreateFinancialObligation {
  obligation_number: string
  bank_id: number
  business_trust_id: number
  credit_type_id: number
  periodicity_type: string
  amount: number | null
  quotas: number
  interest_rate: string
  titular_name: string
  titular_nit: number
  payment_day: number
  alert_days: number
}

export interface IUpdateFinancialObligation {
  id: number
  amount: number | null
  quotas: number
  credit_type_id: number
  interest_rate: string
  periodicity_type: string
  payment_day: number
  alert_days: number
  date_updated_obligation: string | undefined
}

export interface IAlertConfigAdd {
  title: string
  description: string
  btnLabel: string
  type: IModalAction
  loader: boolean
  selectorLabel: string
  isDisabledConfirm: boolean
}

export interface IFinancialObligationInfo {
  id: number
  bank_id: number
  obligation_status: {
    id: number
    name: 'PENDIENTE' | 'PAGADA' | string
  }
  credit_type: {
    id: number
    name: string
  }
  periodicity_type: 'DIARIA' | 'SEMANAL' | 'SEMANA DIARIA' | string
  business_trust: {
    id: number
    name: string
    business_code: string
  }
  bank: {
    id: number
    description: string
  }
  amount: string
  balance: string
  quotas: number
  obligation_number: string
  interest_rate: string
  titular_name: string
  titular_nit: number
  payment_day: number
  alert_days: number
  date_updated_obligation: string | null
  created_at: string
  updated_at: string
}

export interface IFinancialSelectorOptions {
  label: string
  value: number
}
export interface IFinancialObligationList {
  id: number
  businessCode: string
  businessName: string
  bankName: string
  obligationNumber: string
  outstandingBalance:  string | number | null | undefined
  status: number
  creditValue:  string | number | null | undefined
  term: number
  creditType: string
  interestRate: string
  paymentFrequency: string
  paymentDay: number
  alertDays: number
}
export interface IFinancialObligationPaymentsList {
  id: number
  businessCode: string
  businessName: string
  bankName: string
  obligationNumber: string
  outstandingBalance: string
  status: number
}
