import { ref, computed, watch, nextTick } from 'vue'
import { QForm, QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useRules, useUtils } from '@/composables'
import {
  useRegisterFixedIncomeLocalCurrencySaleStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'
import {
  IRegisterFixedIncomeLocalCurrencySalePayload,
  SaleTableRow,
  ITitleLists,
} from '@/interfaces/customs'

const useRegisterFixedIncomeLocalCurrencySaleForm = () => {
  const { watchAndUpdateDescription, formatCurrencyString } = useUtils()
  const { _getIrrSaleValue, _getTitlesList } =
    useRegisterFixedIncomeLocalCurrencySaleStore('v1')

  const resources = useInvestmentPortfolioResourceStore('v1')
  const {
    investment_portfolio,
    operation_type,
    list_emitter_associated_trader,
    list_counterparty_associated_trader,
    compensation_system_list,
  } = storeToRefs(resources)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref<QForm | null>(null)

  const formData = ref<IRegisterFixedIncomeLocalCurrencySalePayload>({
    investment_portfolio_id: null,
    operation_type_id: null,
    portfolio_description: '',
    operation_date: moment().format('YYYY-MM-DD'),
    issuer_id: null,
    purchaser_id: null,
    operation_type_description: '',
    issuer_description: '',
    purchaser_description: '',
    titles: [],
  })

  const selectOptions = computed(() => ({
    investment_portfolio: investment_portfolio.value ?? [],
    operation_type: operation_type.value ?? [],
    issuer: list_emitter_associated_trader.value ?? [],
    purchaser: list_counterparty_associated_trader.value ?? [],
    compensation_system: compensation_system_list.value ?? [],
  }))

  const resetForm = async () => {
    formData.value = {
      investment_portfolio_id: null,
      operation_type_id: null,
      operation_date: moment().format('YYYY-MM-DD'),
      issuer_id: null,
      purchaser_id: null,
      portfolio_description: '',
      operation_type_description: '',
      issuer_description: '',
      purchaser_description: '',
      titles: [],
    }
    selectedRows.value = []
    tableProps.value.rows = []

    await nextTick()
    informationFormRef.value?.resetValidation()
  }

  ;(
    [
      {
        sourceKey: 'operation_type_id',
        optionsKey: 'operation_type',
        descriptionKey: 'operation_type_description',
      },
      {
        sourceKey: 'issuer_id',
        optionsKey: 'issuer',
        descriptionKey: 'issuer_description',
      },
      {
        sourceKey: 'purchaser_id',
        optionsKey: 'purchaser',
        descriptionKey: 'purchaser_description',
      },
    ] as const
  ).forEach(({ sourceKey, optionsKey, descriptionKey }) => {
    watchAndUpdateDescription(
      formData,
      selectOptions,
      sourceKey,
      optionsKey,
      descriptionKey
    )
  })

  const saleValueRules = (row: SaleTableRow) => [
    (val: string) => {
      if (!selectedRows.value.some((r) => r.index === row.index)) return true
      return useRules().is_required(val, 'Campo obligatorio')
    },
    (val: string) => {
      if (!selectedRows.value.some((r) => r.index === row.index)) return true
      return useRules().only_number_with_max_integers_and_decimals(val, 15, 2)
    },
    (val: string) => {
      if (!selectedRows.value.some((r) => r.index === row.index)) return true
      return Number(val) > 0 || 'El valor debe ser mayor a 0'
    },
  ]

  const onSaleValueInput = async (val: string, row: SaleTableRow) => {
    row.sale_value = val.replace(',', '.')
    if (!row.sale_value) return

    const payload = {
      title_id: row.title_id,
      sale_value: Number(row.sale_value),
      operation_date: formData.value.operation_date,
      type_currency: 'local' as const,
    }

    const irr = await _getIrrSaleValue(payload)
    row.tir_sale = irr !== null ? irr : null
  }

  const onTirSaleInput = (val: string, row: SaleTableRow) => {
    const parsed = parseFloat(val.replace(',', '.'))
    row.tir_sale = isNaN(parsed) ? null : parsed
  }

  const compensationSystemRules = (row: SaleTableRow) => [
    (val: string) => {
      if (!selectedRows.value.some((r) => r.index === row.index)) return true
      return useRules().is_required(
        val,
        'El sistema de compensación es obligatorio'
      )
    },
  ]

  const onCompensationSystemInput = (val: string, row: SaleTableRow) => {
    row.compensation_system = val
  }

  const selectedRows = ref<
    {
      index: number
      title_id: number
      title: string
      market_value: number
      sale_value: number | null
      compensation_system: string
      tir_sale: number | null
    }[]
  >([])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: {
      index: number
      title_id: number
      title: string
      market_value: number
      sale_value: number | null
      compensation_system: string
      tir_sale: number | null
    }[]
    pages: { currentPage: number; lastPage: number }
    selection: 'none' | 'single' | 'multiple'
    rowKey: string
  }>({
    title: 'Títulos a vender',
    loading: false,
    columns: [
      {
        name: 'index',
        label: '#',
        field: 'index',
        align: 'left',
        sortable: true,
      },
      {
        name: 'title',
        label: 'Título',
        field: 'title',
        align: 'left',
        sortable: true,
      },
      {
        name: 'market_value',
        label: 'Valor mercado',
        field: (row) =>
          `${
            formatCurrencyString(row.market_value, {
              showCurrencySymbol: false,
            }) ?? '-'
          }`,
        align: 'left',
        sortable: true,
      },
      {
        name: 'sale_value',
        label: 'Valor venta',
        field: 'sale_value',
        align: 'left',
        sortable: true,
      },
      {
        name: 'compensation_system',
        label: 'Sistema compensación',
        field: 'compensation_system',
        align: 'left',
        sortable: true,
      },
      {
        name: 'tir_sale',
        label: 'TIR venta',
        field: 'tir_sale',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
    selection: 'single',
    rowKey: 'index',
  })

  // Gestiona dependencias del portafolio
  watch(
    () => formData.value.investment_portfolio_id,
    async (newVal) => {
      _resetKeys({ investment_portfolio: ['list_emitter_associated_trader'] })
      formData.value.portfolio_description = ''
      formData.value.issuer_id = null

      if (!newVal) return

      const portfolio = selectOptions.value.investment_portfolio.find(
        ({ value }) => value === newVal
      )

      // Campos derivados del portafolio
      formData.value.portfolio_description = portfolio?.description ?? ''

      // Actualiza emisores asociados al portafolio
      await _getResources(
        { investment_portfolio: ['list_emitter_associated_trader'] },
        `filter[investment_portfolio_id]=${newVal}`
      )
    }
  )

  watch(
    () => formData.value.issuer_id,
    async (newVal) => {
      if (!newVal) {
        tableProps.value.rows = []
        return
      }
      tableProps.value.loading = true
      const titles = await _getTitlesList(newVal, 'local_fixed')
      if (titles) {
        tableProps.value.rows = titles.map((t: ITitleLists, index: number) => ({
          index: index + 1,
          title_id: t.id,
          title: `${t.id} - ${t.issuers_counterparty_id}`,
          market_value: t.unit_value,
          sale_value: null,
          compensation_system: '',
          tir_sale: 0,
        }))
      } else {
        tableProps.value.rows = []
      }
      tableProps.value.loading = false
    }
  )

  const getValues = () => {
    const titlesMapped = selectedRows.value.map((row) => ({
      title_id: row.title_id,
      market_value: row.market_value,
      sale_value: row.sale_value,
      compensation_system: row.compensation_system,
      irr_sale: row.tir_sale ? Number(row.tir_sale) : undefined,
    }))

    return {
      ...formData.value,
      titles: titlesMapped,
    }
  }

  return {
    informationFormRef,
    formData,
    selectOptions,
    selectedRows,
    tableProps,
    resetForm,
    compensationSystemRules,
    onCompensationSystemInput,
    onTirSaleInput,
    saleValueRules,
    onSaleValueInput,
    getValues,
  }
}

export default useRegisterFixedIncomeLocalCurrencySaleForm
