export interface IVehicle {
  id: number
  license_plate: string
  armor_level: string
  insurance_name: string
  mechanical_inspection_date: string
  fuel_type: string
  status: string
}

export interface IVehicleRequest {
  id?: number
  insurance_vehicle_id: number
  license_plate: string
  engine_number: string
  chassis_number: string
  mechanical_inspection_date: string
  soat_date: string | null
  doors: string
  armor_level: string
  fuel_type: string
  observations: string
  status_id: number
  insurances: Insurance[]
  status: Status
  asset: Asset
}

export interface Accident {
  id: number
  asset_vehicle_id: string
  accident_date: string
  accident_number: string
  status_id: string
  insurance_id: string
  declared_value: string
  recognized_value: string
  policy_number: string
  description: string
  created_at: string
  updated_at: string
  insurance: Insurance
}

export interface Insurance {
  id: number
  insurance_vehicle_id: number
  status_id: number
  code: string
  name: string
  pivot?: Pivot
}

export interface Pivot {
  asset_vehicle_id: string
  insurance_id: string
  id: string
  insurance_type: string
  issue_date: string
  policy_number: string
  expiration_date: string
  document: null | string
  created_at: string
  updated_at: string
}

export interface Asset {
  id: number
  asset_group_id: number
  asset_class_id: number
  item_id: number
  responsible_id: number
  cost_center_id: number
  asset_status_id: number
  plate_code: string
  rfid_plate_code: string
  plate_code_alt: string
  serial_number: string
  description: string
  is_vehicle: boolean
  entry_type_id: number
  third_party_id: number
  status_id: number
  good_status_id: number
  adquisition_type: string
  supervisor: string
  adquisition_value: string
  buy_order_number: string
  budget_item: string
  invoice_number: string
  invoice_date: string
  inventory_entry_number: string
  entry_date: string
  contract_order_ticket: string
  contract_start_date: string
  contract_end_date: string
  court_ruling: string
  sentencing_process_number: string
  donation_document_number: string
  loan_agreement_number: string
  loan_agreement_date: string
  inter_admin_agreement_number: string
  inter_admin_agreement_date: string
  seizure_court_number: string
  seizure_process_number: string
  historical_cost: string
  adjusted_historical_cost: string
  book_value: string
  rate: string
  period: string
  remaining_useful_life_months: string
  depreciated_useful_life: string
  temporal_value: string
  depreciation_value: string
  accumulated_depreciation: string
  impairment_value: string
  recoverable_value: string
  impairment_description: string
  minor_or_major_amount: boolean
  liability_in_process: boolean
  restriction_final_disposition: boolean
  created_at: string
  updated_at: string
  location_id: string
  entry_ticket: string
  accidents: Accident[]
}

export interface Status {
  id: number
  status: string
}
