// Vue - Pinia
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { ITaxSettlementItem } from '@/interfaces/customs/accounts-payable/TaxSettlement'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useTaxSettlementStore } from '@/stores/accounts-payable/tax-settlement'

export const useLiquidationTab = (settlementId: number) => {
  // composables
  const { formatCurrencyString } = useUtils()

  // stores
  const taxSettlementStore = useTaxSettlementStore('v1')
  const { liquidation_view_response } = storeToRefs(taxSettlementStore)

  // refs
  const settlementRows = ref<ITaxSettlementItem[]>([])
  const netValue = ref('0')

  // configs
  const settlementColumns: QTable['columns'] = [
    { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
    {
      name: 'type',
      label: 'Tipo',
      field: 'type_id',
      align: 'left',
      sortable: true,
    },
    {
      name: 'fiscal_charge',
      label: 'Cargo fiscal',
      field: 'fiscal_charge_id',
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
      name: 'base',
      label: 'Base',
      field: 'base',
      align: 'left',
      sortable: true,
    },
    {
      name: 'percentage',
      label: 'Porcentaje',
      field: 'percentage',
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
      name: 'new_liquidation_value',
      label: 'Valor nueva liquidación',
      field: 'new_liquidation_value',
      align: 'left',
      sortable: true,
    },
  ]

  // actions
  const loadData = async () => {
    if (!liquidation_view_response.value) {
      await taxSettlementStore._getTaxSettlementLiquidationView(settlementId)
    }

    if (!liquidation_view_response.value) return

    const { items, summary } = liquidation_view_response.value

    settlementRows.value = items
    netValue.value = summary.net_value
  }

  // lifecycle hooks
  onMounted(async () => {
    await loadData()
  })

  return {
    // configs
    settlementColumns,

    // refs
    settlementRows,
    netValue,

    // utils
    formatCurrencyString,

    // methods
    loadData,
  }
}
