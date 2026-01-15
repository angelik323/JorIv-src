export type FullNameParams = {
  firstName?: string
  middleName?: string
  lastName?: string
  secondLastName?: string
}

export interface IFormatCurrencyOptions {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  showCurrencySymbol?: boolean
}

export interface TitleDescription {
  title: string
  description: string
}

export interface IShowEmptySecreens {
  setTitle: string
  setDescription: string
  setImage: string
  setLoader: boolean
}

export interface IFormatPercentageOptions {
  locale?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  includeSymbol?: boolean
}

export type Nullable<T> = {
  [P in keyof T]: T[P] | null
}
