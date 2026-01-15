export interface IScheduleDeferralItem {
  id: number
  status: IStatus
  structure: IStructure
  business_trust: {
    id: number
    code: string
    name: string
  }
  from: string
  period: string
  voucher: IVoucher
  receipt_type: {
    id: number
    code: string
    name: string
  }
  sub_receipt_type: {
    id: number
    code: string
    name: string
  }
  consecutive?: number
}

interface IStatus {
  id: number
  name: string
}

interface IStructure {
  id: number
  code: number
  purpose: string
  name: string
}

interface IBusinessTrust {
  id: number
  name: string
  code?: number
}

interface IVoucher {
  receipt_type: string
  sub_receipt_type: string
}

export interface IScheduleDeferral {
  voucher_data_id: number
  structure: IStructure
  business_trust: IBusinessTrust
  from_business_trust: IBusinessTrust
  to_business_trust: IBusinessTrust
  parameters: IVoucherParameter[]
  installments: number
  installment_amount: string
  start_period: string
  receipt_type?: IVoucherDataReceiptType
  sub_receipt_type?: IVoucherDataReceiptType
  voucher_data?: IVoucherData
}

export interface IVoucherData {
  account: IVoucherAccount
  account_structure: IVoucherAccountStructure
  business_trust: IVoucherBusinessTrust
  consecutive: string
  nature: string
  credit: string
  debit: string
  voucher_data_id: number
  third_party: IVoucherThirdParty
  receipt_type: IVoucherDataReceiptType
  sub_receipt_type: IVoucherDataReceiptType
  register_detail: string
  period: string
  voucher: number
}

interface IVoucherThirdParty {
  document: string
  id: number
  name: string
}

interface IVoucherAccountStructure {
  code: string
  id: number
  purpose: string
}

interface IVoucherAccount {
  account_structure: IVoucherAccountStructure
  account?: {
    id: number
    code: string
    has_cost_center: boolean
    name: string
  }
  structure?: IVoucherAccountStructure
  code: string
  id: number
  name: string
}

interface IVoucherBusinessTrust {
  business_code: string
  id: number
  name: string
}

export interface IVoucherParameter {
  installments?: number
  installment_amount?: string
  start_period?: string
  receipt_type_id: number
  sub_receipt_type_id: number
  percentage: number
  counterpart_account_id: number
  counterpart_auxiliary_id: number
  counterpart_cost_center_id?: number
  receipt_type?: IVoucherDataReceiptType
  sub_receipt_type?: IVoucherDataReceiptType
  counterpart_account?: IVoucherAccount
  counterpart_auxiliary?: IVoucherThirdParty
  counterpart_cost_center?: IVoucherDataCostCenter
}

interface IVoucherDataCostCenter {
  id: number
  name: string
  code: string
}

export interface IScheduleDeferralModel {
  voucher_data_id?: number
  parameters: IVoucherParameter[]
}

export interface IParameter {
  receipt_type_id: number
  sub_receipt_type_id: number
  percentage: number
  counterpart_account_id: number
  counterpart_auxiliary_id: number
  counterpart_cost_center_id: number
}

export interface IScheduleItem {
  id: number
  period: string
  register: string
  receipt_type: IVoucherDataReceiptType
  sub_receipt_type: IVoucherDataReceiptType
  consecutive: string
  account: IVoucherAccount
  third_party: IVoucherThirdParty
  register_detail: string
  debit: string
  credit: string
  value: number
  status: IStatus
  voucher_data_id: number
  nature: string
  voucher: number
  account_structure: IVoucherAccountStructure
  business_trust: IVoucherBusinessTrust
}

interface IVoucherDataReceiptType {
  code: number
  name: string
  id: number
}

export interface IDeferredDataModel {
  structure_id: number | null
  from_business_trust_id: number | null
  to_business_trust_id: number | null
  business_trust_id: number | null
  voucher_data_id: number | null
  installments: number | null
  installment_amount: number | null
  start_period: string | null
  voucher_data: IVoucherData | null
  parameters: IParameter[]
}

export interface IDeferredBasicModel {
  voucher_data: IVoucherData
  parameters: IParameter[]
  start_period: string
  installment_amount: string
  installments: number
}
