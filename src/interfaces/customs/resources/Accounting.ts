import { IGenericResource } from './Common'
export interface IAnnualPeriodClosingResource {
  business: string
  id: number
  current_period: string
  business_code: string
}

export interface IAccountingCoins extends IGenericResource {
  rate: string
}

export interface IAccountChartByAccountStructure {
  id: number
  code: string
  code_account: string
  nature: string
}

export interface IAccountGroupResource {
  id: number
  name: string
  code: string
  account_structure_id: number
}

export interface IBusinessTrustPerClosurePeriodResource
  extends IGenericResource {
  business: string
  current_period: string
}
export interface IPucAccountingResource extends IGenericResource {
  account_structure_id?: number | string
  type?: string
}

export interface IReceiptTypeResource {
  id?: number
  value: number
  label: string
  related?: IGenericResource[]
  code?: number
}

export interface IBudgetAccountStructureResource extends IGenericResource {
  id: number
  code_purpose: String
}

export interface IAccountingStructureResource extends IGenericResource {
  purpose: string
  status_id: number
  structure: string
  status: { id: number; status: string }
  sub_receipt_types: { id: number; code: number; name: string }[]
}

export interface IFormattedThirdPartyResource extends IGenericResource {
  formatted_name: string
}

export interface IBusinessTransferParameter extends IGenericResource {
  business: string
}

export interface IBusinessTrustPrincipalStructureResource
  extends IGenericResource {
  account_structure: {
    code: string
    purpose: string
  }
  account_structure_id: number
}
export interface IAvailableCostCenterStructuresResource
  extends IGenericResource {
  id: number
  code?: string
  structure?: string
  purpose?: string
  type?: string
  status_id?: number
  status?: {
    id: number
    status: string
  }
}

export interface IAccountClosingParameterThirdPartyResourceFormat
  extends IGenericResource {
  document_type?: {
    abbreviation: string
  }
  document?: string
}

export interface IAccountStructures extends IGenericResource {
  purpose?: string
  structure?: string
}

export interface IChartStructure extends IGenericResource {
  type: string
  structure: string
  purpose: string
}

export interface IConsecutiveResource extends IGenericResource {
  registration_date: string
  receipt_type_code: number | string
  consecutive_code: number | string
  label_with_date?: string
}

export interface IBusinessTrustSelectorResource extends IGenericResource {
  id: number
  business_code: string
  name: string
  business: string
  current_period: string
  budget?: {
    id: number
    budget_structure_id: number
    validity: number
    current_month: string
    last_closing_date: string
    closing_type: string
    mhpc_section_code: string
    generic_area_id: number
    expense_authorizer_id: number
  }
}

export interface IBudgetStructureResource {
  code: string
  code_name: string
  rpp_id: number
  rpp_structure: string
  rcs_id: number
  rcs_structure: string
  area_id: number
  area_structure: string
}

export interface IBudgetStructuresGenerate extends IGenericResource {
  code_name: string
  rpp_id: number
  rcs_id: number
  area_id: number
  rpp_structure: {
    id: number
    structure: string
    type: string
  }
  rcs_structure: {
    id: number
    structure: string
    type: string
  }
  area_structure: {
    id: number
    structure: string
    type: string
  }
}

export interface IConsolidateProcessResource extends IGenericResource {
  process_code?: string
}

export interface IVoucherUploadsResource extends IGenericResource {
  creator: {
    id: number
    name: string
  }
  uploaded_at: string
}

export interface IBusinessTrustForPeriodOpeningResource
  extends IGenericResource {
  business_code?: string
  business_code_numeric?: number
  account_structures: {
    last_closing_day: string
  }[]
}
