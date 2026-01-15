// Vue - Pinia
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IPaymentConcept,
  IReteica,
  ICreateReteicasPayload,
  IUpdateReteicaPayload,
} from '@/interfaces/customs/accounts-payable/TaxSettlement'

// Composables
import { useUtils, useMainLoader, useAlert } from '@/composables'

// Stores
import { useTaxSettlementStore } from '@/stores/accounts-payable/tax-settlement'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'

export const useConceptsForm = (
  props: {
    settlementId: number
    businessId?: number | null
  },
  emit?: Function
) => {
  const { formatCurrencyString, defaultIconsLucide, toNumber, round2 } =
    useUtils()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const { _getResources } = useResourceManagerStore('v1')

  const {
    _getPaymentConcepts,
    _getReteicas,
    _createReteicas,
    _updateReteica,
    _deleteReteica,
  } = useTaxSettlementStore('v1')
  const { payment_concepts, reteicas } = storeToRefs(
    useTaxSettlementStore('v1')
  )

  const { cities } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { ica_economic_activity_concepts } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const selectedPaymentConceptId = ref<number | null>(null)
  const paymentConcepts = ref<IPaymentConcept[]>([])
  const retentionRows = ref<IReteica[]>([])

  const icaEconomicActivityConceptsResourceKeys = {
    accounts_payable: ['ica_economic_activity_concepts'],
  }

  const paymentConceptsColumns = [
    {
      name: 'radio_id',
      label: '#',
      field: 'radio_id',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'code',
      label: 'Código',
      field: 'code',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'name',
      label: 'Nombre',
      field: 'name',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'value',
      label: 'Valor',
      field: 'value',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'reteica',
      label: 'ReteICA',
      field: 'reteica_total',
      align: 'left' as const,
      sortable: true,
    },
  ]

  const retentionColumns = [
    {
      name: 'index',
      label: '#',
      field: 'index',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'city',
      label: 'Ciudad',
      field: 'city_id',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'base',
      label: 'Base',
      field: 'base',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'concept_reteica',
      label: 'Concepto reteica',
      field: 'ica_activity_id',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'percentage_reteica',
      label: '% Reteica',
      field: 'percentage',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'retention_value',
      label: 'Valor retención',
      field: 'retention_value',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'actions',
      label: 'Acciones',
      field: 'actions',
      align: 'center' as const,
      sortable: true,
    },
  ]

  const formatCurrency = (value: string | number): string =>
    formatCurrencyString(value, { showCurrencySymbol: false }) || '0,00'

  const loadPaymentConcepts = async () => {
    if (payment_concepts.value !== null) return

    openMainLoader(true)
    await _getPaymentConcepts(props.settlementId)
    openMainLoader(false)
  }

  const loadReteicas = async (paymentConceptId: number) => {
    openMainLoader(true)
    await _getReteicas(props.settlementId, paymentConceptId)
    openMainLoader(false)
  }

  const loadIcaEconomicActivityConcepts = async (
    cityId: number | null,
    accountingStructureId?: number | null
  ) => {
    if (!cityId) {
      useAccountsPayableResourceStore('v1').ica_economic_activity_concepts = []
      return
    }

    const params = new URLSearchParams()
    params.set(`filter[city_id]`, String(cityId))

    if (accountingStructureId) {
      params.set(
        `filter[accounting_structure_id]`,
        String(accountingStructureId)
      )
    }

    openMainLoader(true)
    await _getResources(
      icaEconomicActivityConceptsResourceKeys,
      params.toString()
    )
    openMainLoader(false)
  }

  const createEmptyReteicaRow = (): IReteica => {
    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 11)}`

    const baseValue = ''

    return {
      id: tempId,
      payment_request_concept_id: selectedPaymentConceptId.value || 0,
      city_id: null,
      ica_activity_id: null,
      ica_activity_code: '',
      percentage: '',
      base: baseValue,
      retention_value: '',
    }
  }

  const updateReteicaTotal = () => {
    if (!selectedPaymentConceptId.value) return

    const selectedConcept = paymentConcepts.value.find(
      (c) => c.id === selectedPaymentConceptId.value
    )
    if (!selectedConcept) return

    const totalReteica = retentionRows.value.reduce((sum, reteica) => {
      const retentionValue = toNumber(reteica.retention_value, 0)
      return sum + retentionValue
    }, 0)

    selectedConcept.reteica_total = totalReteica
  }

  const handleSelectPaymentConcept = async (id: number) => {
    selectedPaymentConceptId.value = id

    const selectedConcept = paymentConcepts.value.find((c) => c.id === id)

    if (selectedConcept?.reteicas?.length) {
      retentionRows.value = selectedConcept.reteicas.map((reteica) => ({
        ...reteica,
      }))

      await preloadIcaConceptsFromReteicas(retentionRows.value)
    } else {
      await loadReteicas(id)
      await preloadIcaConceptsFromReteicas(reteicas.value)
    }

    emit?.('onSelectPaymentConcept', id)
  }

  const preloadIcaConceptsFromReteicas = async (
    reteicasList: IReteica[] | null | undefined
  ) => {
    const firstCityId = reteicasList?.[0]?.city_id ?? null

    if (!firstCityId) return

    await loadIcaEconomicActivityConcepts(
      firstCityId,
      props.businessId ?? undefined
    )
  }

  const handleAddRetentionRow = () => {
    if (!selectedPaymentConceptId.value) {
      showAlert(
        'Por favor seleccione un concepto de pago antes de agregar una entrada.',
        'warning'
      )
      return
    }

    const newRow = createEmptyReteicaRow()
    retentionRows.value.push(newRow)

    if (emit) {
      emit('onAddRetentionRow')
    }
  }

  const handleDeleteRetentionRow = async (id: number | string) => {
    if (!selectedPaymentConceptId.value) {
      return
    }

    if (typeof id === 'string' && id.startsWith('temp-')) {
      const index = retentionRows.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        retentionRows.value.splice(index, 1)
      }
      updateReteicaTotal()
      return
    }

    if (typeof id === 'number') {
      openMainLoader(true)
      await _deleteReteica(id)
      openMainLoader(false)

      if (selectedPaymentConceptId.value) {
        await loadReteicas(selectedPaymentConceptId.value)
      }
      updateReteicaTotal()
    }

    if (emit) {
      emit('onDeleteRetentionRow', id)
    }
  }

  const handleCityChange = async (
    reteicaId: number | string,
    cityId: number | null
  ) => {
    const reteica = retentionRows.value.find((r) => r.id === reteicaId)
    if (!reteica) return

    reteica.city_id = cityId
    reteica.ica_activity_id = null
    reteica.ica_activity_code = ''
    reteica.percentage = ''
    reteica.retention_value = ''

    await loadIcaEconomicActivityConcepts(cityId, undefined)

    if (emit) {
      emit('onCityChange', reteicaId, cityId, props.businessId || null)
    }
  }

  const calculateRetentionValue = (reteica: IReteica): string => {
    const base = toNumber(reteica.base, 0)
    const percentage = toNumber(reteica.percentage, 0)
    return round2((base * percentage) / 100).toFixed(2)
  }

  const handleConceptReteicaChange = (
    reteica: IReteica,
    conceptId: number | null
  ) => {
    reteica.ica_activity_id = conceptId
    if (reteica.base && reteica.percentage) {
      reteica.retention_value = calculateRetentionValue(reteica)
    }
    if (typeof reteica.id === 'number') {
      handleUpdateReteica(reteica.id, reteica.base, reteica.percentage)
    }
  }

  const handleReteicaFieldChange = (
    reteicaId: number | string,
    field: 'base' | 'percentage',
    value: string
  ) => {
    const reteica = retentionRows.value.find((r) => r.id === reteicaId)
    if (!reteica) return

    reteica[field] = value
    reteica.retention_value = calculateRetentionValue(reteica)
    updateReteicaTotal()

    if (typeof reteicaId === 'number') {
      handleUpdateReteica(reteicaId, reteica.base, reteica.percentage)
    }
  }

  const handleRetentionValueChange = (
    reteicaId: number | string,
    value: string
  ) => {
    const reteica = retentionRows.value.find((r) => r.id === reteicaId)
    if (!reteica) return

    reteica.retention_value = value
    updateReteicaTotal()

    if (typeof reteicaId === 'number') {
      handleUpdateReteica(reteicaId, reteica.base, reteica.percentage)
    }
  }

  const handleSaveReteicas = async (): Promise<boolean> => {
    if (!selectedPaymentConceptId.value) {
      return true
    }

    const newReteicas = retentionRows.value.filter(
      (r) => typeof r.id === 'string' && r.id.startsWith('temp-')
    )

    if (newReteicas.length === 0) {
      return true
    }

    const payload: ICreateReteicasPayload = {
      reteicas: newReteicas.map((r) => ({
        city_id: r.city_id as number,
        ica_activity_id: r.ica_activity_id as number,
        base: toNumber(r.base, 0),
        percentage: toNumber(r.percentage, 0),
      })),
    }

    openMainLoader(true)
    const success = await _createReteicas(
      props.settlementId,
      selectedPaymentConceptId.value,
      payload
    )
    openMainLoader(false)

    if (success) {
      await loadReteicas(selectedPaymentConceptId.value)
      updateReteicaTotal()
    }

    return success
  }

  const handleUpdateReteica = async (
    reteicaId: number,
    base: string,
    percentage: string
  ): Promise<boolean> => {
    const payload: IUpdateReteicaPayload = {
      base,
      percentage,
    }

    openMainLoader(true)
    const success = await _updateReteica(reteicaId, payload)
    openMainLoader(false)

    if (success) {
      if (selectedPaymentConceptId.value) {
        await loadReteicas(selectedPaymentConceptId.value)
      }
      updateReteicaTotal()
    }

    if (emit) {
      emit('onUpdateReteica', reteicaId, base, percentage)
    }

    return success
  }

  // watchers
  watch(
    payment_concepts,
    (newConcepts) => {
      if (newConcepts && Array.isArray(newConcepts)) {
        paymentConcepts.value = newConcepts.map((concept) => ({
          ...concept,
          reteicas: Array.isArray(concept.reteicas) ? concept.reteicas : [],
        }))
      } else {
        paymentConcepts.value = []
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    reteicas,
    (newReteicas) => {
      if (newReteicas && Array.isArray(newReteicas)) {
        retentionRows.value = newReteicas.map((reteica, idx) => ({
          ...reteica,
          index: idx + 1,
        })) as (IReteica & { index?: number })[]
        updateReteicaTotal()
      } else {
        retentionRows.value = []
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    retentionRows,
    (newRows) => {
      newRows.forEach((row, idx) => {
        ;(row as IReteica & { index?: number }).index = idx + 1
      })
      updateReteicaTotal()
    },
    { deep: true }
  )

  // lifecycle hooks
  onMounted(async () => {
    await loadPaymentConcepts()
  })

  return {
    // configs
    paymentConceptsColumns,
    retentionColumns,

    // selects
    cities,
    ica_economic_activity_concepts,

    // refs
    paymentConcepts,
    retentionRows,
    selectedPaymentConceptId,

    // utils
    defaultIconsLucide,

    // methods
    formatCurrency,
    handleSelectPaymentConcept,
    handleAddRetentionRow,
    handleDeleteRetentionRow,
    handleCityChange,
    handleReteicaFieldChange,
    handleRetentionValueChange,
    handleConceptReteicaChange,
    handleSaveReteicas,
    handleUpdateReteica,
  }
}
