export interface IIssuersCounterparties {
  id: number
  third_party_id: number
  document_third: number
  type_third: string
  description: string
  emitter_type: string
  rating_agency: string
  history_currency: {
    created_at: string
    updated_at: string
  }
}

export interface IIssuersCounterpartiesForm {
  third_party_id: number
  document_third: string
  type_third: string
  description: string
  anna_code?: string
  emitter_type: string
  rating_agency: string
  cp_issuer_rating: string
  lp_issuer_rating: string
  class_ratings: IIssuersCounterpartiesClassRating[] | string[]
  history_issuers_counter_party: IHistoryIssuersCounterParty
  cp_issuer_qualification_id?: number | null
  lp_issuer_qualification_id?: number | null
}

export interface IIssuersCounterpartiesClassRating {
  id: number
  class_name: string
  created_at: Date
  updated_at: Date
}

interface IHistoryIssuersCounterParty {
  created_at: Date | null
  creator_data: string
  updated_at: Date | null
  update_data: Date | null
}

export interface IThirdDocumentResponse {
  id: number
  document: string
  third_party_type: string | null
  natural_person: {
    name: string | null
  }
  legal_person: {
    trade_name: string | null
    business_name: string | null
  }
}
