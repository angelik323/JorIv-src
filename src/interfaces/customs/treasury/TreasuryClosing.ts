export interface ITreasuryClosingItem {
  id: number
  business_code: string
  name: string
  type_closing: string
}

export interface ITreasuryClosingExecutionPayload {
  date: string | number
  procces: string | number
  business: ITreasuryClosingExecutionBusinessItem[]
}

export interface ITreasuryClosingExecutionBusinessItem {
  id: string | number
}

export interface ITreasuryClosingExecutionLogsPayload {
  'filter[closing_id]': number
}

export interface ITreasuryClosingExecutionItem {
  id: number
  business: string
  bank_account: string
  process: string
  message: string
  status: {
    id: number
    status: string
  }
}
