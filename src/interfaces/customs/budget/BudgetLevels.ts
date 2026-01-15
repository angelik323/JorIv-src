export interface IBudgetLevelsList {
  id: number
  level: number
  description: string
  class: string
}

export interface IBudgetLevelResource extends IBudgetLevelsList {
  budget_level_id?: number
  label?: string
  value?: string | number
}

export interface IBudgetMovementResource {
  movement_code: string
  movement_description: string
  id: number
}

export interface IBudgetMovementsList {
  id: number
  class: string
  decrease_balance: number | null
  increase_balance: number | null
  budget_level: IBudgetLevelsList
  code_movement: IBudgetMovementResource
}

export interface IBudgetMovementFormItem {
  code_movement_id: number | null
  increase_balance: boolean | number
  decrease_balance: boolean | number
}

export interface IBudgetMovementCreate extends IBudgetMovementFormItem {
  budget_level_id: number | null
  class: string
}

export interface ICodeMovementExtended extends IBudgetMovementResource {
  label: string
  value: string | number
  movement_id?: number
  description?: string
}
