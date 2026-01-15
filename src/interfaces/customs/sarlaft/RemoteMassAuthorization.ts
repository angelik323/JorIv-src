export interface IRemoteMassAuthorization {
  request_date: string
  origin_module: number
  coincidences: number
  grupo_id: string
}

export interface IPaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface IRemoteMassAuthorizationPaginatedData {
  current_page: number
  data: IRemoteMassAuthorization[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: IPaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface IRemoteMassAuthorizationApiResponse {
  success: boolean
  data: IRemoteMassAuthorizationPaginatedData
  message: string
}

export interface IRemoteMassAuthorizationThirdParty {
  id: number
  index: number
  identificationNumber: string
  name: string
  matchLevelStatusId: string
  precautionaryList: string
  statusId: number
  ownList?: string
}

export interface IRemoteMassAuthorizationDetailItem {
  id: number
  name: string
  identification_number: string
  request_date: string
  match_level: string
  watchlist: string
  response: string
  origin_module: number
  status_id: number
  own_list?: string
}

export interface IRemoteMassAuthorizationDetailResponse {
  current_page: number
  data: IRemoteMassAuthorizationDetailItem[]
  total: number
}

export interface IRemoteMassAuthorizationUpdateRequest {
  ids: number[]
  action: number
  justification: string
}

export interface IRemoteMassAuthorizationUpdateResponse {
  success: boolean
  data: unknown[]
  message: string
}
