// Vue - pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IGuaranteeOperationAvailableTitlesPortfolioList,
  IGuaranteeOperationCurrentWarranty,
  IGuaranteeOperationForm,
  IGuaranteeOperationMoneyOperationsList,
  IGuaranteeOperationResponseById,
} from '@/interfaces/customs/investment-portfolio/GuaranteeOperations'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useLogin } from '@/stores/login'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'
import { useGuaranteeOperationsStore } from '@/stores/investment-portfolio/guarantee-operations'

const createDefaultModels = (): IGuaranteeOperationForm => ({
  id: 0,
  operation_date: useUtils().getCurrentDateFormatted(),
  investment_portfolio_id: null,
  investment_portfolio_code: null,
  investment_portfolio_description: '',
  operation_filter: null,
  position: null,
  operation: null,
  money_market_transaction_record_id: null,
  title_guarantee_new_id: null,
})

const useBasicDataGuaranteeOperationsForm = (
  action: ActionType,
  data: IGuaranteeOperationForm | IGuaranteeOperationResponseById | null
) => {
  const { watchAndUpdateDescription, formatParamsCustom } = useUtils()
  const basicDataFormRef = ref()
  const models = ref<IGuaranteeOperationForm>(createDefaultModels())
  const basicDataOnView = ref<IGuaranteeOperationResponseById>()

  const { defaultIconsLucide } = useUtils()
  const { loggedUser } = storeToRefs(useLogin())
  const tableMoneyOperationsRef = ref()

  const codeAndNameLoggedUser = computed(() => {
    if (loggedUser.value?.user) {
      return `${loggedUser.value.user.id} - ${loggedUser.value.user.name} ${loggedUser.value.user.last_name}`
    }
    return ''
  })

  const { _getListMoneyMarketOperations, _getTitlesList } =
    useGuaranteeOperationsStore('v1')

  const {
    list_investment_portfolios_associated_trader,
    type_of_operation,
    options_positions_list,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const selectsOptions = computed(() => ({
    investment_portfolio: list_investment_portfolios_associated_trader.value,
    type_of_operation: type_of_operation.value,
    options_positions_list: options_positions_list.value,
  }))

  const descriptionBindings = [
    {
      sourceKey: 'investment_portfolio_id',
      optionsKey: 'investment_portfolio',
      descriptionKey: 'investment_portfolio_description',
    },
  ] as const

  for (const { sourceKey, optionsKey, descriptionKey } of descriptionBindings) {
    watchAndUpdateDescription(
      models,
      selectsOptions,
      sourceKey,
      optionsKey,
      descriptionKey
    )
  }

  const filtersFormatTableMoneyOperations = ref<
    Record<string, string | number>
  >({})
  const filtersFormatTableAvailableTitlesPortfolio = ref<
    Record<string, string | number>
  >({})

  const tableMoneyOperations = ref<
    IBaseTableProps<IGuaranteeOperationMoneyOperationsList>
  >({
    title: 'Listado de operaciones monetarias',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: 'Número de operación',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'operation_code',
        required: true,
        label: 'Operación',
        align: 'left',
        field: 'operation_code',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo de operación',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'operation',
        required: true,
        label: 'Descripción operación',
        align: 'left',
        field: 'operation',
        sortable: true,
      },
      {
        name: 'start_date',
        required: true,
        label: 'Fecha inicio',
        align: 'left',
        field: 'start_date',
        sortable: true,
      },
      {
        name: 'end_date',
        required: true,
        label: 'Fecha fin',
        align: 'left',
        field: 'end_date',
        sortable: true,
      },
      {
        name: 'agreed_rate',
        required: true,
        label: 'Tasa pactada',
        align: 'left',
        field: 'agreed_rate',
        sortable: true,
      },
      {
        name: 'rate_class',
        required: true,
        label: 'Tipo tasa',
        align: 'left',
        field: 'rate_class',
        sortable: true,
      },
      {
        name: 'base_days',
        required: true,
        label: 'Base días',
        align: 'left',
        field: 'base_days',
        sortable: true,
      },
      {
        name: 'face_value',
        required: true,
        label: 'Valor nominal',
        align: 'left',
        field: 'face_value',
        sortable: true,
      },
      {
        name: 'return_value',
        required: true,
        label: 'Valor regreso',
        align: 'left',
        field: 'return_value',
        sortable: true,
      },
      {
        name: 'guarantee_value',
        required: true,
        label: 'Valor garantía',
        align: 'left',
        field: 'guarantee_value',
        sortable: true,
      },
      {
        name: 'guarantee_percentage',
        required: true,
        label: 'Porcentaje garantía',
        align: 'left',
        field: 'guarantee_percentage',
        sortable: true,
      },
      {
        name: 'title_id',
        required: true,
        label: 'Número de título',
        align: 'left',
        field: 'title_id',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const currentWarranty = ref<IGuaranteeOperationCurrentWarranty | null>(null)

  const tableAvailableTitlesPortfolio = ref<
    IBaseTableProps<IGuaranteeOperationAvailableTitlesPortfolioList>
  >({
    title: 'Títulos disponibles en el portafolio',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'issuer',
        required: true,
        label: 'Emisor',
        align: 'left',
        field: (row) => row.issuer || '-',
        sortable: true,
      },
      {
        name: 'isin',
        required: true,
        label: 'ISIN',
        align: 'left',
        field: (row) => row.isin || row.isin_code || '-',
        sortable: true,
      },
      {
        name: 'mnemonic',
        required: true,
        label: 'Nemotécnico',
        align: 'left',
        field: (row) => row.mnemonic || '-',
        sortable: true,
      },
      {
        name: 'id',
        required: true,
        label: 'Número de título',
        align: 'left',
        field: (row) => row.id || row.title_id || '-',
        sortable: true,
      },
      {
        name: 'paper',
        required: true,
        label: 'Papel',
        align: 'left',
        field: (row) => row.paper || '-',
        sortable: true,
      },
      {
        name: 'issue_date',
        required: true,
        label: 'Fecha emisión',
        align: 'left',
        field: (row) => row.issue_date || '-',
        sortable: true,
      },
      {
        name: 'maturity_date',
        required: true,
        label: 'Fecha vencimiento',
        align: 'left',
        field: (row) => row.maturity_date || '-',
        sortable: true,
      },
      {
        name: 'rate_type',
        required: true,
        label: 'Tipo tasa',
        align: 'left',
        field: (row) => row.rate_type || '-',
        sortable: true,
      },
      {
        name: 'rate_code',
        required: true,
        label: 'Código tasa',
        align: 'left',
        field: (row) => row.rate_code || '-',
        sortable: true,
      },
      {
        name: 'rate_value',
        required: true,
        label: 'Valor tasa',
        align: 'left',
        field: (row) => row.rate_value || row.fixed_rate_value || '-',
        sortable: true,
      },
      {
        name: 'spread',
        required: true,
        label: 'Spread',
        align: 'left',
        field: (row) => row.spread || '-',
        sortable: true,
      },
      {
        name: 'modality',
        required: true,
        label: 'Modalidad',
        align: 'left',
        field: (row) => row.modality || '-',
        sortable: true,
      },
      {
        name: 'currency_code',
        required: true,
        label: 'Moneda',
        align: 'left',
        field: (row) => row.currency_code || row.currency || '-',
        sortable: true,
      },
      {
        name: 'perioricity',
        required: true,
        label: 'Periodicidad',
        align: 'left',
        field: (row) => row.perioricity || '-',
        sortable: true,
      },
      {
        name: 'tir',
        required: true,
        label: 'TIR compra',
        align: 'left',
        field: (row) => row.tir || row.irr_purchase || '-',
        sortable: true,
      },
      {
        name: 'deposit_issuer_id',
        required: true,
        label: 'Depósito',
        align: 'left',
        field: (row) => row.deposit_issuer_id || row.deposit || '-',
        sortable: true,
      },
      {
        name: 'face_value',
        required: true,
        label: 'Valor nominal',
        align: 'left',
        field: (row) => row.face_value || '-',
        sortable: true,
      },
      {
        name: 'unit_value',
        required: true,
        label: 'Valor unidades',
        align: 'left',
        field: (row) => row.unit_value || '-',
        sortable: true,
      },
      {
        name: 'purchase_value',
        required: true,
        label: 'Valor mercado',
        align: 'left',
        field: (row) => row.purchase_value || row.market_value || '-',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const listMoneyMarketOperations = async () => {
    tableMoneyOperations.value.loading = true
    const queryString = formatParamsCustom(
      filtersFormatTableMoneyOperations.value
    )
    const data = await _getListMoneyMarketOperations(
      queryString ? '&' + queryString : ''
    )
    tableMoneyOperations.value.rows = data?.data || []
    tableMoneyOperations.value.pages = {
      currentPage: data?.current_page || 1,
      lastPage: data?.last_page || 1,
    }
    tableMoneyOperations.value.loading = false
  }

  const listAvailableTitles = async () => {
    tableAvailableTitlesPortfolio.value.loading = true
    const queryString = formatParamsCustom(
      filtersFormatTableAvailableTitlesPortfolio.value
    )
    const data = await _getTitlesList(queryString ? '&' + queryString : '')
    tableAvailableTitlesPortfolio.value.rows = data?.data || []
    tableAvailableTitlesPortfolio.value.pages = {
      currentPage: data?.current_page || 1,
      lastPage: data?.last_page || 1,
    }
    tableAvailableTitlesPortfolio.value.loading = false
  }

  watch(
    () => [
      models.value.operation_date,
      models.value.position,
      models.value.operation_filter,
      models.value.investment_portfolio_id,
    ],
    async () => {
      if (
        models.value.operation_date &&
        models.value.position &&
        models.value.investment_portfolio_id
      ) {
        const portfolioCode = selectsOptions.value.investment_portfolio.find(
          (p) =>
            p.investment_portfolio_id ===
            Number(models.value.investment_portfolio_id)
        )?.portfolio_code

        filtersFormatTableMoneyOperations.value = {
          ...(models.value.operation_filter && {
            'filter[operation_type]': models.value.operation_filter,
          }),
          'filter[investment_portfolio]': portfolioCode || '',
          'filter[operation_date]': models.value.operation_date,
          'filter[position]': models.value.position,
        }

        listMoneyMarketOperations()
      } else {
        tableMoneyOperations.value.rows = []
        models.value.money_market_transaction_record_id = null
        currentWarranty.value = null
        tableAvailableTitlesPortfolio.value.rows = []
        tableMoneyOperationsRef.value.clearSelection()
      }
    }
  )

  const handleSelectedMoneyOperation = async (
    selection: IGuaranteeOperationMoneyOperationsList[]
  ) => {
    models.value.money_market_transaction_record_id = selection[0]?.id || null
    models.value.operation = selection[0]?.type || null
    currentWarranty.value = selection[0]?.current_warranty || null
    if (models.value.money_market_transaction_record_id) {
      listAvailableTitles()
    }
  }

  const handleSelectedTitle = (
    selection: IGuaranteeOperationAvailableTitlesPortfolioList[]
  ) => {
    models.value.title_guarantee_new_id = selection[0]?.id || null
  }

  const updatePageTableMoneyOperations = (pageNumber: number) => {
    filtersFormatTableMoneyOperations.value = {
      ...filtersFormatTableMoneyOperations.value,
      page: pageNumber,
    }
    listMoneyMarketOperations()
  }

  const updateRowsPerPageTableMoneyOperations = (rowsPerPage: number) => {
    filtersFormatTableMoneyOperations.value = {
      ...filtersFormatTableMoneyOperations.value,
      page: 1,
      rows: rowsPerPage,
    }
    listMoneyMarketOperations()
  }

  const updatePageTableAvailableTitlesPortfolio = (pageNumber: number) => {
    filtersFormatTableAvailableTitlesPortfolio.value = {
      ...filtersFormatTableAvailableTitlesPortfolio.value,
      page: pageNumber,
    }
    listAvailableTitles()
  }

  const updateRowsPerPageTableAvailableTitlesPortfolio = (
    rowsPerPage: number
  ) => {
    filtersFormatTableAvailableTitlesPortfolio.value = {
      ...filtersFormatTableAvailableTitlesPortfolio.value,
      page: 1,
      rows: rowsPerPage,
    }
    listAvailableTitles()
  }

  onMounted(() => {
    if (action === 'view') {
      basicDataOnView.value = data as IGuaranteeOperationResponseById
      tableMoneyOperations.value.rows = [
        basicDataOnView.value.monetary_operation,
      ]
      currentWarranty.value = basicDataOnView.value.current_warranty || null
      tableAvailableTitlesPortfolio.value.rows = [
        basicDataOnView.value.guarantee_operation,
      ]
    }
  })

  return {
    models,
    basicDataOnView,
    basicDataFormRef,
    tableMoneyOperations,
    currentWarranty,
    tableAvailableTitlesPortfolio,
    defaultIconsLucide,
    codeAndNameLoggedUser,
    selectsOptions,
    tableMoneyOperationsRef,
    handleSelectedMoneyOperation,
    handleSelectedTitle,
    updatePageTableMoneyOperations,
    updateRowsPerPageTableMoneyOperations,
    updatePageTableAvailableTitlesPortfolio,
    updateRowsPerPageTableAvailableTitlesPortfolio,
  }
}

export default useBasicDataGuaranteeOperationsForm
