export interface ITaxSettlement {
  id: number
  registration_date: string
  payment_request: string
  person_type: string
  supplier: string | null
  status:
    | {
        id: number
        name: string
      }
    | string
  origin: string
  settlement_formula: string | null
  ciuu: string
  iva: string
  payment_request_id?: number
}

export interface ITaxSettlementForm {
  office_id: number | null
  business_id: number | null
  start_date: string | null
  end_date: string | null
  payment_request_id: number | null
  person_type: string | number
  status: string | number
}

export interface IRejectionModal {
  payment_request_id: number | null
  cancellation_rejection_reason_id: number
  observations: string
}

export interface ITaxSettlementItem {
  id: number | string
  type: string
  fiscal_charge_id: number | null
  fiscal_charge: string | null
  settlement_concept_id: number
  concept: string
  base: string
  percentage: string
  value: string
  new_liquidation_value: string
}

export interface ITaxSettlementUpdateItem {
  id?: number
  type: string
  settlement_concept_id: number
  fiscal_charge_id: number | null
  base: number
  percentage: number
  new_liquidation_value: number
}

export interface ITaxSettlementUpdatePayload {
  items: ITaxSettlementUpdateItem[]
}

export interface ITaxSettlementDetail {
  id: number
  office_id?: number | null
  office_name?: string | null
  business_id?: number | null
  business_name?: string | null
  concept_id?: number | null
  concept_name?: string | null
  accounting_date?: string | null
  person_type?: string | null
  supplier?: string | null
  payment_request?: string | null
  status?: {
    id: number
    name: string
  } | null
  items?: ITaxSettlementItem[]
}

export interface IPaymentConcept {
  id: number
  payment_concept_id: number
  code: string
  name: string
  value: string
  reteica_total: number
  reteicas: IReteica[]
}

export interface IReteica {
  id: number | string
  payment_request_concept_id?: number
  city_id: number | null
  ica_activity_id: number | null
  ica_activity_code?: string
  percentage: string
  base: string
  retention_value?: string
}

export interface ICreateReteicaItem {
  city_id: number
  ica_activity_id: number
  base: number
  percentage: number
}

export interface ICreateReteicasPayload {
  reteicas: ICreateReteicaItem[]
}

export interface IUpdateReteicaPayload {
  base: string
  percentage: string
}

export interface IDiscountPayment {
  id: number
  settlement_concept_id: number
  concept: string
  fiscal_charge_id: number | null
  fiscal_charge: string | null
  base: string
  percentage: string
  value: string
  discounts: IDiscountEntry[]
}

export interface IDiscountEntry {
  id: number | string
  type: string
  settlement_concept_id: number
  fiscal_charge_id: number | null
  base: string
  percentage: string
  value: string
}

export interface ICreateDiscountEntryItem {
  type: string
  settlement_concept_id: number
  fiscal_charge_id: number | null
  base: string
  percentage: string
}

export interface ICreateDiscountEntryPayload {
  entries?: ICreateDiscountEntryItem[]
  type?: string
  settlement_concept_id?: number
  fiscal_charge_id?: number | null
  base?: string
  percentage?: string
}

export interface IUpdateDiscountEntryPayload {
  base: string
  percentage: string
}

export interface IAccountingEntry {
  id: number
  type: string
  value: string
  expense_account_id: number | null
  expense_cost_center_id: number | null
  liability_account_id: number | null
  liability_cost_center_id: number | null
  fiscal_charge?: string | null
  concept?: string | null
  index?: number
}

export interface IUpdateAccountingPayload {
  entries: IAccountingEntryPayload[]
}

export interface IAccountingEntryPayload {
  type: string
  value: string
  expense_account_id: number | null
  expense_cost_center_id: number | null
  liability_account_id?: number | null
  liability_cost_center_id?: number | null
}

export interface ITaxSettlementViewHeader {
  id: number
  office_id: number | null
  business_id: number | null
  concept: string | null
  accounting_date: string | null
  person_type: string | null
  supplier_id: number | null
  supplier_name: string | null
  payment_request_code: string | null
  status: string | null
  breadcrumb: number
}

export interface ITaxSettlementLiquidationResponse {
  header: ITaxSettlementViewHeader
  items: ITaxSettlementItem[]
  concepts: IPaymentConcept[]
  summary: {
    net_value: string
  }
}

export interface ITaxSettlementDiscountsResponse {
  header: ITaxSettlementViewHeader
  bases: ITaxSettlementDiscountBase[]
  summary: {
    base_value: string
    discount_value: string
    net_value: string
  }
}

export interface ITaxSettlementDiscountBase {
  id: number
  settlement_concept_id: number | null
  concept: string | null
  fiscal_charge_id: number | null
  fiscal_charge: string | null
  base: string
  percentage: string
  value: string
  discounts: ITaxSettlementDiscountItem[]
  net_value: string
}

export interface ITaxSettlementDiscountItem {
  id: number
  type: string
  settlement_concept_id: number
  concept: string
  fiscal_charge_id: number | null
  fiscal_charge: string | null
  base: string
  percentage: string
  value: string
}

export interface ITaxSettlementConceptsResponse {
  header: ITaxSettlementViewHeader
  concepts: IPaymentConcept[]
  summary?: {
    net_value?: string
  }
}

export interface ITaxSettlementAccountingResponse {
  header: ITaxSettlementViewHeader
  items: ITaxSettlementAccountingItem[]
  preview?: IPreviewRow[]
  summary?: {
    net_value?: string
  }
}

export interface ITaxSettlementAccountingItem {
  id: number
  type: string
  fiscal_charge_id: number | null
  fiscal_charge: string | null
  concept: string | null
  value: string
  expense_account_id: number | null
  expense_cost_center_id: number | null
  liability_account_id: number | null
  liability_cost_center_id: number | null
}

export interface IPreviewRow {
  id: number
  nature: string
  account: string | number
  auxiliar: string
  cost_center: string | number
  debit: string
  credit: string
  currency: string
  [key: string]: unknown
}

export interface IPaymentConceptMapped {
  id: number
  code: string
  name: string
  value: string
  reteica: number
  selected: boolean
}

export interface IReteicaMapped {
  id: number | string
  city_id: number | null
  city_name: string
  base: string
  concept_reteica_id: number | null
  concept_reteica_code: string
  concept_reteica_name: string
  percentage_reteica: string
  retention_value: string
}

export interface IDiscountPaymentBaseMapped {
  id: number
  type: string
  fiscal_charge: string
  concept: string
  base: string
  percentage: string
  value: string
  selected: boolean
}

export interface IDiscountMapped {
  id: number
  type: string
  concept: string
  concept_id: number
  fiscal_charge: string
  base: string
  percentage: string
  value: string
}

export interface IAccountingItemMapped {
  id: number
  type: string
  fiscal_charge: string
  concept_id: number | null
  concept: string
  value: string
  expense_account_id: number | null
  expense_cost_center_id: number | null
  liability_account_id: number | null
  liability_cost_center_id: number | null
}

export interface ICancellationRejectionReason {
  id: number
  reason_code: string
  description: string
  reason_type: string
}

export interface IPreviewResponse {
  data: {
    entries: IAccountingEntry[]
  }
}
