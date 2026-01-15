export interface IBudgetSourceDestination {
  id: number
  source_module: string
  source_module_label: string
  source_process: string
  source_process_label: string
  source_reference_id: number
  source_reference_label: string
  source_description: string
  destination_module: string
  destination_module_label: string
  destination_process: string
  destination_process_label: string
  destination_reference_id: number
  destination_reference_label: string
  destination_description: string
}

export interface IBudgetFlowRequest {
  source_module: string
  source_process: string
  source_reference_id: number
  source_description: string
  destination_module: string
  destination_process: string
  destination_reference_id: number
  destination_description: string
}

export interface IBudgetSourcesDestinationsForm {
  source_module: string | null
  source_process: string | null
  source_reference_id: number | null
  source_description: string
  destination_module: string | null
  destination_process: string | null
  destination_reference_id: number | null
  destination_description: string
}
