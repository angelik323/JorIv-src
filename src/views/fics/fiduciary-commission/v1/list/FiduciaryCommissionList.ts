// Vue - Vue Router - Pinia - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { IFiduciaryCommission } from '@/interfaces/customs/fics/FiduciaryCommission'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'
import { commission_options } from '@/constants'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiduciaryCommissionStore } from '@/stores/fics/fiduciary-comission'

const useFiduciaryCommissionList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const fiduciaryCommissionStore = useFiduciaryCommissionStore('v1')
  const { fiduciary_commission_list, fiduciary_commission_pages } = storeToRefs(
    fiduciaryCommissionStore
  )
  const { _listAction } = fiduciaryCommissionStore

  const isFiduciaryCommissionEmpty = ref(true)
  const showState = ref(0)

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const headerProperties = {
    title: 'Comisión fiduciaria',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Comisión fiduciaria',
        route: 'FiduciaryCommissionList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'type',
      label: 'Tipo de comisión',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: commission_options['commission_type'],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'rate_type',
      label: 'Tipo de tasa',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: commission_options['rate_type'],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por descripción o código',
    },
  ])

  const tableProperties = ref<IBaseTableProps<IFiduciaryCommission>>({
    title: 'Listado de comisiones fiduciarias',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
      },
      {
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo de comisión',
        align: 'left',
        field: 'type',
        sortable: true,
        format: (val: number) => {
          if (val === 1) return 'Fija'
          else if (val === 2) return 'Variable'

          return 'Desconocido'
        },
      },
      {
        name: 'rate_type',
        required: true,
        label: 'Tipo de tasa',
        align: 'left',
        field: 'rate_type',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProperties.value.rows = []

    await _listAction(filters)

    const hasResults = fiduciary_commission_list.value.length > 0

    showState.value = filters ? 1 : 0
    isFiduciaryCommissionEmpty.value = !hasResults

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleOptions = async (option: string, id: number) => {
    if (option === 'view') goToURL('FiduciaryCommissionView', id)
    else if (option === 'edit') goToURL('FiduciaryCommissionEdit', id)
  }

  const handleFilter = async ($filters: {
    'filter[rate_type]': string
    'filter[search]': string
    'filter[type]': string
  }) => await loadData({ ...$filters })

  const handleClearFilters = () => {
    showState.value = 0
    tableProperties.value.rows = []
    isFiduciaryCommissionEmpty.value = true
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page
    await loadData(filtersFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value)
  }

  onMounted(async () => {
    if (route.query.reload === 'true') await loadData({})
  })

  watch(
    fiduciary_commission_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = fiduciary_commission_pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    goToURL,
    showState,
    handleFilter,
    filterConfig,
    handleOptions,
    tableProperties,
    headerProperties,
    handleUpdatePage,
    handleClearFilters,
    defaultIconsLucide,
    handleUpdateRowsPerPage,
    isFiduciaryCommissionEmpty,
  }
}

export default useFiduciaryCommissionList
