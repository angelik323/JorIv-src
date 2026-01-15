// Vue - Pinia
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import {
  IPaymentConcept,
  IReteica,
} from '@/interfaces/customs/accounts-payable/TaxSettlement'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useTaxSettlementStore } from '@/stores/accounts-payable/tax-settlement'

export const useConceptsTab = (settlementId: number) => {
  // composables
  const { formatCurrencyString } = useUtils()

  // stores
  const taxSettlementStore = useTaxSettlementStore('v1')
  const { concepts_view_response } = storeToRefs(taxSettlementStore)

  // refs
  const paymentConcepts = ref<(IPaymentConcept & { selected?: boolean })[]>([])
  const retentionRows = ref<IReteica[]>([])

  // configs
  const paymentConceptsColumns: QTable['columns'] = [
    {
      name: 'radio',
      label: '',
      field: 'selected',
      align: 'center',
      sortable: true,
    },
    { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
    {
      name: 'code',
      label: 'Código',
      field: 'code',
      align: 'left',
      sortable: true,
    },
    {
      name: 'name',
      label: 'Nombre',
      field: 'name',
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
      name: 'reteica',
      label: 'Reteica',
      field: 'reteica',
      align: 'left',
      sortable: true,
    },
  ]

  const retentionColumns: QTable['columns'] = [
    { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
    {
      name: 'city',
      label: 'Ciudad',
      field: 'city_id',
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
      name: 'concept_reteica',
      label: 'Concepto reteica',
      field: 'concept_reteica_id',
      align: 'left',
      sortable: true,
    },
    {
      name: 'percentage_reteica',
      label: '% Reteica',
      field: 'percentage_reteica',
      align: 'left',
      sortable: true,
    },
    {
      name: 'retention_value',
      label: 'Valor retención',
      field: 'retention_value',
      align: 'left',
      sortable: true,
    },
  ]

  // actions
  const loadData = async () => {
    if (!concepts_view_response.value) {
      await taxSettlementStore._getTaxSettlementConceptsView(settlementId)
    }

    if (!concepts_view_response.value) return

    const { concepts } = concepts_view_response.value

    if (!Array.isArray(concepts) || concepts.length === 0) {
      paymentConcepts.value = []
      retentionRows.value = []
      return
    }

    paymentConcepts.value = concepts.map((concept: IPaymentConcept) => ({
      ...concept,
      selected: false,
    }))
  }

  const handleSelectPaymentConcept = (id: number) => {
    paymentConcepts.value.forEach((concept) => {
      concept.selected = concept.id === id
    })

    if (!concepts_view_response.value) return

    const selectedConcept = concepts_view_response.value.concepts.find(
      (c: IPaymentConcept) => c.id === id
    )

    if (selectedConcept && Array.isArray(selectedConcept.reteicas)) {
      retentionRows.value = selectedConcept.reteicas
    } else {
      retentionRows.value = []
    }
  }

  // lifecycle hooks
  onMounted(async () => {
    await loadData()
  })

  return {
    // configs
    paymentConceptsColumns,
    retentionColumns,

    // refs
    paymentConcepts,
    retentionRows,

    // utils
    formatCurrencyString,

    // methods
    handleSelectPaymentConcept,
    loadData,
  }
}
