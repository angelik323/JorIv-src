export interface ITypesCoverageList {
  id: number
  date: string
  code: string
  description: string
  coverage_type: string
  coverage_type_element: string
}

export interface ITypesCoverageResponse {
  id: number
  code: string
  description: string
  operation_coverage_type_id: number
  operation_coverage_type_element_id: number
  coverage_type: string
  coverage_type_element: string
}

export interface IOperationCoverageResource {
  value: number
  label: string
  operation_coverages_types_elements: IOperationCoveragesTypesElement[]
}

export interface IOperationCoveragesTypesElement {
  value?: number
  label?: string
  id?: number
  name?: string
}

export interface ITypesCoverageInformationForm {
  code: string
  description: string
  operation_coverage_type_id: number
  operation_coverage_type_element_id: number
}

export interface ITypesCoverageToCreate {
  code: string
  description: string
  operation_coverage_type_id: number
  operation_coverage_type_element_id: number
}

export interface ITypesCoverageToEdit {
  code: string
  description: string
  operation_coverage_type_id: number
  operation_coverage_type_element_id: number
}
