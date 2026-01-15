//Vue - Pinia
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Quasar
import { QTable } from 'quasar'
//Composables
import {
  useUtils,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
} from '@/composables'
//Interfaces
import { IFieldFilters, IRangeForTable } from '@/interfaces/customs'
//Stores
import { useRangesForDeferredStore } from '@/stores'

const useRangesForDeferredList = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const RangesForDeferredStore = useRangesForDeferredStore('v1')

  const {
    account_structures,
    business_trusts,
    range_types,
    ranges_list,
    ranges_pages,
  } = storeToRefs(RangesForDeferredStore)
  const { _resourcesAction, _listAction } = RangesForDeferredStore

  const filtersFormat = ref<Record<string, string | number>>({})
  const isRangeForDeferredEmpty = ref(true)
  const showState = ref(0)

  let perPage = 20

  const headerProperties = {
    title: 'Rango para diferidos y deterioros',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Rango para diferidos y deterioros',
        route: 'RangesForDeferredList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'range_type',
      label: 'Tipo de rango',
      type: 'q-select',
      value: null,
      options: range_types,
      autocomplete: true,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'account_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      options: account_structures,
      autocomplete: true,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'business',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      options: business_trusts,
      autocomplete: true,
      class: 'col-12 col-md-3',
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
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código de estructura',
    },
  ])

  const tableProperties = ref({
    title: 'Listado de rangos para diferidos y deterioros',
    loading: false,
    columns: [
      {
        name: 'code',
        align: 'center',
        label: '#',
        field: 'code',
      },
      {
        name: 'range_type',
        align: 'left',
        label: 'Tipo de rango',
        field: 'range_type',
        sortable: true,
        required: true,
      },
      {
        name: 'structure',
        align: 'left',
        label: 'Estructura',
        field: 'structure',
        sortable: true,
        required: true,
      },
      {
        name: 'business',
        align: 'left',
        label: 'Negocio',
        field: 'business',
        sortable: true,
        required: true,
      },
      {
        name: 'receipt_type',
        align: 'left',
        label: 'Tipo de comprobante',
        field: 'receipt_type',
        sortable: true,
        required: true,
      },
      {
        name: 'receipt_sub_type',
        align: 'left',
        label: 'Sub tipo de comprobante',
        field: 'receipt_sub_type',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
      },
    ] as QTable['columns'],
    customColumns: ['actions'],
    rows: [] as IRangeForTable[],
    pages: ranges_pages,
  })

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProperties.value.rows = []

    await _listAction(filters)

    const hasResults = ranges_list.value.length > 0

    showState.value = filters ? 1 : 0
    isRangeForDeferredEmpty.value = !hasResults

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleOptions = (action: string, id: number) => {
    if (action === 'edit') goToURL('RangesForDeferredEdit', id)
    else if (action === 'view') goToURL('RangesForDeferredView', id)
  }

  const handleFilter = async ($filters: {
    'filter[account_structure_id]': string
    'filter[range_type]': string
    'filter[search]': string
  }) => await loadData({ ...$filters })

  const handleClearFilters = () => {
    showState.value = 0
    filtersFormat.value = {}
    tableProperties.value.rows = []
    isRangeForDeferredEmpty.value = true
  }

  const handleUpdatePage = async (page: number) =>
    await loadData({ ...filtersFormat.value, page })

  const handleUpdatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage

    await loadData({ ...filtersFormat.value, rows: perPage })
  }

  watch(
    () => ranges_list.value,
    () => {
      tableProperties.value.rows = ranges_list.value
      tableProperties.value.pages = ranges_pages.value
    }
  )

  onMounted(async () => await _resourcesAction())

  return {
    showState,
    filterConfig,
    tableProperties,
    headerProperties,
    isRangeForDeferredEmpty,
    defaultIconsLucide,

    goToURL,
    handleOptions,
    validateRouter,
    handleUpdatePerPage,
    handleUpdatePage,
    handleClearFilters,
    handleFilter,
  }
}

export default useRangesForDeferredList
