export interface IAccountBalanceAndThirdParties {
  id: number
  account_code: string
  account_name: string
  auxiliary: string
  cost_center: string | null
  saldo_inicial: number
  sum_debits: string
  sum_credits: string
  saldo_final: number
}
