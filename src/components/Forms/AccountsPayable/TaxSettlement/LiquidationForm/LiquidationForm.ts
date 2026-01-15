// Vue - Pinia
import { ref, watch } from 'vue'

// Interfaces
import { ITaxSettlementItem } from '@/interfaces/customs/accounts-payable/TaxSettlement'

// Composables
import { useUtils } from '@/composables'

export const useLiquidationForm = (
  props: {
    data?: {
      settlementRows?: ITaxSettlementItem[]
      netValue?: string
      settlementConceptTypes?: { label: string; value: string | number }[]
      fiscalCharges?: { label: string; value: string | number }[]
      settlementConcepts?: { label: string; value: string | number }[]
    } | null
  },
  emit?: Function
) => {
  const { formatCurrencyString, defaultIconsLucide, toNumber, round2 } =
    useUtils()

  // refs
  const settlementConceptTypes = ref<
    { label: string; value: string | number }[]
  >(props.data?.settlementConceptTypes || [])
  const fiscalCharges = ref<{ label: string; value: string | number }[]>(
    props.data?.fiscalCharges || []
  )
  const settlementConcepts = ref<{ label: string; value: string | number }[]>(
    props.data?.settlementConcepts || []
  )
  const settlementRows = ref<ITaxSettlementItem[]>([])
  const netValue = ref(props.data?.netValue || '0')
  const isUpdatingFromProps = ref(false)

  const originalValues = new Map<
    number | string,
    { base: string; percentage: string }
  >()

  const settlementColumns = [
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
      name: 'new_settlement_value',
      label: 'Valor nueva liquidación',
      field: 'new_liquidation_value',
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

  const createEmptyRow = (): ITaxSettlementItem & { index?: number } => {
    const tempId = `temp-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`
    return {
      id: tempId,
      type: '',
      fiscal_charge_id: null,
      fiscal_charge: '',
      settlement_concept_id: 0,
      concept: '',
      base: '',
      percentage: '',
      value: '0.00',
      new_liquidation_value: '',
      index: settlementRows.value.length + 1,
    }
  }

  const formatCurrency = (value: string | number): string => {
    return formatCurrencyString(value, { showCurrencySymbol: false }) || '0,00'
  }

  const formatNumber = (value: string | number): string => {
    return formatCurrencyString(value, { showCurrencySymbol: false }) || '0,00'
  }

  const calculateRowValue = (row: ITaxSettlementItem): string => {
    const base = toNumber(row.base, 0)
    const percentage = toNumber(row.percentage, 0)
    return round2((base * percentage) / 100).toFixed(2)
  }

  const calculateNetValue = () => {
    const total = settlementRows.value.reduce((sum, row) => {
      const value = toNumber(row.new_liquidation_value || row.value, 0)
      return sum + value
    }, 0)
    netValue.value = round2(total).toFixed(2)
  }

  const updateRowBase = (row: ITaxSettlementItem, value: string) => {
    row.base = value
    row.value = calculateRowValue(row)
    if (!row.new_liquidation_value || row.new_liquidation_value === '0.00') {
      row.new_liquidation_value = row.value
    }
    calculateNetValue()
    if (emit) emit('onUpdateRows', settlementRows.value)
  }

  const updateRowType = (row: ITaxSettlementItem, value: string | number) => {
    const previousType = row.type
    const newType = value as string

    if (previousType && previousType !== 'Base' && newType === 'Base') {
      originalValues.set(row.id, {
        base: row.base || '',
        percentage: row.percentage || '',
      })
      row.percentage = ''
      row.value = '0.00'
      if (!row.new_liquidation_value || row.new_liquidation_value === '0.00') {
        row.new_liquidation_value = '0.00'
      }
    } else if (previousType === 'Base' && newType !== 'Base') {
      const savedValues = originalValues.get(row.id)
      if (savedValues) {
        row.base = savedValues.base
        row.percentage = savedValues.percentage
        row.value = calculateRowValue(row)
        if (
          !row.new_liquidation_value ||
          row.new_liquidation_value === '0.00'
        ) {
          row.new_liquidation_value = row.value
        }
        originalValues.delete(row.id)
      }
    }

    row.type = newType
    calculateNetValue()
    if (emit) emit('onUpdateRows', settlementRows.value)
  }

  const updateRowFiscalCharge = (
    row: ITaxSettlementItem,
    value: string | number | null
  ) => {
    row.fiscal_charge_id =
      value === null || value === undefined ? null : (Number(value) as number)
  }

  const updateRowConcept = (
    row: ITaxSettlementItem,
    value: string | number | null
  ) => {
    row.settlement_concept_id =
      value === null || value === undefined ? 0 : (Number(value) as number)
  }

  const updateRowPercentage = (row: ITaxSettlementItem, value: string) => {
    row.percentage = value
    row.value = calculateRowValue(row)
    if (!row.new_liquidation_value || row.new_liquidation_value === '0.00') {
      row.new_liquidation_value = row.value
    }
    calculateNetValue()
    if (emit) emit('onUpdateRows', settlementRows.value)
  }

  const updateNewLiquidationValue = (
    row: ITaxSettlementItem,
    value: string
  ) => {
    row.new_liquidation_value = value
    calculateNetValue()
    if (emit) emit('onUpdateRows', settlementRows.value)
  }

  const handleAddRow = () => {
    const newRow = createEmptyRow()
    settlementRows.value.push(newRow)
    settlementRows.value.forEach((row, idx) => {
      ;(row as ITaxSettlementItem & { index?: number }).index = idx + 1
    })
    if (emit) emit('onUpdateRows', settlementRows.value)
  }

  const handleDeleteRow = async (id: number) => {
    originalValues.delete(id)
    if (emit) {
      emit('onDeleteRow', id)
    }
  }

  // watchers
  watch(
    () => props.data?.settlementRows,
    (newRows) => {
      if (newRows && Array.isArray(newRows)) {
        if (newRows.length > 0) {
          const currentIds = settlementRows.value.map((r) => r.id).sort()
          const newIds = newRows.map((r) => r.id).sort()
          const idsEqual =
            currentIds.length === newIds.length &&
            currentIds.every((id, idx) => id === newIds[idx])

          if (!idsEqual) {
            isUpdatingFromProps.value = true
            originalValues.clear()
            settlementRows.value = newRows.map((item, idx) => ({
              ...item,
              index: idx + 1,
            })) as (ITaxSettlementItem & { index?: number })[]
            calculateNetValue()
            setTimeout(() => {
              isUpdatingFromProps.value = false
            }, 100)
          }
        } else {
          isUpdatingFromProps.value = true
          originalValues.clear()
          settlementRows.value = [
            { ...createEmptyRow(), index: 1 },
          ] as (ITaxSettlementItem & { index?: number })[]
          netValue.value = '0'
          setTimeout(() => {
            isUpdatingFromProps.value = false
          }, 100)
        }
      } else if (!newRows) {
        isUpdatingFromProps.value = true
        originalValues.clear()
        settlementRows.value = [
          { ...createEmptyRow(), index: 1 },
        ] as (ITaxSettlementItem & { index?: number })[]
        netValue.value = '0'
        setTimeout(() => {
          isUpdatingFromProps.value = false
        }, 100)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    settlementRows,
    (newRows) => {
      newRows.forEach((row, idx) => {
        ;(row as ITaxSettlementItem & { index?: number }).index = idx + 1
      })
    },
    { deep: false }
  )

  watch(
    () => props.data?.settlementConceptTypes,
    (newVal) => {
      if (newVal && Array.isArray(newVal)) {
        settlementConceptTypes.value = [...newVal]
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => props.data?.fiscalCharges,
    (newVal) => {
      if (newVal && Array.isArray(newVal)) {
        fiscalCharges.value = [...newVal]
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => props.data?.settlementConcepts,
    (newVal) => {
      if (newVal && Array.isArray(newVal)) {
        settlementConcepts.value = [...newVal]
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => props.data?.netValue,
    (newValue) => {
      if (newValue !== undefined && newValue !== null && newValue !== '') {
        netValue.value = newValue
      }
    },
    { immediate: true }
  )

  watch(
    settlementRows,
    () => {
      if (!isUpdatingFromProps.value) {
        calculateNetValue()
      }
    },
    { deep: true }
  )

  return {
    // configs
    settlementColumns,

    // refs
    settlementRows,
    netValue,
    settlementConceptTypes,
    fiscalCharges,
    settlementConcepts,

    // utils
    defaultIconsLucide,

    // methods
    updateRowBase,
    updateRowPercentage,
    updateNewLiquidationValue,
    updateRowType,
    updateRowFiscalCharge,
    updateRowConcept,
    handleAddRow,
    handleDeleteRow,
    formatCurrency,
    formatNumber,
  }
}
