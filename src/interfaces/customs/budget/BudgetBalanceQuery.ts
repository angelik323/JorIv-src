export interface IBudgetBalanceQueryList {
  id: number
  level: string
  budget_item_id: string
  budget_item_code: string
  budget_item_description: string
  budget_resource_id: string
  budget_resource_code: string
  budget_resource_description: string
  areas_responsibility_id: string
  areas_responsibility_code: string
  areas_responsibility_description: string
  acumulado: number
  saldo: number
}
