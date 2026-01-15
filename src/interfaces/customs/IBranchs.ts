import { IregionalItemListSelect } from './IRegionals'

export interface IBranchListCustom {
  id: string
  name: string
  description: string
  status: number
}

// v2 branches:
export interface ICreateUpdateBranch {
  name: string | null | undefined
  description: string | null | undefined
  code: string | null | undefined
  parent_branch_id: IregionalItemListSelect | number | string | null
}

export interface IBranchData {
  id: number | undefined
  status_id: number
  name: string
  code: string
  description: string | null
  type: string
  parent_branch_id: any
  status: IStatus
  parent_branch: IParentBranch | null
}

interface IStatus {
  id: number
  status: string
}

interface IParentBranch {
  id: number
  status_id: number
  name: string
  description: string | null
  type: string
  parent_branch_id: string | number | null
}
