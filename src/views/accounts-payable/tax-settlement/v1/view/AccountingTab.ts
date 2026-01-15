// Vue - Pinia
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import {
  ITaxSettlementAccountingItem,
  IPreviewRow,
} from '@/interfaces/customs/accounts-payable/TaxSettlement'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useTaxSettlementStore } from '@/stores/accounts-payable/tax-settlement'

export const useAccountingTab = (settlementId: number) => {
  // composables
  const { formatCurrencyString, defaultIconsLucide } = useUtils()

  // stores
  const taxSettlementStore = useTaxSettlementStore('v1')
  const { accounting_view_response } = storeToRefs(taxSettlementStore)

  // refs
  const accountingRows = ref<ITaxSettlementAccountingItem[]>([])
  const previewModalVisible = ref(false)
  const previewData = ref<IPreviewRow[]>([])

  // configs
  const accountingColumns: QTable['columns'] = [
    { name: 'id', label: '#', field: 'id', align: 'left', sortable: false },
    {
      name: 'type',
      label: 'Tipo',
      field: 'type',
      align: 'left',
      sortable: true,
    },
    {
      name: 'fiscal_charge',
      label: 'Cargo fiscal',
      field: 'fiscal_charge',
      align: 'left',
      sortable: true,
    },
    {
      name: 'concept',
      label: 'Concepto',
      field: 'concept_id',
      align: 'left',
      sortable: true,
    },
    {
      name: 'value',
      label: 'Valor',
      field: 'value',
      align: 'left',
      sortable: true,
    },
    {
      name: 'expense_account',
      label: 'Partida contable gastos',
      field: 'expense_account_id',
      align: 'left',
      sortable: true,
    },
    {
      name: 'expense_cost_center',
      label: 'Centro de costo gastos',
      field: 'expense_cost_center_id',
      align: 'left',
      sortable: true,
    },
    {
      name: 'liability_account',
      label: 'Contrapartida pasivo',
      field: 'liability_account_id',
      align: 'left',
      sortable: true,
    },
    {
      name: 'liability_cost_center',
      label: 'Centro de costo pasivo',
      field: 'liability_cost_center_id',
      align: 'left',
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

  // actions
  const loadData = async () => {
    if (!accounting_view_response.value) {
      await taxSettlementStore._getTaxSettlementAccountingPreview(settlementId)
    }

    if (!accounting_view_response.value) return

    const { items } = accounting_view_response.value

    if (!Array.isArray(items) || items.length === 0) {
      accountingRows.value = []
      return
    }

    accountingRows.value = items
  }

  const handlePreview = async () => {
    await taxSettlementStore._getTaxSettlementAccountingPreview(settlementId)

    const { preview } = accounting_view_response.value || {}

    previewData.value = Array.isArray(preview) ? preview : []

    previewModalVisible.value = true
  }

  const handleClosePreview = () => {
    previewModalVisible.value = false
  }

  // lifecycle hooks
  onMounted(async () => {
    await loadData()
  })

  return {
    // configs
    accountingColumns,
    previewColumns,

    // refs
    accountingRows,
    previewModalVisible,
    previewData,

    // utils
    defaultIconsLucide,
    formatCurrencyString,

    // methods
    handlePreview,
    handleClosePreview,
    loadData,
  }
}
