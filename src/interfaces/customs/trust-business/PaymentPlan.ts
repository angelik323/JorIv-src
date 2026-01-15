import { IFileField } from '@/interfaces/global'

type NullableNumberString = number | string | null

export interface IPaymentInstallment {
  id?: number | null
  installment_number: number | null
  initial_balance: number | null
  total_value: number | null
  late_interest: number | null
  final_balance: number | null
  capital_fee: number | null
  payment_date: string | null
  status: NullableNumberString
}

export interface IPaymentPlanList {
  id: number
  project_id: number
  project_stage_id: number
  nomenclature_id: number
  credit_value: number | null
  nomenclature: {
    id: number
    nomenclature: string
    total_paid: number
    balance_due: number
    order_number: number | null
    date_vinculation: string
    date_registration: string
  }
  real_estate_project_stage: {
    id: number
    stage_number: number
    development_type: number
    start_end: string
  }
  real_estate_project: {
    id: number
    project_name: string
    business_trust: {
      id: number
      name: string
    } | null
  }
}

export interface IPaymentPlanBasicDataForm {
  id?: number
  project: NullableNumberString
  project_stage: NullableNumberString
  business_trust: NullableNumberString
  property: NullableNumberString
  buyers: NullableNumberString
  trust_mandate: NullableNumberString
  unit_value: number | null
  value_finish: number | null
  initial_fee_value: number | null
  subsidy_fee_value: number | null
  value_other_concepts: number | null
  fixed_value_initial_fee: number | null
  separation_value: number | null
  financial_obligations: NullableNumberString
  financial_obligations_name?: string | null
  credit_value: number | null
  term: number | null
  periodicity: string | null
  effective_annual_rate: string | null
  payments_plan: IPaymentInstallment[] | null
}

export interface IPaymentPlanResponse {
  id: number
  project: {
    id: number
    name: string
  }
  project_stage: {
    id: number
    stage_number: number
  }
  property: {
    id: number
    nomenclature: string
  }
  business_trust: {
    id: number
    name: string
    code: string
  }
  property_sale: {
    id: number
  }
  buyers: {
    id: number
    third_party_id: number
    buyer: {
      id: number
      status_id: number
      status: {
        id: number
        name: string
      }
      document_type_id: number
      document_type: {
        id: number
        name: string
        abbreviation: string
      }
      email: string | null
      phone: string | null
      address: string | null
      document: string
      name: string
      type: string
    }
    name: string
    third_party: {
      id: number
      document_number: string
      document_type: string
      email: string | null
    }
  }[]
  fiduciary_mandate: {
    id: number
    mandate_code: string
    status_id: number
  }
  financial_obligation: {
    id: number
    periodicity_type: string
    amount: string
    quotas: number
    obligation_number: string
    interest_rate: string
  }
  unit_value: number
  value_finish: string
  initial_fee_value: string
  subsidy_fee_value: string
  value_other_concepts: string
  fixed_value_initial_fee: string
  separation_value: string
  financial_obligations: string
  credit_value: number
  installment: number
  periodicity: string | null
  annual_effective_rate: number
  payment_plan: {
    id: number
    installment_number: number
    initial_balance: string
    total_value: string
    late_interest: string
    capital_fee: string
    final_balance: string
    payment_date: string
    status: {
      id: number
      status: string
      comments: string | null
    }
  }[]
  attachments: IPaymentPlanAttachment[]
}

export interface IPaymentPlanToCreate {
  project_id: number | null
  project_stage_id: number | null
  business_trust_id: number | null
  unit_value: number | null
  value_finish: number | null
  initial_fee_value: number | null
  subsidy_fee_value: number | null
  value_other_concepts: number | null
  fixed_value_initial_fee: number | null
  separation_value: number | null
  financial_obligations: number | null
  payments_plan: IPaymentInstallment[] | null
}

export interface IPaymentPlanToEdit {
  unit_value: number | null
  value_finish: number | null
  initial_fee_value: number | null
  subsidy_fee_value: number | null
  value_other_concepts: number | null
  fixed_value_initial_fee: number | null
  separation_value: number | null
  financial_obligations: number | null
}

export interface IPaymentInstallmentToCreate {
  payments_plan: {
    installment_number: number | null
    initial_balance: number | null
    total_value: number | null
    late_interest: number | null
    final_balance: number | null
    capital_fee: number | null
    payment_date: string | null
  }[]
}

export interface IPaymentInstallmentToEdit {
  installment_number: number | null
  initial_balance: number | null
  total_value: number | null
  late_interest: number | null
  final_balance: number | null
  capital_fee: number | null
  payment_date: string | null
  status_id: number | null
}

export interface IPaymentPlanAttachment {
  id: number
  original_name: string
  is_validated: boolean
  created_at: string
  s3_file_path: string
}

export interface IPaymentPlanDocumentsForm {
  documentFiles: IFileField[]
  uploadedDocumentFiles: IPaymentPlanAttachment[]
  documentIdsToDelete: string[]
}

export interface IPaymentPlanDocumentRow {
  id: string | number
  name: string
  type?: string
  filePath?: string
  isNew: boolean
  raw: IPaymentPlanAttachment | IFileField
  status_id?: number
}
