export interface IComplianceOperationsPortfolio {
  investment_portfolio_id: number
  investment_portfolio: string
  instrucion_slip_id: number
  payment_or_collection_method: string
  compliance_bank: string
  compliance_bank_account: string
  operation_value: string
  operation_type: string
  benefit: string
}

export interface IComplianceOperationsPortfolioForm {
  date: string
  operation_nature: string
  instruction_slip_ids: number[]
}
