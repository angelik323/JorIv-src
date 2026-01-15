// Vue - Pinia
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import {
  ITaxSettlementDiscountBase,
  ITaxSettlementDiscountItem,
} from '@/interfaces/customs/accounts-payable/TaxSettlement'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useTaxSettlementStore } from '@/stores/accounts-payable/tax-settlement'

export const useDiscountsPaymentsTab = (settlementId: number) => {
  const { formatCurrencyString } = useUtils()

  const taxSettlementStore = useTaxSettlementStore('v1')
  const { discounts_view_response } = storeToRefs(taxSettlementStore)

  const discountPaymentRows = ref<
    (ITaxSettlementDiscountBase & { selected?: boolean })[]
  >([])
  const discountRows = ref<ITaxSettlementDiscountItem[]>([])
  const netValue = ref('0')

  const discountPaymentColumns: QTable['columns'] = [
    {
      name: 'radio',
      label: '',
      field: 'selected',
      align: 'center',
      sortable: true,
    },
    { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
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
      field: 'concept',
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
  ]

  const discountColumns: QTable['columns'] = [
    { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
    {
      name: 'type',
      label: 'Tipo',
      field: 'type',
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
      name: 'fiscal_charge',
      label: 'Cargo fiscal',
      field: 'fiscal_charge',
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
  ]

  // actions
  const loadData = async () => {
    if (!discounts_view_response.value) {
      await taxSettlementStore._getTaxSettlementDiscountsView(settlementId)
    }

    if (!discounts_view_response.value) return

    const { bases, summary } = discounts_view_response.value

    discountPaymentRows.value = bases.map((base) => ({
      ...base,
      type: 'Bases',
      selected: false,
    }))
    netValue.value = summary.net_value
  }

  const handleSelectDiscountPayment = (id: number) => {
    discountPaymentRows.value.forEach((row) => {
      row.selected = row.id === id
    })

    if (!discounts_view_response.value) return

    const selectedBase = discounts_view_response.value.bases.find(
      (base) => base.id === id
    )

    if (selectedBase) {
      discountRows.value = selectedBase.discounts
    } else {
      discountRows.value = []
    }
  }

  // lifecycle hooks
  onMounted(async () => {
    await loadData()
  })

  return {
    // configs
    discountPaymentColumns,
    discountColumns,

    // refs
    discountPaymentRows,
    discountRows,
    netValue,

    // utils
    formatCurrencyString,

    // methods
    handleSelectDiscountPayment,
    loadData,
  }
}
