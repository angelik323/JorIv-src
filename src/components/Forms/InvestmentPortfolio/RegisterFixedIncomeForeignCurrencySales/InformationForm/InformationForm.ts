import { computed, ref, watch } from 'vue'
import { QForm, QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useRules, useUtils } from '@/composables'
import {
  useInvestmentPortfolioResourceStore,
  useRegisterFixedIncomeForeignCurrencySaleStore,
  useResourceManagerStore,
} from '@/stores'
import {
  ICompensationSystemResource,
  IRegisterFixedIncomeForeignCurrencySalePayload,
  IOperationT,
  IRegisterFixedIncomeForeignCurrencySaleTitle,
  SaleTableRows,
} from '@/interfaces/customs'

const useRegisterFixedIncomeForeignCurrencySaleForm = () => {
  const { watchAndUpdateDescription } = useUtils()
  const resources = useInvestmentPortfolioResourceStore('v1')
  const {
    _getIrrSaleValue,
    _getTitlesList,
    _setCurrencyDescription,
    _setPaperTypeId,
    _setNumberDays,
    _setNegotiation,
    _setCurrencyValue,
  } = useRegisterFixedIncomeForeignCurrencySaleStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    investment_portfolio,
    operation_type,
    list_emitter_associated_trader,
    list_counterparty_associated_trader,
    compensation_system_list,
  } = storeToRefs(resources)

  const informationFormRef = ref<QForm | null>(null)
  const showDays = ref<boolean>(false)
  const titles = ref<IRegisterFixedIncomeForeignCurrencySaleTitle[] | null>([])

  const formData = ref<IRegisterFixedIncomeForeignCurrencySalePayload>({
    investment_portfolio_id: null,
    operation_type_id: null,
    operation_date: moment().format('YYYY-MM-DD'),
    negotiation: 'Operacion Spot',
    number_days: null,
    issuer_id: null,
    purchaser_id: null,
    portfolio_description: '',
    operation_type_description: '',
    issuer_description: '',
    purchaser_description: '',
    titles: [],
    complies_origin_currency: false,
    complies_currency_id: 0,
    currency_value_negotiation: 0,
    placement_resource_date: '',
    conversion_factor: 0,
  })

  const selectOptions = computed(() => ({
    operation_type: (operation_type.value as IOperationT[]).map((item) => ({
      ...item,
      label: `${item.code} - ${item.description}`,
      value: item.id,
    })),
    investment_portfolio: investment_portfolio.value,
    issuer: list_emitter_associated_trader.value,
    purchaser: list_counterparty_associated_trader.value,
    compensation_system:
      compensation_system_list.value as ICompensationSystemResource[],
  }))

  const resetForm = () => {
    formData.value = {
      investment_portfolio_id: null,
      operation_type_id: null,
      operation_date: moment().format('YYYY-MM-DD'),
      negotiation: '',
      number_days: null,
      issuer_id: null,
      purchaser_id: null,
      portfolio_description: '',
      operation_type_description: '',
      issuer_description: '',
      purchaser_description: '',
      titles: [],
      complies_origin_currency: false,
      complies_currency_id: 0,
      currency_value_negotiation: 0,
      placement_resource_date: '',
      conversion_factor: 0,
    }
  }

  ;(
    [
      {
        sourceKey: 'investment_portfolio_id',
        optionsKey: 'investment_portfolio',
        descriptionKey: 'portfolio_description',
      },
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

  const saleValueCurrencyOriginRules = (row: SaleTableRows) => [
    (val: string) => {
      if (!selectedRows.value.some((r) => r.index === row.index)) return true
      return useRules().is_required(val, 'Campo obligatorio')
    },
    (val: string) => {
      if (!selectedRows.value.some((r) => r.index === row.index)) return true
      return useRules().max_integer_decimal(val, 15, 2)
    },
  ]

  const onSaleValueCurrencyOriginInput = async (
    val: string,
    row: SaleTableRows
  ) => {
    row.sale_value_currency_origin = val.replace(',', '.')
    const currencyDesc =
      titles.value && titles.value[row.index - 1]
        ? titles.value[row.index - 1]
        : null
    if (currencyDesc) {
      _setCurrencyDescription(currencyDesc.currency_code!)
      _setPaperTypeId(currencyDesc.paper_type_id!)
      _setCurrencyValue(currencyDesc.currency_value!)
    }

    if (!row.sale_value_currency_origin) return

    const payload = {
      title_id: row.title_id,
      sale_value: Number(row.sale_value_currency_origin),
      operation_date: formData.value.operation_date,
      type_currency: 'foreign' as const,
    }

    const irr = await _getIrrSaleValue(payload)
    row.tir_sale = irr !== null ? irr : null
  }

  const irrSaleRules = (row: SaleTableRows) => [
    (val: string) => {
      if (!selectedRows.value.some((r) => r.index === row.index)) return true
      return useRules().is_required(val, 'La TIR de venta es obligatoria')
    },
    (val: string) => {
      if (!selectedRows.value.some((r) => r.index === row.index)) return true
      return useRules().max_integer_decimal(val, 4, 6)
    },
  ]

  const onIrrSaleInput = (val: string, row: SaleTableRows) => {
    const parsed = parseFloat(val.replace(',', '.'))
    row.tir_sale = Number.isFinite(parsed) ? parsed : null
  }

  const selectedRows = ref<SaleTableRows[]>([])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: SaleTableRows[]
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
        name: 'title_id',
        label: 'ID',
        field: 'title_id',
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
        name: 'market_value_currency_origin',
        label: 'Valor Mercado Moneda Origen',
        field: 'market_value_currency_origin',
        align: 'left',
        sortable: true,
      },
      {
        name: 'market_value_local_currency',
        label: 'Valor Mercado Moneda Local',
        field: 'market_value_local_currency',
        align: 'left',
        sortable: true,
      },
      {
        name: 'sale_value_currency_origin',
        label: 'Valor Venta Moneda Origen',
        field: 'sale_value_currency_origin',
        align: 'left',
        sortable: true,
      },
      {
        name: 'tir_sale',
        label: 'TIR Venta',
        field: 'tir_sale',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
    selection: 'single',
    rowKey: 'title_id',
  })

  watch(
    () => formData.value.issuer_id,
    async (newVal) => {
      if (!newVal) {
        tableProps.value.rows = []
        return
      }
      tableProps.value.loading = true

      titles.value = await _getTitlesList(newVal, 'foreign_fixed')

      if (titles.value) {
        tableProps.value.rows = titles.value.map(
          (
            t: IRegisterFixedIncomeForeignCurrencySaleTitle,
            idx: number
          ): SaleTableRows => ({
            index: idx + 1,
            title_id: t.id,
            title: `${t.id} - ${t.issuers_counterparty_id ?? ''}`,
            market_value_currency_origin: t.unit_value,
            market_value_local_currency: t.purchase_value,
            sale_value_currency_origin: null,
            tir_sale: null,
          })
        )
      } else {
        tableProps.value.rows = []
      }

      tableProps.value.loading = false
    }
  )

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

  // Gestiona dependencias del tipo de operacion
  watch(
    () => formData.value.negotiation,
    () => {
      _setNegotiation(formData.value.negotiation)
      if (formData.value.negotiation === 'Operacion Spot') {
        showDays.value = false
        formData.value.number_days = null
      } else {
        showDays.value = true
      }
    },
    { immediate: true }
  )

  watch(
    () => formData.value.number_days,
    (newVal) => {
      formData.value.number_days = newVal ? newVal : null
      _setNumberDays(formData.value.number_days)
    }
  )

  const getValues = () => {
    const titlesMapped = selectedRows.value.map((row) => ({
      title_id: row.title_id,
      market_value_currency_origin: row.market_value_currency_origin,
      market_value_local_currency: row.market_value_local_currency,
      sale_value_currency_origin: row.sale_value_currency_origin,
      irr_sale: row.tir_sale ? Number(row.tir_sale) : undefined,
    }))

    return {
      ...formData.value,
      titles: titlesMapped,
    }
  }

  const validateTableRows = (): boolean => {
    for (const row of selectedRows.value) {
      if (!row.sale_value_currency_origin) return false
      if (row.tir_sale === null || row.tir_sale === undefined) return false
    }
    return true
  }

  const validateForm = async (): Promise<boolean> => {
    const baseValid = await informationFormRef.value?.validate()
    if (!baseValid) return false

    if (selectedRows.value.length === 0) return false

    return validateTableRows()
  }

  const rules = useRules()
  const req = (v: string) => rules.is_required(v)
  const dateFmt = (v: string) => rules.valid_format_date(v, 'YYYY-MM-DD')

  return {
    informationFormRef,
    formData,
    selectOptions,
    selectedRows,
    tableProps,
    showDays,
    validateForm,
    req,
    dateFmt,
    getValues,
    irrSaleRules,
    onIrrSaleInput,
    saleValueCurrencyOriginRules,
    onSaleValueCurrencyOriginInput,
    resetForm,
  }
}

export default useRegisterFixedIncomeForeignCurrencySaleForm
