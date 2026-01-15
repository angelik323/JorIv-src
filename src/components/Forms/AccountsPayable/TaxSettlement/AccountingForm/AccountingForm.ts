// Vue - Pinia
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import {
  IAccountingEntry,
  IAccountingEntryPayload,
  IPreviewRow,
  IUpdateAccountingPayload,
} from '@/interfaces/customs/accounts-payable/TaxSettlement'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useTaxSettlementStore } from '@/stores/accounts-payable/tax-settlement'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

export const useAccountingForm = (props: { settlementId: number }) => {
  const { openMainLoader } = useMainLoader()
  const { getFormatNumber } = useUtils()

  const taxSettlementStore = useTaxSettlementStore('v1')
  const { _getAccountingEntries, _updateAccounting } = taxSettlementStore
  const { accounting_entries, accounting_view_response } =
    storeToRefs(taxSettlementStore)

  const accountingResourcesStore = useAccountingResourceStore('v1')
  const {
    liability_accounts,
    cost_center_active,
    cost_center_codes_by_structure,
  } = storeToRefs(accountingResourcesStore)

  const {
    accounts_chart,
    cost_center_structures_by_business_and_account_structure,
  } = storeToRefs(useAccountingResourceStore('v1'))

  // refs
  const accountingRows = ref<Record<string, unknown>[]>([])
  const previewModalVisible = ref(false)
  const previewData = ref<IPreviewRow[]>([])

  const accountingColumns: QTable['columns'] = [
    {
      name: 'index',
      label: '#',
      field: 'index',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'type',
      label: 'Tipo',
      field: 'type',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'fiscal_charge',
      label: 'Cargo fiscal',
      field: 'fiscal_charge',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'concept',
      label: 'Concepto',
      field: 'concept',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'value',
      label: 'Valor',
      field: 'value',
      align: 'right' as const,
      sortable: true,
      format: (val: string) => getFormatNumber(val),
    },
    {
      name: 'expense_account',
      label: 'Partida contable gastos',
      field: 'expense_account_id',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'expense_cost_center',
      label: 'Centro de costo gastos',
      field: 'expense_cost_center_id',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'liability_account',
      label: 'Contrapartida pasivo',
      field: 'liability_account_id',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'liability_cost_center',
      label: 'Centro de costo pasivo',
      field: 'liability_cost_center_id',
      align: 'left' as const,
      sortable: true,
    },
  ]

  const previewColumns: QTable['columns'] = [
    {
      name: 'id',
      label: '#',
      field: 'id',
      align: 'left',
    },
    {
      name: 'nature',
      label: 'Naturaleza',
      field: 'nature',
      align: 'left',
    },
    {
      name: 'account',
      label: 'Cuenta',
      field: 'account',
      align: 'left',
    },
    {
      name: 'auxiliar',
      label: 'Auxiliar',
      field: 'auxiliar',
      align: 'left',
    },
    {
      name: 'cost_center',
      label: 'Centro de costos',
      field: 'cost_center',
      align: 'left',
    },
    {
      name: 'debit',
      label: 'Valor débito',
      field: 'debit',
      align: 'left',
    },
    {
      name: 'credit',
      label: 'Valor crédito',
      field: 'credit',
      align: 'left',
    },
    {
      name: 'currency',
      label: 'Moneda',
      field: 'currency',
      align: 'left',
    },
  ]

  const loadAccountingEntries = async () => {
    if (!props.settlementId) return

    if (accounting_entries.value !== null) return

    openMainLoader(true)
    await _getAccountingEntries(props.settlementId)
    openMainLoader(false)

    const entries = taxSettlementStore.accounting_entries
    if (entries && Array.isArray(entries)) {
      accountingRows.value = (entries as IAccountingEntry[]).map(
        (entry, index) => ({
          ...entry,
          index: index + 1,
          expense_account_id: entry.expense_account_id ?? null,
          expense_cost_center_id: entry.expense_cost_center_id ?? null,
          liability_account_id: entry.liability_account_id ?? null,
          liability_cost_center_id: entry.liability_cost_center_id ?? null,
        })
      ) as unknown as Record<string, unknown>[]
    }
  }

  const handleUpdateAccounting = async (): Promise<boolean> => {
    if (!props.settlementId) return false

    const entries: IAccountingEntryPayload[] = accountingRows.value.map(
      (row) => ({
        type: (row.type as string) || '',
        value: (row.value as string) || '0',
        expense_account_id: (row.expense_account_id as number) || null,
        expense_cost_center_id: (row.expense_cost_center_id as number) || null,
        liability_account_id: (row.liability_account_id as number) || null,
        liability_cost_center_id:
          (row.liability_cost_center_id as number) || null,
      })
    )

    const payload: IUpdateAccountingPayload = { entries }

    openMainLoader(true)
    const success = await _updateAccounting(props.settlementId, payload)
    openMainLoader(false)

    if (success) {
      await loadAccountingEntries()
    }

    return success
  }

  const handlePreview = async () => {
    if (!props.settlementId) return

    openMainLoader(true)
    await taxSettlementStore._getTaxSettlementAccountingPreview(
      props.settlementId
    )
    openMainLoader(false)

    const { preview } = accounting_view_response.value || {}

    previewData.value = Array.isArray(preview) ? preview : []

    previewModalVisible.value = true
  }

  const handleClosePreview = () => {
    previewModalVisible.value = false
  }

  const handleFieldUpdate = (
    row: Record<string, unknown>,
    field: string,
    value: number | null
  ) => {
    row[field] = value
  }

  // watchers
  watch(
    accounting_entries,
    () => {
      if (accounting_entries.value && Array.isArray(accounting_entries.value)) {
        accountingRows.value = accounting_entries.value.map((entry, index) => ({
          ...entry,
          index: index + 1,
          expense_account_id: entry.expense_account_id ?? null,
          expense_cost_center_id: entry.expense_cost_center_id ?? null,
          liability_account_id: entry.liability_account_id ?? null,
          liability_cost_center_id: entry.liability_cost_center_id ?? null,
        })) as unknown as Record<string, unknown>[]
      }
    },
    { immediate: true, deep: true }
  )

  // lifecycle hooks
  onMounted(async () => {
    await loadAccountingEntries()
  })

  return {
    // configs
    accountingColumns,

    // selects
    liability_accounts,
    accounts_chart,
    cost_center_structures_by_business_and_account_structure,
    cost_center_active,

    // refs
    accountingRows,

    // methods
    handleFieldUpdate,
    handleUpdateAccounting,
    handlePreview,
    handleClosePreview,
    loadAccountingEntries,
    cost_center_codes_by_structure,
    previewModalVisible,
    previewData,
    previewColumns,
  }
}
