export interface IMovementConsecutivesResponse {
  success: boolean
  data: IMovementConsecutivesData
  message: string
}

export interface IMovementConsecutivesData {
  current_page: number
  data: IMovementConsecutiveItem[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: IPaginationLinkMovement[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface IMovementConsecutiveItem {
  id: number
  business: IMovementBusiness
  voucher: IMovementVoucher
  amount: IMovementAmount
  currency: IMovementCurrency
  dates: IMovementDates
  status: IMovementStatus
  creator: IMovementCreator
}

export interface IMovementBusiness {
  id: number
  code: string
  name: string
}

export interface IMovementVoucher {
  receipt_type_id: number
  receipt_type_code: number
  receipt_type_name: string
  sub_receipt_type_id: number
  sub_receipt_type_name: string
  voucher_number: string
}

export interface IMovementAmount {
  raw: string
  formatted: string
}

export interface IMovementCurrency {
  code: string
  name: string
}

export interface IMovementDates {
  movement_date: string
  created_at: string
}

export interface IMovementStatus {
  id: number
  name: string
}

export interface IMovementCreator {
  id: number
  name: string
  document: string
}

export interface IPaginationLinkMovement {
  url: string | null
  label: string
  active: boolean
}

export interface IConsecutiveDetailResponse {
  success: boolean
  data: IConsecutiveDetailData
  message: string
}

export interface IConsecutiveDetailData {
  id: number
  general_information: IConsecutiveGeneralInformation
  business: IConsecutiveBusiness
}

export interface IConsecutiveGeneralInformation {
  created_by: IConsecutiveCreator
  status: IConsecutiveStatus
  voucher_type: IConsecutiveVoucherType
  voucher_number: string
  amount: IConsecutiveAmount
  currency: IConsecutiveCurrency
  movement_date: string
  created_at: string
}

export interface IConsecutiveCreator {
  id: number
  name: string
  document: string
}

export interface IConsecutiveStatus {
  id: number
  name: string
}

export interface IConsecutiveVoucherType {
  receipt_type_id: number
  receipt_type_code: number
  receipt_type_name: string
  full_info: string
}

export interface IConsecutiveAmount {
  raw: string
  formatted: string
}

export interface IConsecutiveCurrency {
  code: string
  name: string
}

export interface IConsecutiveBusiness {
  id: number
  code: string
  name: string
}
