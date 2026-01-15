export interface IAccountingParametersMovementCodes {
  id?: number | null
  _uid?: number
  business_type_id?: number | string | null
  accounting_structure_id?: number | string | null
  cost_center_structure_id?: number | string | null
  budget_structure_id?: string | null
}

export interface ICodesBusinessTrust {
  id: number
  business_code: string
  name: string
  business_type_id: number
  status_id: number
  status: IStatus
  account: IAccount
}

interface IAccount {
  id: number
  business_trust_id: number
  accounting_structure_id: number
  cost_center_structure_id: number
}

interface IStatus {
  id: number
  status: string
}

export interface IAccountingParametersMovementCodesParameter {
  id?: number | null
  _uid?: number
  movement_code_id?: number
  good_class?: string
  good_type?: string
  split_nature?: string
  np_auxiliary_type?: string
  np_specific?: number
  split_accounting_account_id?: number
  np_cost_center_id?: number
  counterpart_nature?: string
  offsetting_accounting_account_id?: number
  ncp_auxiliary_type?: string
  ncp_specific?: number
  ncp_cost_center_id?: number
  voucher_id?: number
  sub_voucher_id?: number
  accounting_block_id?: number
}

///

export interface IAccountingParametersMovementCodesParameterResponse {
  id: number
  good_class: string
  good_type: string
  split_nature: string
  np_auxiliary_type: string
  np_specific: IPSpecific
  counterpart_nature: string
  ncp_auxiliary_type: string
  ncp_specific: IPSpecific
  np_cost_center_id: IPCostCenterID
  ncp_cost_center_id: IPCostCenterID
  offsetting_accounting_account_id: IAccountingAccountID
  split_accounting_account_id: IAccountingAccountID
  movement_code_id: IMovementCodeID
  voucher_id: IVoucherID
  sub_voucher_id: IVoucherID
}

interface IMovementCodeID {
  id: number
  movement: string
  description: string
  nature: string
}

interface IPCostCenterID {
  id: number
  code: string
  purpose: string
}

interface IPSpecific {
  id: number
  document_number: string
  document_type: number
  name: string
  type: string
  abbreviation: string
}

interface IAccountingAccountID {
  id: number
  code: string
  name: string
}

interface IVoucherID {
  id: number
  code: number
  name: string
}
