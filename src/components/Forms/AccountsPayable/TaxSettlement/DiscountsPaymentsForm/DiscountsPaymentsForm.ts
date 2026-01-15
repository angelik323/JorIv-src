// Vue - Pinia
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IDiscountPayment,
  IDiscountEntry,
  ICreateDiscountEntryPayload,
  IUpdateDiscountEntryPayload,
} from '@/interfaces/customs/accounts-payable/TaxSettlement'
import { IGenericResource, ISelectorResources } from '@/interfaces/customs'

// Composables
import { useUtils, useMainLoader, useAlert } from '@/composables'

// Stores
import { useTaxSettlementStore } from '@/stores/accounts-payable/tax-settlement'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'

export const useDiscountsPaymentsForm = (
  props: {
    settlementId: number
    businessId?: number | null
    netValue?: string
  },
  emit?: Function
) => {
  const { formatCurrencyString, defaultIconsLucide, toNumber, round2 } =
    useUtils()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const { _getResources } = useResourceManagerStore('v1')

  const {
    _getDiscountPayments,
    _getDiscountEntries,
    _createDiscountEntry,
    _updateDiscountEntry,
    _deleteDiscountPayment,
  } = useTaxSettlementStore('v1')
  const { discount_payments, discount_entries } = storeToRefs(
    useTaxSettlementStore('v1')
  )

  const { settlement_concepts_by_structure_and_type } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  // refs
  const selectedDiscountPaymentId = ref<number | null>(null)
  const discountPaymentRows = ref<IDiscountPayment[]>([])
  const discountRows = ref<IDiscountEntry[]>([])
  const netValue = ref(props.netValue || '0')
  const discountPaymentTypes = ref<ISelectorResources[]>([])
  const settlementConceptsByStructureAndType = ref<IGenericResource[]>([])
  const settlementConceptsByStructureAndTypeResourceKeys = {
    accounts_payable: ['settlement_concepts_by_structure_and_type'],
  }

  const discountPaymentColumns = [
    {
      name: 'radio',
      label: '',
      field: 'radio',
      align: 'center' as const,
      sortable: true,
    },
    {
      name: 'id',
      label: '#',
      field: 'id',
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
      name: 'base',
      label: 'Base',
      field: 'base',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'percentage',
      label: 'Porcentaje',
      field: 'percentage',
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
  ]

  const discountColumns = [
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
      name: 'concept',
      label: 'Concepto',
      field: 'concept',
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
      name: 'base',
      label: 'Base',
      field: 'base',
      align: 'left' as const,
      sortable: true,
    },
    {
      name: 'percentage',
      label: 'Porcentaje',
      field: 'percentage',
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
      name: 'actions',
      label: 'Acciones',
      field: 'actions',
      align: 'center' as const,
      sortable: true,
    },
  ]

  const formatCurrency = (value: string | number): string => {
    return formatCurrencyString(value, { showCurrencySymbol: false }) || '0,00'
  }

  const loadDiscountPayments = async () => {
    if (discount_payments.value !== null) return

    openMainLoader(true)
    await _getDiscountPayments(props.settlementId)
    openMainLoader(false)
  }

  const loadDiscountEntries = async (discountPaymentId: number) => {
    openMainLoader(true)
    await _getDiscountEntries(props.settlementId, discountPaymentId)
    openMainLoader(false)
  }

  const loadDiscountPaymentResources = async () => {
    if (discountPaymentTypes.value.length === 0) {
      discountPaymentTypes.value = [
        { label: 'Descuentos', value: 'Descuentos' },
        { label: 'Pagos', value: 'Pagos' },
      ] as ISelectorResources[]
    }
  }

  const loadSettlementConceptsByStructureAndType = async (
    type: string,
    accountingStructureId?: number | null
  ) => {
    if (!accountingStructureId || !props.businessId) {
      settlementConceptsByStructureAndType.value = []
      return
    }

    const params = new URLSearchParams()
    params.set(`filter[accounting_structure_id]`, String(accountingStructureId))
    params.set(`filter[type]`, type)

    if (type === 'PAGO') {
      params.set(`filter[class]`, 'OTR')
    }

    openMainLoader(true)
    await _getResources(
      settlementConceptsByStructureAndTypeResourceKeys,
      params.toString()
    )
    openMainLoader(false)
    settlementConceptsByStructureAndType.value =
      settlementConceptsByStructureAndType.value || []
  }

  const calculateValue = (base: string, percentage: string): string => {
    const baseNum = toNumber(base, 0)
    const percentageNum = toNumber(percentage, 0)
    return round2((baseNum * percentageNum) / 100).toFixed(2)
  }

  const createEmptyDiscountRow = (): IDiscountEntry & { index?: number } => {
    const tempId = `temp-discount-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 11)}`

    return {
      id: tempId as unknown as number,
      type: '',
      settlement_concept_id: 0,
      fiscal_charge_id: null,
      base: '',
      percentage: '',
      value: '0.00',
    }
  }

  const handleSelectDiscountPayment = async (id: number) => {
    selectedDiscountPaymentId.value = id
    await loadDiscountEntries(id)

    if (emit) {
      emit('onSelectDiscountPayment', id)
    }
  }

  const handleAddDiscountRow = () => {
    if (!selectedDiscountPaymentId.value) {
      showAlert(
        'Por favor seleccione un descuento/pago antes de agregar una entrada.',
        'warning'
      )
      return
    }

    const newRow = createEmptyDiscountRow()
    newRow.index = discountRows.value.length + 1
    discountRows.value.push(newRow)
    discountRows.value.forEach((row, idx) => {
      ;(row as IDiscountEntry & { index?: number }).index = idx + 1
    })
  }

  const handleDeleteDiscountRow = async (id: number | string) => {
    if (!selectedDiscountPaymentId.value) {
      return
    }

    const idString = String(id)
    if (idString.startsWith('temp-discount-')) {
      const index = discountRows.value.findIndex(
        (r: IDiscountEntry) => String(r.id) === idString
      )
      if (index !== -1) {
        discountRows.value.splice(index, 1)
        discountRows.value.forEach((row, idx) => {
          ;(row as IDiscountEntry & { index?: number }).index = idx + 1
        })
      }
      return
    }

    if (typeof id === 'number' && id > 0) {
      openMainLoader(true)
      await _deleteDiscountPayment(id)
      openMainLoader(false)

      if (selectedDiscountPaymentId.value) {
        await loadDiscountEntries(selectedDiscountPaymentId.value)
      }
    }

    if (emit) {
      emit('onDeleteDiscountRow', id)
    }
  }

  const handleUpdateBase = (
    row: IDiscountEntry,
    value: string,
    netValueNum: number
  ) => {
    const baseNum = toNumber(value, 0)

    if (baseNum > netValueNum) {
      showAlert(
        'La base no puede ser superior al valor neto. Por favor, ingrese un valor igual o menor.',
        'warning'
      )
      return
    }

    row.base = value
    row.value = calculateValue(row.base, row.percentage)
  }

  const handleUpdatePercentage = async (row: IDiscountEntry, value: string) => {
    row.percentage = value
    row.value = calculateValue(row.base, row.percentage)

    if (typeof row.id === 'number' && row.id > 0) {
      await handleUpdateDiscountEntry(row.id, row.base, row.percentage)
    }

    if (emit) {
      emit('onUpdateDiscountEntry', row.id, row.base, row.percentage)
    }
  }

  const handleValueChange = async (row: IDiscountEntry, value: string) => {
    row.value = value

    if (typeof row.id === 'number' && row.id > 0) {
      await handleUpdateDiscountEntry(row.id, row.base, row.percentage)
    }

    if (emit) {
      emit('onUpdateDiscountEntry', row.id, row.base, row.percentage)
    }
  }

  const handleUpdateDiscountEntry = async (
    entryId: number,
    base: string,
    percentage: string
  ): Promise<boolean> => {
    const payload: IUpdateDiscountEntryPayload = {
      base,
      percentage,
    }

    openMainLoader(true)
    const success = await _updateDiscountEntry(entryId, payload)
    openMainLoader(false)

    if (success && selectedDiscountPaymentId.value) {
      await loadDiscountEntries(selectedDiscountPaymentId.value)
    }

    return success
  }

  const handleSaveDiscountEntries = async (): Promise<boolean> => {
    if (!selectedDiscountPaymentId.value) {
      return true
    }

    const newEntries = discountRows.value.filter(
      (e: IDiscountEntry) =>
        typeof e.id === 'string' && String(e.id).startsWith('temp-discount-')
    )

    if (newEntries.length === 0) {
      return true
    }

    let allSuccess = true
    openMainLoader(true)

    for (const entry of newEntries) {
      const payload: ICreateDiscountEntryPayload = {
        type: entry.type,
        settlement_concept_id: entry.settlement_concept_id,
        fiscal_charge_id: entry.fiscal_charge_id,
        base: entry.base,
        percentage: entry.percentage,
      }

      const success = await _createDiscountEntry(
        props.settlementId,
        selectedDiscountPaymentId.value,
        payload
      )

      if (!success) {
        allSuccess = false
      }
    }

    openMainLoader(false)

    if (allSuccess && selectedDiscountPaymentId.value) {
      await loadDiscountEntries(selectedDiscountPaymentId.value)
    }

    return allSuccess
  }

  const handleTypeChange = async (row: IDiscountEntry, type: string) => {
    row.type = type
    row.settlement_concept_id = 0
    row.fiscal_charge_id = null
    await loadSettlementConceptsByStructureAndType(type, null)

    if (emit) {
      emit('onTypeChange', type)
    }
  }

  const handleConceptChange = async (
    row: IDiscountEntry,
    conceptId: number | null
  ) => {
    row.settlement_concept_id = conceptId || 0

    if (conceptId && settlement_concepts_by_structure_and_type.value) {
      const conceptDetail = settlement_concepts_by_structure_and_type
        .value[0] as IGenericResource & {
        percentage?: number | string
        fiscal_charge_id?: number | null
      }
      if (conceptDetail && conceptDetail.percentage !== undefined) {
        row.percentage = String(conceptDetail.percentage)
      }
      if (conceptDetail && conceptDetail.fiscal_charge_id !== undefined) {
        row.fiscal_charge_id = conceptDetail.fiscal_charge_id as number | null
      }
      const baseNum = toNumber(row.base, 0)
      const percentageNum = toNumber(row.percentage, 0)
      row.value = round2((baseNum * percentageNum) / 100).toFixed(2)
    }

    if (emit) {
      emit('onConceptChange', conceptId, row)
    }
  }

  // watchers
  watch(
    discount_payments,
    (newDiscountPayments) => {
      if (newDiscountPayments && Array.isArray(newDiscountPayments)) {
        discountPaymentRows.value = newDiscountPayments.map((dp) => ({
          ...dp,
        }))
      } else {
        discountPaymentRows.value = []
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    discount_entries,
    (newDiscountEntries) => {
      if (newDiscountEntries && Array.isArray(newDiscountEntries)) {
        discountRows.value = newDiscountEntries.map((de, idx) => ({
          ...de,
          index: idx + 1,
        })) as (IDiscountEntry & { index?: number })[]
      } else {
        discountRows.value = []
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    discountRows,
    (newRows) => {
      newRows.forEach((row, idx) => {
        ;(row as IDiscountEntry & { index?: number }).index = idx + 1
      })
    },
    { deep: false }
  )

  watch(
    () => props.netValue,
    (newValue) => {
      if (newValue !== undefined && newValue !== null && newValue !== '') {
        netValue.value = newValue
      }
    },
    { immediate: true }
  )

  // lifecycle hooks
  onMounted(async () => {
    await loadDiscountPaymentResources()
    await loadDiscountPayments()
  })

  return {
    // configs
    discountPaymentColumns,
    discountColumns,

    // selects
    discountPaymentTypes,
    settlementConceptsByStructureAndType,
    settlement_concepts_by_structure_and_type,

    // refs
    discountPaymentRows,
    discountRows,
    selectedDiscountPaymentId,
    netValue,

    // utils
    defaultIconsLucide,

    // methods
    formatCurrency,
    handleSelectDiscountPayment,
    handleAddDiscountRow,
    handleDeleteDiscountRow,
    handleUpdateBase,
    handleUpdatePercentage,
    handleValueChange,
    handleUpdateDiscountEntry,
    handleSaveDiscountEntries,
    handleTypeChange,
    handleConceptChange,
  }
}
