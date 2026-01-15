type NullableString = string | null

export interface IFormatGenerationListItem {
  id: number
  format_type?: string
  date_generation?: string
  portafolio?: string
  portafolio_description?: string
  last_valuation_date?: string
  business?: string
  business_name?: string
  last_actualization_date?: string
  fic?: string
  fic_description?: string
  last_closing_date?: string
}

export interface IFormatGenerationInformationForm {
  date: NullableString
  fund: NullableString
}

export interface IFormatGenerationToCreate {
  date: string
  fic_id: number
}
