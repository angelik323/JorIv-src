import { useRoute } from 'vue-router'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'
import { formatParamsCustom } from '@/utils'

import { IEmitterDividend, IFieldFilters } from '@/interfaces/customs'

import {
  useResourceManagerStore,
  useInvestmentPortfolioResourceStore,
  useDividendPaymentForeignCurrencyStore,
} from '@/stores'

const useDividendPaymentForeignCurrencyList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  const { third_party_issuers_selector_dividend: emitterSelect } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    payment_dividends_foreign_currency_list,
    payment_dividends_foreign_currency_pages,
  } = storeToRefs(useDividendPaymentForeignCurrencyStore('v1'))
  const { _listAction } = useDividendPaymentForeignCurrencyStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const isDividendsPaymentsEmpty = ref(true)
  const showState = ref(0)

  let perPage = 20

  const headerProperties = {
    title: 'Pago dividendos moneda extranjera',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: 'Pago dividendos moneda extranjera',
        route: 'DividendPaymentForeignCurrencyList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'emitter_id',
      label: 'Emisor',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: emitterSelect,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  const tableProperties = ref({
    title: 'Listado de dividendos',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'left',
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'document_emitter',
        align: 'left',
        label: 'ID Emisor',
        field: 'document_emitter',
        sortable: true,
      },
      {
        name: 'operation_date',
        align: 'left',
        label: 'Fecha de operación',
        field: 'operation_date',
        sortable: true,
      },
      {
        name: 'class_action',
        align: 'left',
        label: 'Clase acción',
        field: 'class_action',
        sortable: true,
      },
      {
        name: 'unit_id_action',
        align: 'left',
        label: 'Id Unidad / Acción',
        field: 'unit_id_action',
        sortable: true,
      },
      {
        name: 'number_of_shares',
        align: 'left',
        label: 'Cantidad de acciones',
        field: 'number_of_shares',
        sortable: true,
      },
      {
        name: 'dividend_type',
        align: 'left',
        label: 'Tipo dividendo',
        field: 'dividend_type',
        sortable: true,
      },
      {
        name: 'dividend_record_date',
        align: 'left',
        label: 'Fecha registro dividendo',
        field: 'dividend_record_date',
        sortable: true,
      },
      {
        name: 'ex_dividend_date',
        align: 'left',
        label: 'Fecha registro exdividendo',
        field: 'ex_dividend_date',
        sortable: true,
      },
      {
        name: 'due_date',
        align: 'left',
        label: 'Fecha exigibiildad',
        field: 'due_date',
        sortable: true,
      },
      {
        name: 'payment_date',
        align: 'left',
        label: 'Fecha de pago',
        field: 'payment_date',
        sortable: true,
      },
      {
        name: 'has_recorded',
        align: 'left',
        label: 'Gravado',
        field: (row) => (row.has_recorded ? 'Si' : 'No'),
        sortable: true,
      },
      {
        name: 'type_of_currency',
        align: 'left',
        label: 'Moneda origen',
        field: 'type_of_currency',
        sortable: true,
      },
      {
        name: 'spot_rate',
        align: 'left',
        label: 'Tasa spot',
        field: 'spot_rate',
        sortable: true,
      },
      {
        name: 'dividend_value',
        align: 'left',
        label: 'Valor dividendo moneda origen',
        field: 'dividend_value',
        sortable: true,
      },
      {
        name: 'dividend_value_local_currency',
        align: 'left',
        label: 'Valor dividendo moneda local',
        field: 'dividend_value_local_currency',
        sortable: true,
      },
      {
        name: 'tax_percentage',
        align: 'left',
        label: 'Porcentaje impuesto',
        field: (row) =>
          row.tax_percentage != null ? `${row.tax_percentage}%` : '-',
        sortable: true,
      },
      {
        name: 'tax_value',
        align: 'left',
        label: 'Valor impuesto moneda origen',
        field: (row) => (row.tax_value != 0 ? `${row.tax_value}` : '-'),
        sortable: true,
      },
      {
        name: 'tax_value_local_currency',
        align: 'left',
        label: 'Valor impuesto moneda local',
        field: 'tax_value_local_currency',
        sortable: true,
      },
      {
        name: 'dividend_value_after_tax',
        align: 'left',
        label: 'Valor dividendo moneda origen después de impuesto',
        field: 'dividend_value_after_tax',
        sortable: true,
      },
      {
        name: 'dividend_value_local_currency_after_tax',
        align: 'left',
        label: 'Valor dividendo moneda local después de impuesto',
        field: 'dividend_value_local_currency_after_tax',
        sortable: true,
      },
      {
        name: 'enforceability_value',
        align: 'left',
        label: 'Valor exigibilidad moneda origen',
        field: 'enforceability_value',
        sortable: true,
      },
      {
        name: 'demand_value_local_currency',
        align: 'left',
        label: 'Valor exigibilidad moneda local',
        field: 'demand_value_local_currency',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IEmitterDividend[],
    pages: payment_dividends_foreign_currency_pages,
  })

  const loadData = async (filters: string = 'paginate=1') => {
    openMainLoader(true)

    await _listAction(filters)

    const hasResults = payment_dividends_foreign_currency_list.value.length > 0

    showState.value = filters ? 1 : 0
    isDividendsPaymentsEmpty.value = !hasResults

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
      paginate: 1,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleClearFilters = () => {
    showState.value = 0
    filtersFormat.value = {}
    tableProperties.value.rows = []
    isDividendsPaymentsEmpty.value = true
  }

  const handleUpdatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleUpdatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      rows: perPage,
      paginate: 1,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleGoTo = (route: string, id?: number) =>
    router.push({ name: route, params: { id } })

  watch(
    () => payment_dividends_foreign_currency_list.value,
    () => {
      tableProperties.value.rows = payment_dividends_foreign_currency_list.value
      tableProperties.value.pages =
        payment_dividends_foreign_currency_pages.value
    }
  )

  onMounted(async () => {
    if (route.query.reload === 'true') loadData()
    await _getResources({
      investment_portfolio: ['third_party_issuers_selector'],
    })
  })

  onBeforeMount(
    async () =>
      await _resetKeys({
        investment_portfolio: ['third_party_issuers_selector'],
      })
  )

  return {
    showState,
    handleGoTo,
    handleFilter,
    filterConfig,
    tableProperties,
    headerProperties,
    handleUpdatePage,
    handleClearFilters,
    defaultIconsLucide,
    handleUpdatePerPage,
    isDividendsPaymentsEmpty,
  }
}

export default useDividendPaymentForeignCurrencyList
