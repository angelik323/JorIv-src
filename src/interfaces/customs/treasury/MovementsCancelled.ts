export interface IApiResponseMovementsCancelled<T> {
  success: boolean
  data: T
  message: string
}

export interface IExportMovementCancelledParam {
  business_from: string
  business_to: string
  period_from: string
  period_to: string
  annulate_date_from?: string
  annulate_date_to?: string
}

export interface ICancelledMovementShow {
  id: number
  business: IBusinessShowMovementCancelled
  original_movement: IMovementDetail
  cancellation_movement: ICancellationMovementDetail
  office: {
    id: number
    name: string
  }
}

export interface IBusinessShowMovementCancelled {
  id: number
  name: string
  code: string
  structure_name: string
  structure_code: string
}

export interface IMovementDetail {
  period: string
  voucher_id: number
  voucher_number: string
  voucher_description: string
  sub_voucher_number: number
  sub_receipt_type_id: number
  sub_voucher_description: string
  consecutive: number
  registry: number
  date: string
  amount: {
    raw: string
    formatted: string
  }
  status: string
}

export interface ICancellationMovementDetail extends IMovementDetail {
  cancellation_reason: string
}

export interface ICancelledMovementsResponse {
  current_page: number
  data: ICancelledMovementItem[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: IPaginationLinkMovementsCancelled[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface ICancelledMovementItem {
  id: number
  business_information: IBusinessInformation
  original_movement: IMovement
  cancellation_movement: IMovement
  cancellation_info: ICancellationInfo
}

export interface IBusinessInformation {
  business_id: number
  business_code: string
  business_name: string
  formatted_business: string
}

export interface IMovement {
  period: string
  voucher_number: string
  consecutive: number
  registry: number
}

export interface ICancellationInfo {
  cancellation_date: string
  cancellation_reason: string
  cancelled_by: string
  cancellation_code: string
}

export interface IPaginationLinkMovementsCancelled {
  url: string | null
  label: string
  active: boolean
}
