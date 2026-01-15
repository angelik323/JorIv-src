// Vue
import { ref, watch, computed } from 'vue'
import Big from 'big.js'

// Interfaces
import {
  EXCLUDED_CALCULATION_TYPES,
  EXCLUDED_CLASS_IDS,
  ICommissionCalculationCommissionListV2,
  ICommissionCalculationFormV2,
  PERIODICITY,
} from '@/interfaces/customs/settlement-commissions/CommissionCalculationV2'
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import { QTableColumn } from 'quasar'

// Composables
import {
  useBigNumbers,
  useCalendarRules,
  useUtils,
  useUtilsCalendarMethods,
} from '@/composables'

const useListCommissionForm = (
  props: {
    action: ActionType
    data: ICommissionCalculationFormV2 | null
    commissions: ICommissionCalculationFormV2['commissions']
  },
  emit: Function
) => {
  const { formatCurrencyString, formatDate } = useUtils()
  const { addDays } = useUtilsCalendarMethods()
  const { is_after, is_before } = useCalendarRules()
  const { createBigNumber, multiply, sum, minusMany } = useBigNumbers()

  const formInformation = ref()

  const initialModelsValues: Partial<ICommissionCalculationFormV2> = {
    commissions: [],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const isExcludedClass = computed(() =>
    EXCLUDED_CLASS_IDS.includes(props.data?.commission_class_catalog_id ?? 0)
  )

  const isTransactionCalculationType = computed(
    () =>
      props.data?.calculation_type?.toLowerCase() === 'valor por transacción'
  )

  const isManualOrTransactionType = computed(() =>
    EXCLUDED_CALCULATION_TYPES.includes(
      props.data?.calculation_type?.toLowerCase() ?? 'manual'
    )
  )

  const createConditionalColumn = (
    name: string,
    label: string,
    field: keyof ICommissionCalculationCommissionListV2,
    condition: boolean,
    format?: boolean
  ) => {
    return condition
      ? [
          {
            name,
            required: false,
            label,
            align: 'left' as const,
            field,
            format: format
              ? (val: number | null) => formatCurrencyString(val) ?? '-'
              : undefined,
            sortable: true,
          },
        ]
      : []
  }

  const columns = computed<
    QTableColumn<ICommissionCalculationCommissionListV2>[]
  >(() => [
    {
      name: 'id',
      required: true,
      label: '#',
      align: 'left' as const,
      field: 'id',
      sortable: true,
    },
    {
      name: 'period',
      required: true,
      label: 'Periodo',
      align: 'left' as const,
      field: (row) => `${row.period_start} - ${row.period_end}`,
      sortable: true,
    },
    ...createConditionalColumn(
      'calculation_base',
      'Base del cálculo',
      'calculation_base',
      !isExcludedClass.value
    ),
    ...createConditionalColumn(
      'base_amount',
      'Valor base',
      'base_amount',
      !isExcludedClass.value && !isTransactionCalculationType.value,
      true
    ),
    ...createConditionalColumn(
      'commission_percentage',
      'Porcentaje de comisión (%)',
      'commission_percentage',
      !isExcludedClass.value && !isManualOrTransactionType.value
    ),
    ...createConditionalColumn(
      'commission_percentage',
      'Comisión por transacción',
      'commission_percentage',
      isTransactionCalculationType.value,
      true
    ),
    ...createConditionalColumn(
      'count_transaction',
      'Cantidad de transacciones',
      'count_transaction',
      isTransactionCalculationType.value
    ),
    {
      name: 'commission_value',
      required: true,
      label: 'Valor de comisión',
      align: 'left' as const,
      field: (val) =>
        formatCurrencyString(val.commission_value?.toString()) ?? '-',
      sortable: true,
    },
    {
      name: 'iva_amount',
      required: false,
      label: 'IVA',
      align: 'left' as const,
      field: (val) => formatCurrencyString(val.iva_amount?.toString()) ?? '-',
      sortable: true,
    },
    {
      name: 'retefuente_amount',
      required: false,
      label: 'Retefuente',
      align: 'left' as const,
      field: (val) =>
        formatCurrencyString(val.retefuente_amount?.toString()) ?? '-',
      sortable: true,
    },
    {
      name: 'reteica_amount',
      required: false,
      label: 'ReteICA',
      align: 'left' as const,
      field: (val) =>
        formatCurrencyString(val.reteica_amount?.toString()) ?? '-',
      sortable: true,
    },
    {
      name: 'reteiva_amount',
      required: false,
      label: 'ReteIVA',
      align: 'left' as const,
      field: (val) =>
        formatCurrencyString(val.reteiva_amount?.toString()) ?? '-',
      sortable: true,
    },
    {
      name: 'total_amount',
      required: false,
      label: 'Valor total',
      align: 'left' as const,
      field: (val) => formatCurrencyString(val.total_amount?.toString()) ?? '-',
      sortable: true,
    },
  ])

  const tableProperties = ref<
    IBaseTableProps<ICommissionCalculationCommissionListV2>
  >({
    title: 'Listado de comisiones',
    loading: false,
    wrapCells: true,
    columns: columns.value,
    rows: models.value.commissions ?? [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const calculatePeriodEnd = (
    currentStartStr: string,
    periodicity: string,
    endDateStr: string
  ): string => {
    let nextEnd = currentStartStr

    switch (periodicity) {
      case PERIODICITY.SINGLE:
        nextEnd = endDateStr
        break
      case PERIODICITY.DAILY:
        nextEnd = addDays(currentStartStr, 1, 'days')
        break
      case PERIODICITY.BIWEEKLY:
        nextEnd = addDays(currentStartStr, 14, 'days')
        break
      case PERIODICITY.MONTHLY:
        nextEnd = addDays(currentStartStr, 1, 'months')
        break
      case PERIODICITY.BIMONTHLY:
        nextEnd = addDays(currentStartStr, 2, 'months')
        break
      case PERIODICITY.QUARTERLY:
        nextEnd = addDays(currentStartStr, 3, 'months')
        break
      case PERIODICITY.SEMIANNUAL:
        nextEnd = addDays(currentStartStr, 6, 'months')
        break
      case PERIODICITY.ANNUAL:
        nextEnd = addDays(currentStartStr, 1, 'years')
        break
    }

    return is_after(nextEnd, endDateStr) ? endDateStr : nextEnd
  }

  const calculateTaxes = (baseAmount: Big) => {
    const data = props.data

    const normalizePercentage = (p: number): number => {
      if (!Number.isFinite(p)) return 0
      if (p > 1) return p / 100
      return p
    }

    const calculateTax = (
      condition: string | boolean | null | undefined,
      percentage: number | null | undefined
    ) => {
      if (!condition || condition?.toString()?.toLowerCase() !== 'si') {
        return createBigNumber(0)
      }
      const percentageNormalized = normalizePercentage(percentage || 0)
      return multiply(baseAmount, percentageNormalized)
    }

    return {
      iva_amount: calculateTax(data?.generate_iva, data?.iva),
      retefuente_amount: calculateTax(
        data?.generated_source,
        data?.source_percentage
      ),
      reteica_amount: calculateTax(data?.generated_ica, data?.ica_percentage),
      reteiva_amount: calculateTax(
        data?.generated_network_iva,
        data?.network_iva_percentage
      ),
    }
  }

  const calculateCommissionValue = (
    data: ICommissionCalculationFormV2 | null
  ): Big => {
    if (!data?.calculation_type) return createBigNumber(0)

    const calculationType = data.calculation_type?.toLowerCase()

    if (calculationType?.includes('salario')) {
      const minimumWage = createBigNumber(data.minimum_wage_amount || 0)
      const countSalaries = createBigNumber(data.count_salaries || 0)
      return multiply(minimumWage, countSalaries)
    }

    if (calculationType?.includes('fijo') || data.fixed_value) {
      return createBigNumber(data.fixed_value || 0)
    }

    if (calculationType?.includes('transacción')) {
      const commissionPerTransaction = createBigNumber(
        data.commission_transaction || 0
      )
      const countTransactions = createBigNumber(data.count_salaries || 0)
      return multiply(commissionPerTransaction, countTransactions)
    }

    if (data.commission_percentage) {
      const baseAmount = createBigNumber(data.base_commission_amount || 0)
      const percentage = createBigNumber(data.commission_percentage || 0)
      return multiply(baseAmount, percentage)
    }

    return createBigNumber(data.base_commission_amount || 0)
  }

  const buildCommissionRow = (
    baseAmount: Big,
    periodStart: string,
    periodEnd: string,
    id: number
  ): ICommissionCalculationCommissionListV2 => {
    const taxes = calculateTaxes(baseAmount)

    const sumIvaAndBase = sum(baseAmount, taxes.iva_amount)
    const total_value = minusMany(
      sumIvaAndBase,
      taxes.retefuente_amount,
      taxes.reteica_amount,
      taxes.reteiva_amount
    )

    return {
      ...taxes,
      id,
      period_start: periodStart,
      period_end: periodEnd,
      base_amount: baseAmount.toString(),
      iva_percentage: props.data?.iva ?? 0,
      iva_amount: taxes.iva_amount,
      total_amount: total_value,
      retefuente_amount: taxes.retefuente_amount,
      reteica_amount: taxes.reteica_amount,
      reteiva_amount: taxes.reteiva_amount,
      retefuente_percentage: props.data?.source_percentage ?? 0,
      reteica_percentage: props.data?.ica_percentage ?? 0,
      reteiva_percentage: props.data?.network_iva_percentage ?? 0,
      commission_percentage: props.data?.commission_percentage ?? 0,
      transaction_commission: props.data?.commission_transaction ?? 0,
      count_transaction: props.data?.count_transaction ?? 0,
      calculation_base: props.data?.calculation_type ?? '',
      commission_value: baseAmount,
    }
  }

  const generatePeriods = (
    periodicity: string,
    startDate: string,
    endDate: string
  ): ICommissionCalculationCommissionListV2[] => {
    if (!startDate || !endDate || !periodicity) return []

    const periods: ICommissionCalculationCommissionListV2[] = []
    let currentStart = startDate

    while (is_before(currentStart, endDate)) {
      const currentEnd = calculatePeriodEnd(currentStart, periodicity, endDate)

      const periodStart = formatDate(currentStart.toString(), 'YYYY-MM-DD')
      const periodEnd = formatDate(currentEnd.toString(), 'YYYY-MM-DD')

      const commission_value = calculateCommissionValue(props.data)

      periods.push(
        buildCommissionRow(
          commission_value,
          periodStart,
          periodEnd,
          periods.length + 1
        )
      )

      if (periodicity === PERIODICITY.SINGLE) break
      if (currentEnd === currentStart) break

      currentStart = currentEnd
    }

    return periods
  }

  const updateTableRows = () => {
    if (
      props.data?.calculation_type === 'Manual' &&
      props.data?.commissions?.length
    )
      return

    const { start_date_period, end_date_period, periodicity } = props.data ?? {}

    if (!start_date_period || !end_date_period || !periodicity) {
      tableProperties.value.rows = []
      return
    }

    const periods = generatePeriods(
      periodicity,
      start_date_period,
      end_date_period
    )

    models.value.commissions = periods
  }

  const updateBaseValue = (rowId: number, newBaseValue: string | null) => {
    if (!models.value?.commissions) return
    const rowIndex = models.value.commissions?.findIndex(
      (row) => row.id === rowId
    )

    if (rowIndex === -1) return

    const oldRow = models.value.commissions[rowIndex]
    const parsedBaseValue = createBigNumber(newBaseValue || 0)
    const updatedRow = buildCommissionRow(
      parsedBaseValue,
      oldRow.period_start,
      oldRow.period_end,
      oldRow.id
    )
    models.value.commissions[rowIndex] = updatedRow
  }

  const _setValueModel = (
    commissions: ICommissionCalculationFormV2['commissions']
  ) => {
    models.value.commissions = Array.isArray(commissions) ? commissions : []
  }

  watch(
    () => props.commissions,
    (newVal) => {
      if (!newVal) return
      _setValueModel(newVal)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.commissions,
    (newVal) => {
      emit('update:commissions', Array.isArray(newVal) ? newVal : [])
    },
    { deep: true }
  )

  watch(
    () => [
      props.data?.periodicity,
      props.data?.start_date_period,
      props.data?.end_date_period,
    ],
    () => {
      if (['edit', 'view'].includes(props.action)) return
      updateTableRows()
    },
    { immediate: true }
  )

  watch(
    () => models.value?.commissions,
    (newVal) => {
      tableProperties.value.rows = newVal ?? []
    },
    { immediate: true, deep: true }
  )

  watch(
    columns,
    (newColumns) => {
      tableProperties.value.columns = newColumns
    },
    { immediate: true }
  )

  return {
    formInformation,
    tableProperties,
    formatCurrencyString,
    updateBaseValue,
  }
}

export default useListCommissionForm
