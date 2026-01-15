export interface IPhoneNumberType {
  id: number | string
  name: string
}

export interface IPhoneNumber {
  id?: number | string
  type?: IPhoneNumberType
  number?: string
  code?: string
}
