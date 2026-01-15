export interface ILocationList {
  city: IPlace
  code: string
  department: IPlace
  id: number
  name: string
  parent_location: string | number | null
  status: IStatus
  type: string
}

interface IPlace {
  id: number
  name: string
}

interface IStatus {
  id: number
  status: string
}

export interface ICreateUpdateLocation {
  code: string | null
  name: string | null
  type: string | null
  branch_id: number | null
  // Territorialidad:
  parent_location_id: number | null
  department_id: number | null
  city_id: number | null
}

export interface ILocationData {
  branch: IBranch
  city: ICity
  code: string
  department: IDepartment
  id: number
  name: string
  parent_location: IParentLocation
  status_id: number
  type: string
}

interface IBranch {
  id: number
  status_id: number
  name: string
  description: string
}

interface ICity {
  id: number
  name: string
  code: string
  department_id: number
}

interface IDepartment {
  id: number
  name: string
  code: string
}

interface IParentLocation {
  id: 1
  name: 'Hickle-Krajcik'
  status_id: 1
}
