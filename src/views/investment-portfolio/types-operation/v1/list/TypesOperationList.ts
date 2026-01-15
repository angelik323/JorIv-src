//Vue-Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
//Composables
import { useRouteValidator, useUtils } from '@/composables'
//Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { ITypesOperation } from '@/interfaces/customs/'
//Stores
import {
  useTypesOperationStore,
  useResourceManagerStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'
//Constants
import { fic_menu_movement } from '@/constants'
//Utils

export const useTypesOperationList = () => {
  const { types_operation_pages, types_operation_list } = storeToRefs(
    useTypesOperationStore('v1')
  )
  const { _getTypesOperationList } = useTypesOperationStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { nature_operation, accounting_origin } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { validateRouter } = useRouteValidator()
  const { formatParamsCustom, defaultIconsLucide } = useUtils()
  const keys = ['accounting_origin', 'operation_natural']

  const headerProps = {
    title: 'Tipos de operaciones',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      { label: 'Tipos de operaciones', route: 'TypesOperationList' },
    ],
  }

  let perPage = 20
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ITypesOperation[]
    pages: typeof types_operation_pages.value
    rowsPerPage: number
  }>({
    title: 'Listado de tipos de operaciones',
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
        name: 'code',
        required: false,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'operation_nature',
        required: false,
        label: 'Naturaleza operacion',
        align: 'left',
        field: 'operation_nature',
        sortable: true,
      },
      {
        name: 'accounting_origin',
        required: false,
        label: 'Origen contabilidad',
        align: 'left',
        field: 'accounting_origin',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'nature',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: types_operation_pages.value,
    rowsPerPage: perPage,
  })

  const listAction = async (filters: string = '') => {
    if (filters) {
      const params = filters
        .replace(/^&/, '')
        .split('&')
        .map((f) => f.split('='))
        .filter(([_, value]) => value !== 'Todos')

      if (params.length === 0) {
        filters = ''
      } else {
        filters =
          '&' + params.map(([key, value]) => `${key}=${value}`).join('&')
      }
    }
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getTypesOperationList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = ($filter: {
    'filter[operation_nature]': string
    'filter[accounting-origin]': string
    'filter[generates_fic_movement]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filter,
      paginate: 1,
      page: 1,
      limit: perPage,
    }
    const qs = formatParamsCustom(filtersFormat.value)
    listAction(qs ? '&' + qs : '')
  }

  const handleClear = () => {
    tableProps.value.rows = []
    filtersFormat.value = {}
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
      limit: perPage,
      paginate: 1,
    }
    const qs = formatParamsCustom(filtersFormat.value)
    listAction(qs ? '&' + qs : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1,
      limit: perPage,
      paginate: 1,
    }
    const qs = formatParamsCustom(filtersFormat.value)
    listAction(qs ? '&' + qs : '')
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'operation_nature',
      label: 'Naturaleza operación',
      type: 'q-select',
      value: 'Todos',
      class: 'col-12 col-md-3',
      autocomplete: true,
      options: nature_operation,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'generates_fic_movement',
      label: 'Genera movimiento en FIC',
      type: 'q-select',
      value: 'Todos',
      class: 'col-12 col-md-3',
      autocomplete: true,
      options: fic_menu_movement,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'accounting_origin',
      label: 'Origen contabilidad',
      type: 'q-select',
      value: 'Todos',
      class: 'col-12 col-md-3',
      autocomplete: true,
      options: accounting_origin,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      prepend_icon: defaultIconsLucide.magnify,
      autocomplete: true,
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  onMounted(async () => {
    await _getResources({ investment_portfolio: keys })
  })

  onBeforeUnmount(() => {
    _resetKeys({ investment_portfolio: keys })
  })

  watch(
    () => types_operation_list.value,
    () => {
      tableProps.value.rows = types_operation_list.value
    },
    { deep: true }
  )

  watch(
    () => types_operation_pages.value,
    () => {
      tableProps.value.pages = types_operation_pages.value
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    validateRouter,
  }
}
