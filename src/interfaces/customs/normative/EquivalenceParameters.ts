import { IGenericResource } from '@/interfaces/customs/resources/Common'

type NullableNumberString = number | string | null

export interface IEquivalenceParameterListItem {
  id: number
  format_id?: string | number
  format_name?: string
  concept_id?: string | number
  concept_name?: string
  concept_detail_id?: string | number
  concept_detail_value?: string
  equivalence_detail_id?: string | number
  equivalence_detail_key?: string
  equivalence_detail_name?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface IEquivalenceParameterInformationForm {
  id?: number
  format: NullableNumberString
  concept: NullableNumberString
  concept_detail: NullableNumberString
  concept_detail_value: string | null
  equivalence: NullableNumberString
  equivalence_name: string | null
}

export interface IConceptDetailResponse {
  concept_details: {
    id: string | number
    name: string
  }[]
  equivalence_details: {
    id: number
    key: string
    value: string
  }[]
}

export interface IConceptDetailOptions extends Omit<IGenericResource, 'id'> {
  id: string | number
}

export interface IEquivalenceParameterResponse {
  id: number
  format_id?: string | number
  format_name?: string
  concept_id?: string | number
  concept_name?: string
  concept_detail_id?: string | number
  concept_detail_value?: string
  equivalence_detail_id?: string | number
  equivalence_detail_key?: string
  equivalence_detail_name?: string
  description?: string
  created_at?: string
  updated_at?: string
}

export interface IEquivalenceParameterToCreate {
  format_id: number
  concept_id: number
  concept_detail_id: string
  concept_detail_value: string
  equivalence_detail_id: number
}

export interface IEquivalenceParameterToEdit {
  format_id: number
  concept_id: number
  concept_detail_id: string
  concept_detail_value: string
  equivalence_detail_id: number
}
