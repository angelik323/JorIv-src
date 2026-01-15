export interface ISelectorResourceResource {
  label: string
  value: number
}

export interface ISelectorStringResource {
  label: string
  value: string
}

export interface ISelectorNumResource {
  label: number
  value: number
}

export interface IResourceNameId {
  id: number
  name: string
}

export interface IResourceModule {
  version: string
}

export interface IGenericResource {
  label: string
  value: number | string
  id?: number
  name?: string
  description?: string
  code?: string
}

export interface IStructureLevel extends IGenericResource {
  max_level: number
  min_level: number
  code_purpose: number
}

export interface IDocumentResource extends IGenericResource {
  document: string
  document_type: {
    abbreviation: string
  }
}

export interface IStatusResource extends IGenericResource {
  status: string
}

export interface IThirdResource extends IGenericResource {
  document_third: number | string
}

export interface IResourceEquivalenceStructure extends IGenericResource {
  structure?: string
  purpose?: string
}

export interface IGenericResourceBoolean {
  label: string
  value: boolean
}

export interface IPortafolioTrader extends IGenericResource {
  portfolio_code: number
  portfolio_name: string
  trader_id: number
  value: string
}

export interface IPortafolioUnit extends IGenericResource {
  unit: string
  account_name?: string
  participation_id?: number
  last_balance?: {
    final_balance_local?: string
  }
}
export interface IResourceFund extends IGenericResource {
  fund_code?: string
  fund_name?: string
  last_closing_date?: string | null
  fic_parameters?: {
    permanency_days?: number | null
    withholding_percentage: string | number | null
    gmf_percentage: string | number | null
    operation_start_date?: string | null
    fund_permanency_agreement?: boolean
  }[]
}

export interface IResourcePrintGroup extends IGenericResource {
  fund_id?: number
  description?: string
  send_type?: string
}
export interface IBanksByBanksAccounts extends IGenericResource {
  accounting_account?: string
  bank_code?: string
  code?: string
  description?: string
  has_movements: false
  status_id?: number | null
  third_party_id?: number | null
  type?: string
  bank_account_id?: number
}
export interface IBusinessBankAccountsAuthorization extends IGenericResource {
  bank?: IBanksByBanksAccounts
  account_bank?: string
  account_name?: string
  account_number?: string
  business_id?: number
  bank_id?: number
}
export interface IGenericFICParticipationDetail extends IGenericResource {
  constitution_value?: string
  participation_number?: number
  title_id?: number
  unit_value?: string
  unit_id?: number
  paper_type_id?: number
}

export interface IGenericFiCParticipationValueForeign extends IGenericResource {
  unit_id: number
  unit_value: string
  paper_type_id: number
  currency: string
  currency_id: number
  isin_id: number
  participation_number: number
  title_id: number
  currency_value: string
  constitution_unit_number: string
  constitution_value_origin_currency?: number
  unit_value_origin_currency?: number
}

export interface IGenericFICPaperTypeParticipation extends IGenericResource {
  currency_id?: number
}

export interface IGenericFICCurrencyForeign extends IGenericResource {
  currency_conversion?: string
  coin_value?: string
}

export interface IGenericFICIsinsMnemonics extends IGenericResource {
  perioricity?: string
  isin_code?: string
  mnemonic?: string
  isin_code_id?: number
}

export interface IGenericwithDateAt extends Omit<IGenericResource, 'value'> {
  value: number | null
  created_at?: string | ''
  updated_at?: string | ''
  deleted_at?: string | ''
}

export interface IGenericwithDateAt extends Omit<IGenericResource, 'value'> {
  value: number | null
  created_at?: string | ''
  updated_at?: string | ''
  deleted_at?: string | ''
}

export interface IContractTypeStatusStatusesSubstatusesResource
  extends IGenericResource {
  sons?: IContractTypeStatusStatusesSubstatusesResource[]
  descripcion?: string
}

export interface IRestatementGenericResource extends IGenericResource {
  closing_type?: string
  fecha_a_generar?: string
}

export interface IAccountingBusinessResource extends IGenericResource {
  period_closing?: string
}
