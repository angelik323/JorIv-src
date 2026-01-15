export interface IBaseEntity {
  id: number
  name: string
}

export interface ILocationType extends IBaseEntity {}

export interface ICountry extends IBaseEntity {
  code: string
  nationality: string
}

export interface IDepartment extends IBaseEntity {
  code: string
}

export interface ICity extends IBaseEntity {
  code: string
}

export interface IUserLocations {
  id: number
  name: string
}

export interface IStatusLocations extends IBaseEntity {}

export interface ILocationListResponse {
  id: number
  code: number
  location_type: ILocationType

  parent: string | null
  location_parent_id: number | null

  country_code: string
  country: ICountry

  department_code: string
  department: IDepartment

  city_code: string
  city: ICity

  address: string

  status: IStatusLocations

  created_at: string
  updated_at: string | null

  created_by: IUserLocations
  updated_by: IUserLocations
}

export interface ILocationsListFilters {
  'filter[location_type_id]': string
  'filter[status_id]': string
  'filter[search]': string
}

export interface ILocationListItem {
  id: number
  code: string
  address: string
  location_type: {
    name: string
  }
  country: {
    name: string
  }
  department: {
    name: string
  }
  city: {
    name: string
  }
  status: {
    id: number
  }
}

export interface ILocationsCreateForm {
  id?: number | null
  code?: number | null
  created_by_name?: string | null
  updated_by_name?: string | null
  updated_at?: string | null
  created_at?: string | null
  location_types: number | null
  locations: number | null
  parent_location: number | null
  which?: string | null
  city: string | null
  address: string | null
  department: string | null
  country: string | null
  country_name?: string | null
  department_name?: string | null
  city_name?: string | null
}

export interface IAddressSaved {
  country: { id: number | null; name?: string } | null
  department: { id: number | null; name?: string } | null
  city: { id: number | null; name?: string } | null
  address: string
}

export interface ICreateLocationPayload {
  type_location: number
  custom_type_location?: string | null
  location_parent_id?: number | null

  country_id: string
  department_id: string
  city_id: string

  address: string
}
