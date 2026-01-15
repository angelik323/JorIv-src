export type ITypeCoin = 'Local' | 'Extranjera'
export type IBankTransferTypeAction =
  | 'origin-data'
  | 'destiny-data'
  | 'show-data'

export type IActionTransfer = 'origins' | 'destinations'

export interface IFormOfficesFilter {
  date: string | null
  fiduciaryOffice: number | null
  fiduciaryOfficeName: string | null
  instructionsView: string | null
}

export interface IOriginInfo {
  id: string
  businessCode: string
  movement: string
  bankName: string
  bankAccount: string | number
  founderType: string
  bussinessPlan: string
  paymentType: string
  coinValue: string
  coin: string
  valueTRM: number | string
  natureType: string
  onlyValue: string
  costCenter: string
  cashFlow: string
  balance: string
  planInvesment: string
}

export interface IFormTransfer {
  businessId: null | number
  businessType: null | number
  movementValue: null | number
  bankValue: null | number
  bankDescription: null | number
  bankAccountValue: null | number
  fundValue: null | number
  paymentMethod: null | number
  trustInvestmentPlan: null | number
  inversionPlan: null | number
  collectionTypeValue: null | number
  amountInForeignCurrency: null | number
  foreignCurrencyValue: null | number
  currencyValue: null | ITypeCoin
  trmValue: null | number
  natureValue: null | string
  costValue: null | number
  costCenter: null | number
  cashFlow: null | number
  bankAccountBalance: null | number | string
  investmentPlanBalance: null | number
}

export interface IAccountTranslateBankOptions {
  value: number | string
  label: string
  coinType: ITypeCoin
  accountBalance: number
  investmentPlanBalance: number
}

export interface IBankTransferFilter {
  date: null | string
  office_id: null | number
  name_office: string | null
  observations: string | null
  bank_transfer_id?: number | null
}

export interface IBankTransferInitialForm extends IBankTransferFilter {
  office_label: string | null
}

export interface IBankTransferState {
  business_trust_id: number | null
  movement_id: number | null
  bank_id: number | null
  bank_account_id: number | null
  found_id: number | null
  investment_plans_id: number | null
  means_of_payment_id?: number | null
  type_receive_id?: number | null
  foreign_currency_value: number | null
  coin: ITypeCoin | null
  trm: number | null
  value: number | null
  cost_center_id: number | null
  cash_flow_id: number | null
  bank_account_balance: number | null | string
  investment_plan_balance: number | null
}

export interface IBankTransferOriginToDestinyState {
  value: number | null
  bank_account_balance: number | null | string
  investment_plan_balance: number | null
}

export interface IBankTrasferCreateAndUpdate extends IBankTransferFilter {
  details: IBankTransferState[]
}
export interface IBankTransferDetail extends IBankTransferState {
  trust_investment_plan: number | null
}

export interface IBankTranslateList {
  id: number
  businessCode: string
  movement: string
  bankName: string
  founderType: string
  bussinessPlan: string
  trustInvestmentPlan: string
  valueForeignCurrency: string
}

export interface IConvertedInfo {
  title: string
  description: string
}

export interface IBankTranslateSuccess {
  status: boolean
  id: number | null
}
