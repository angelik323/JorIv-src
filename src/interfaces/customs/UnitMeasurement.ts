export interface ICreateUpdateUnitMeasurement {
  name: string | null
  description: string | null
}

export interface IUnitMeasurementData {
  id: number
  name: string
  description: string
  status_id: {
    id: number
    name: string
  }
}

export interface IUnitMeasurementList {
  id: number
  name: string
  description: string
  status_id: number
}
