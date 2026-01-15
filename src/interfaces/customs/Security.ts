export interface IFailedAttemptsChart {
  date: string
  count: number
}

export interface IUsersStatus {
  status_id: number
  status_name: string
  count: number
}

export interface IUsersStatusList {
  id: number
  last_name: string
  name: string
  profile_type: string
  statu_id: number
  status_name: string
}

export interface IUserConnectedCount {
  count: number
  date: string
}

export interface IUserConnectedList {
  id: number
  name: string
  last_name: string
  profile_type: string
  status_id: number
  status_name: string
  ip: string
  date: string
}

export interface IUserConnectionTime {
  id: number
  name: string
  last_name: string
  profile_type: string
  status_id: number
  status_name: string
  ip: string
  date: string
  time: number
}

export interface ApexChartsCustom extends ApexCharts {
  el: HTMLElement
}
