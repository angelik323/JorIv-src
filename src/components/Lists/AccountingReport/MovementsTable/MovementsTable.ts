// Vue
import { computed, ref, watch } from 'vue'

// Interfaces
import { IPages } from '@/interfaces/customs/IPages'
import {
  TotalFieldType,
  IGeneralLedgerBusinessTable,
} from '@/interfaces/customs/accounting/v2/AccountingReport'

export const useMovementsTable = (
  business: IGeneralLedgerBusinessTable,
  pages: IPages
) => {
  const pagination = ref({
    page: pages?.currentPage ?? 1,
    rowsPerPage: 5,
  })

  const rows = computed(() =>
    (business.details ?? []).map((detail) => ({
      account_code: detail.account.code,
      description: detail.account.name,
      previous_balance: detail.previous_balance,
      movements: detail.movements,
      current_balance: detail.current_balance,
    }))
  )

  const columns = [
    { name: 'account_code', label: 'Cuenta', field: 'account_code' },
    { name: 'description', label: 'Descripción', field: 'description' },
  ]

  const total = (field: TotalFieldType) => {
    const totals = business.total_values

    switch (field) {
      case 'previous_debit':
        return totals.previous_balance.debit
      case 'previous_credit':
        return totals.previous_balance.credit
      case 'movement_debit':
        return totals.movements.debit
      case 'movement_credit':
        return totals.movements.credit
      case 'current_debit':
        return totals.current_balance.debit
      case 'current_credit':
        return totals.current_balance.credit
      default:
        return 0
    }
  }

  watch(
    () => pages.currentPage,
    (val) => {
      pagination.value.page = val
    }
  )

  return {
    rows,
    total,
    columns,
    pagination,
  }
}
