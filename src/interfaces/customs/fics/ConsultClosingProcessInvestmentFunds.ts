export interface IFicFundBusinessLine {
  id: number
  fund_id: number
  initial_balance: string
  business_line: {
    id: number
    code: string
    description: string
  }
}

export interface IFicMovementTable {
  id: number
  value: string
  movement: {
    code: string
    description: string
    movement_nature_description: string
  }
}
