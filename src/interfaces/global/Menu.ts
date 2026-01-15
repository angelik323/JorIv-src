export interface IMenu {
  key: null | string
  name: string
  icon: null | string
  children: Child[]
}

export interface Child {
  permission: string
  name: string
  identifier: string
  path: null | string
  actions: string[]
}

export interface IRoleValidationMeta {
  module: string
  view: string
  action: ActionType 
}

type ActionType = "delete" | "edit" | "show" | "create" | "list" | "view" | "export" ;