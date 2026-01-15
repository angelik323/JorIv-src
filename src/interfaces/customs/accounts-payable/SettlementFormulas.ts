export interface ISettlementFormulasItem {
  id: number
  code: number
  person_type: string
  fiscal_responsibility: string
  name: string
  status_id: number
  status: {
    id: number
    name: string
  }
  taxes: [
    {
      id: number
      tax_type: string
      is_applicable: boolean
      settlement_concept_id: number | null
      concept_description: string | null
      concept: {
        description: string
        class: string
      },
      tax_type_label?: string | null
    }
  ]
  applies_withholding_tax: boolean
  withholding_tax_liquidation_concept: string
  applies_vat: boolean
  vat_liquidation_concept: string
  applies_vat_withholding: boolean
  vat_withholding_liquidation_concept: string
  applies_ica_withholding: boolean
  applies_territorial_taxes: boolean
  territorial_taxes_liquidation_concept: string
  created_at: string
  updated_at: string
}

export interface ISettlementFormulaVariablesItem {
  applies:
    | 'applies_withholding_tax'
    | 'applies_vat'
    | 'applies_vat_withholding'
    | 'applies_territorial_taxes'
    | 'applies_ica_withholding'
  concept?:
    | 'withholding_tax_liquidation_concept'
    | 'vat_liquidation_concept'
    | 'vat_withholding_liquidation_concept'
    | 'territorial_taxes_liquidation_concept'
}

export type ISettlementFormulaVariablesMap = Record<
  string,
  ISettlementFormulaVariablesItem
>

export interface ISettlementFormulasForm {
  code: number
  person_type: string
  fiscal_responsibility: string
  name: string
  applies_withholding_tax: boolean
  withholding_tax_liquidation_concept: number | null
  withholding_tax_liquidation_concept_description: string | null
  applies_vat: boolean
  vat_liquidation_concept: number | null
  vat_liquidation_concept_description: string | null
  applies_vat_withholding: boolean
  vat_withholding_liquidation_concept: number | null
  vat_withholding_liquidation_concept_description: string | null
  applies_ica_withholding: boolean
  applies_territorial_taxes: boolean
  territorial_taxes_liquidation_concept: number | null
  territorial_taxes_liquidation_concept_description: string | null
}

export interface ISettlementFormulasCreatePayload {
  person_type: string
  fiscal_responsibility: string
  name: string
  taxes: ISettlementFormulasTaxesType[]
}

export interface ISettlementFormulasUpdatePayload {
  name: string
  taxes: ISettlementFormulasTaxesType[]
}

export interface ISettlementFormulasTaxesType {
  tax_type: string
  is_applicable: string
  settlement_concept_id: number | null
}
