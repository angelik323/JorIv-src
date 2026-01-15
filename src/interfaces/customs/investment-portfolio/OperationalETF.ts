export interface IOperationalETF {
  description: string
  index_type: string
  index_description: string
  administrator_id: number
  admin_description: string
  transmitter_id: number
  transmitter_description: string
  currency_id: number
  isin_code_id: number
  nemotechnic: string
  status_id: number
  etf_number: number
}

export interface IOperationalETFItem {
  etf_number: number
  description: string
  index_type: string
  index_description: string
  crated_at: string
  status: {
    id: number
    description: string
  }
  administrator: {
    nit: string
    description: string
  }
  transmitter: {
    nit: string
    description: string
  }
  isin: {
    description: string
    mnemonic: string
  }
}

export type IOperationalETFEdit = {
  etf_number: number
  description: string
  index_type: string
  index_description: string
  status?: { id: number; description: string }
  administrator?: { nit: string; description: string }
  transmitter?: { nit: string; description: string }
  isin?: { description: string; mnemonic: string }
  currency?: { code: string; description: string; type_currency: string }
}
