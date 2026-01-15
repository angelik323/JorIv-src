export interface IBudgetComparisonValidity {
  saldos_presupuestados: string
  saldos_ejecutados: string
}

export interface IBudgetComparisonList {
  _row_number?: number
  rubro_recurso_area_id: string
  operation_log_ids: number[]
  rubro_presupuestal: string
  descripcion_rubro_presupuestal: string
  recurso: string
  descripcion_recurso: string
  area: string
  descripcion_area: string
  [key: `vigencia_anterior_${number}`]: IBudgetComparisonValidity
  [key: `vigencia_actual_${number}`]: IBudgetComparisonValidity
}
