export interface IConsultIndividualListPreventionList {
  id: number
  authorization_number: string | null
  identification_number: string
  name: string
  level_match: number
  watchlist?: string | null
  matching_system: string

  inspektor_response: IInspectorVigiaResponse | null
  vigia_response: IInspectorVigiaResponse | null
}

export interface IInspectorVigiaResponse {
  message: string
  priority: number
  name: string
  document: string
}
