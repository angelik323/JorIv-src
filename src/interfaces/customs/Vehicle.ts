export interface IVehicleForm {
  id?: number | null
  asset_id: number | null
  asset_object: {
    id: number
    plate_code: string | number
    description: string
  } | null
  license_plate: string
  engine_number: string
  chassis_number: string
  mechanical_inspection_date: string
  doors: string
  armor_level: string
  fuel_type: string
  observations: string
}

export interface IInsuranceTable {
  id: number
  insurance_vehicle_id: number
  name?: string
  pivot?: {
    insurance_id: string
    insurance_type: string
    issue_date: string
    policy_number: string
    expiration_date: string
    document?: File | null
  }
  saved?: boolean
}

export interface IAccidentTable {
  id: number
  insurance_name?: string
  insurance_id?: number
  insurance?: {
    name: string
  }
  accident_date: string
  accident_number: string
  policy_number: string
  declared_value: string
  recognized_value: string
  description: string
  status_id: number
  saved?: boolean
}
