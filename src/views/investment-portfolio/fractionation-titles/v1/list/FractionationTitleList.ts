//Vue - Pinia
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

//Composables
import { useRouteValidator, useUtils, useGoToUrl } from '@/composables'

//Constans
import { typeStatus } from '@/constants'

//Interfaces
import { IFieldFilters, IFractionationTitleRows } from '@/interfaces/customs'

//Stores
import {
  useFractionationTitlesStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'

//Quasar
import { QTable } from 'quasar'

export const useFractionationTitleList = () => {
  const { headerProps, pages, fractionation_titles_list } = storeToRefs(
    useFractionationTitlesStore('v1')
  )
  const { _getListFractionationTitles } = useFractionationTitlesStore('v1')
  const { operation_type } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  let perPage = 20
  const filtersFormat = ref<Record<string, string | number>>({})

  const headerProperties = {
    title: 'Fraccionamiento de títulos',
    breadcrumbs: [...headerProps.value.breadcrumbs],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    rows: IFractionationTitleRows[]
    columns: QTable['columns']
    pages: typeof pages
    rowsPerPage: number
  }>({
    title: 'Fraccionamiento de títulos',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'operation_date',
        required: false,
        label: 'Fecha operación',
        align: 'left',
        field: 'operation_date',
        sortable: true,
      },
      {
        name: 'investment_portfolio',
        required: false,
        label: 'Portafolio de inversión',
        align: 'left',
        field: (row) => row.investment_portfolio?.description ?? '-',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
        style: 'width: 150px;',
      },
    ] as QTable['columns'],
    rows: [],
    pages: pages,
    rowsPerPage: perPage,
  })

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = useUtils().formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = useUtils().formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getListFractionationTitles(filters)
    tableProps.value.loading = false
  }

  const filter = ref<IFieldFilters[]>([
    {
      name: 'operation_type_id',
      label: 'Tipo operación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: operation_type,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'start_date',
      label: 'Fecha inicio',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione fecha inicio',
    },
    {
      name: 'end_date',
      label: 'Fecha fin',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione fecha fin',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: 'Todos',
      options: typeStatus,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione estado',
    },
  ])

  const handleFilter = async ($filter: {
    'filter[operation_type_id]': string
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[status_id]': string | number
  }) => {
    filtersFormat.value = {
      ...$filter,
    }
    const queryString = useUtils().formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = async () => {
    tableProps.value.rows = []
    filtersFormat.value = {}
  }

  watch(
    () => fractionation_titles_list.value,
    () => {
      tableProps.value.rows = fractionation_titles_list.value
    }
  )

  onMounted(async () => {
    await _getResources({
      investment_portfolio: ['operation_type'],
    })
  })

  onUnmounted(() => {
    _resetKeys({
      investment_portfolio: ['operation_type'],
    })
  })

  return {
    headerProperties,
    tableProps,
    filter,
    updatePage,
    updatePerPage,
    validateRouter,
    handleFilter,
    handleClear,
    goToURL,
  }
}
