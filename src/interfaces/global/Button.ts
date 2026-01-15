/* eslint-disable*/
import { RouteLocationRaw } from 'vue-router'

export interface DropdownOption {
  label: string
  icon?: string
  route?: RouteLocationRaw
  routeName?: string
  action?: () => void
  type?: 'group' | 'item'
  children?: DropdownOption[]
  routeParams?: Record<string, any>
  routeQuery?: Record<string, any>
  disable?: boolean
}
