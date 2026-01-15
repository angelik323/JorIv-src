// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  IFieldFilters,
  IFiduciaryBusinessCommissionsList,
} from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'

// Constantes
import { collections_options } from '@/constants'

// Composables
import {
  useGoToUrl,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import { useFiduciaryBusinessCommissionsStore } from '@/stores/settlement-commissions/fiduciary-business-commissions'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryBusinessCommissionsList = () => {
  const { _getFiduciaryBusinessCommissionsList } =
    useFiduciaryBusinessCommissionsStore('v2')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide } = useUtils()
  const { max_length } = useRules()
  const { goToURL } = useGoToUrl()

  // router
  const route = useRoute()

  const headerProps = {
    title: 'Comisiones de negocios fiduciarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
      },
      {
        label: 'Comisiones de negocios fiduciarios',
        route: 'FiduciaryBusinessCommissionsList',
      },
    ],
  }

  const tableProperties = ref<
    IBaseTableProps<IFiduciaryBusinessCommissionsList>
  >({
    title: 'Listados de comisiones de negocios fiduciarios',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_name_snapshot',
        field: (row) =>
          row.business_code_snapshot + ' - ' + row.business_name_snapshot,
        required: true,
        label: 'Código y nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_start_date',
        field: 'business_start_date_snapshot',
        required: true,
        label: 'Fecha inicio de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'commission_type',
        field: (row) => row.commission_type?.full_label,
        required: true,
        label: 'Nombre de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'colllection',
        field: 'colllection',
        required: true,
        label: 'Cobro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'billing_trusts',
        field: (row) => row.billing_trust?.code,
        required: true,
        label: 'Código de periodo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const billing_options = [
    { label: 'Todos', value: null },
    ...collections_options,
  ]

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_start_date',
      label: 'Fecha inicio de comisión',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'colllection',
      label: 'Cobro',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: billing_options,
      disable: false,
      autocomplete: true,
      clean_value: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre de negocio',
      rules: [(val: string) => max_length(val, 50)],
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const handleClear = () => {
    tableProperties.value.rows = []
  }

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const result = await _getFiduciaryBusinessCommissionsList(filters)
    if (result) {
      tableProperties.value.rows = result.list
      tableProperties.value.pages = {
        currentPage: result.pages.currentPage,
        lastPage: result.pages.lastPage,
      }
    }
    tableProperties.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[business_status_snapshot]': string
    'filter[business_start_date]': string
    'filter[business_end_date_snapshot]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const keys = {}

  onMounted(async () => {
    await _getResources(keys)

    const trustBusinessQuery = route.query.trust_business
    if (trustBusinessQuery) {
      filtersFormat.value['filter[search]'] = trustBusinessQuery as string
      await listAction(filtersFormat.value)
    }
  })

  onBeforeUnmount(async () => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    tableProperties,
    filterConfig,
    defaultIconsLucide,

    handleFilter,
    updatePage,
    updatePerPage,
    handleClear,
    goToURL,
    validateRouter,
  }
}

export default useFiduciaryBusinessCommissionsList
