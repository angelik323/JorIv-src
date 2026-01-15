export interface IRegional {
  id?: string
  name: string | null | undefined
  code: string | number | null | undefined
  description: string | null | undefined
}

export interface IregionalItemListSelect {
  id: string | number
  description: string
}

export interface IRegionalList {
  id: string
  name: string
  description: string
  status: number
}

export interface ISectionalParent {
  id: number
  status_id: number
  name: string
  description: string
  type: string
  parent_branch_id: string
  code: string
  status: IStatus
}

export interface IRegionalData {
  id: number
  status_id: number
  name: string
  code: string
  description: string | null
  type: string
  parent_branch_id: number | string | null
  status: IStatus
  parent_branch: IRegionalParent | null
  child_branches: ISectionalParent[]
}

interface IRegionalParent {
  id: number
  status_id: number
  name: string
  description: string | null
  type: string
  parent_branch_id: string | number | null
}

interface IStatus {
  id: number
  status: string
}
