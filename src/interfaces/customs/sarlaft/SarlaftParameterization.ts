export interface ISarlaftParameterizationList {
  id: number
  value: string
  description: string
  countries?: ICountryGafi[]
}

export interface ICountryGafi {
  name: string
  code: number
  selectable_id: number
}
