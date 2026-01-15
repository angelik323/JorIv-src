export interface IBusinessWithAccounting {
    id: number
    label: string
    value: number
    accounting_structure: string
    accounting_structure_id: number
}

export interface IRawBusinessTrust {
  id: number
  business_description: string
  accounting_structure: string
  accounting_structure_id: number
}

export interface IAccountingBalanceMovementItem {
    account_code: string
    account_name: string
    cost_center: string
    auxiliary: string
    initial_balance: number
    debit: number
    credit: number
    final_balance: number
    national_currency_balance: number
    foreign_currency_balance: number
    initial_foreign_balance: number
    foreign_balance: number
}

export interface IAccountingBalanceMovementResponse {
    success: boolean
    message: string
    data: {
        current_page: number
        data: IAccountingBalanceMovementItem[]
        first_page_url: string
        from: number
        last_page: number
        last_page_url: string
        links: Array<{
            url: string | null
            label: string
            active: boolean
        }>
        next_page_url: string | null
        path: string
        per_page: number
        prev_page_url: string | null
        to: number
        total: number
    }
}