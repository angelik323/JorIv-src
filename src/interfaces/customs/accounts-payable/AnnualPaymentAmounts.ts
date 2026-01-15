export interface IAnnualPaymentAmountsItem {
  id?: number
  year: number
  minimum_salary: string
  transport_subsidy: string
  uvt: string
  obligated_iva_uvt_pn: string
}
export interface IAnnualPaymentAmountsForm {
  year: number | null
  minimum_salary: string | null
  transport_subsidy: string | null
  uvt: string | null
  obligated_iva_uvt_pn: string | null
}
