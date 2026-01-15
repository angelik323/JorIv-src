export interface IAccountEquivalenceData {
  structures: {
    source_structure: IEquivalenceStructure
    regular_equivalent_structure: IEquivalenceStructure | null
    fiscal_equivalent_structure: IEquivalenceStructure
  }
  regular_equivalences: IEquivalence[]
  fiscal_equivalences: IEquivalence[]
}

export interface IAccountEquivalenceRequest {
  source_structure_id: number
  account_mappings: IAccountMapping[]
}

export interface IAccountMapping {
  source_account_id: number
  equivalences: IEquivalenceItem[]
}

export interface IEquivalenceItem {
  equivalence_type: 'Equivalencia fiscal' | 'Equivalencia regular' | string
  equivalent_structure_id: number
  equivalent_account_id: number
}

export interface IEquivalence {
  id: number
  source_account_code: string
  source_account_name: string
  type: string
  equivalent_account_code: string
  equivalent_account_name: string
}

export interface IEquivalenceStructure {
  id: number
  code: string
  name: string
  formatted_display: string
}

export interface IPucType {
  puc_type: string
  associate: boolean
  fiscal_equivalent_account: string
  fiscal_equivalent_structure: string
}

export interface IPucAccountRow {
  id: number
  source_estructure: string
  source_account: string
  type: string
  puc_type: IPucType[]
}

export interface IAccountEquivalenceV2 {
  source_structure_id: number | null
  source_structure_code?: string
  source_account_id?: number | null
  source_account_code?: string
  equivalent_structure_id?: number | null
  equivalent_structure_code?: string
  equivalent_account_id?: number | null
  equivalent_account_code?: string
}

export interface IAccountEquivalenceV2Create {
  equivalences: Array<{
    source_structure_id: number | null
    source_account_id: number | null
    equivalent_structure_id: number | null
    equivalent_account_id: number | null
  }>
  source_structure_id?: number | null
  source_account_id?: number | null
  equivalent_structure_id?: number | null
  equivalent_account_id?: number | null
  source_structure?: {
    code: string
    structure: string
  }
  equivalent_structure?: {
    code: string
    structure: string
  }
}

export interface IAccountEquivalenceRowV2 {
  id?: number
  date?: string
  name?: string
  total?: number
  status_id?: number
  account_id?: number | string
  source_structure_id?: number | string
  account_code?: string
  account_name?: string
  equivalent_structure_id?: number | string
  equivalent_account_code?: string | number
  equivalent_account_name?: string | number
  source_account_id?: number | string
  source_account_code?: string
  source_structure_code?: string
  equivalent_account_id?: number | string
  equivalent_structure_code?: string
  status?: string
  file_name?: string
  total_count?: number
  equivalence?: {
    source_account_code?: string
    equivalent_account_code?: string
    equivalent_structure_code?: string
  }
}

export interface IAccountingEquivalenceFailures {
  index: number
  source_structure_code: string
  source_account_code: string
  equivalent_structure_code: string
  equivalent_account_code: string | null
  errors: string[]
}
