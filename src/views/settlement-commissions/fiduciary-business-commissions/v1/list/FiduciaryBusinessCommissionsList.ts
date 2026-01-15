// Vue - pinia - moment
import { ref, onMounted, computed, watch, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useRouteValidator } from '@/composables'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { QTable } from 'quasar'
import {
  IFieldFilters,
  IFiduciaryBusinessCommissionsList,
} from '@/interfaces/customs'

// Stores
import {
  useFiduciaryBusinessCommissionsStore,
  useResourceManagerStore,
  useSettlementCommissionsResourceStore,
} from '@/stores'

const useFiduciaryBusinessCommissionsList = () => {
  const { _getFiduciaryBusinessCommissionsList, _clearData } =
    useFiduciaryBusinessCommissionsStore('v1')
  const {
    fiduciary_business_commissions_list,
    fiduciary_business_commissions_pages,
  } = storeToRefs(useFiduciaryBusinessCommissionsStore('v1'))

  const { validateRouter } = useRouteValidator()

  const { comission_settlement_statuses } = storeToRefs(
    useSettlementCommissionsResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  let perPage = 20

  const keys = {
    settlement_commissions: ['business_status_snapshot'],
  }

  const headerProps = {
    title: 'Definir comisiones de negocios fiduciarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Definir comisiones de negocios fiduciarios',
        route: 'FiduciaryBusinessCommissionsList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Definir comisiones de negocios fiduciarios',
    loading: false,
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
        name: 'business_code_snapshot',
        field: 'business_code_snapshot',
        required: true,
        label: 'Código de negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_name_snapshot',
        field: 'business_name_snapshot',
        required: true,
        label: 'Nombre',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_start_date_snapshot',
        field: 'business_start_date_snapshot',
        required: true,
        label: 'Fecha inicial',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_end_date_snapshot',
        field: 'business_end_date_snapshot',
        required: true,
        label: 'Fecha final',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: 'comission_settlement_statuses_id',
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IFiduciaryBusinessCommissionsList[],
    pages: fiduciary_business_commissions_pages.value,
  })

  const filterConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'business_status_snapshot',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: comission_settlement_statuses.value,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'business_start_date_snapshot',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'business_end_date_snapshot',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
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
      placeholder: 'Buscar por código o nombre',
      rules: [
        (val: string) =>
          !val || val.length <= 50 || 'Debe contener como máximo 50 caracteres',
      ],
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleClear = () => {
    tableProps.value.rows = []
  }

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getFiduciaryBusinessCommissionsList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[business_status_snapshot]': string
    'filter[business_start_date_snapshot]': string
    'filter[business_end_date_snapshot]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage,
      page,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    await listAction({ ...filtersFormat.value, page: 1 })
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeMount(async () => {
    _resetKeys(keys)
  })

  watch(
    fiduciary_business_commissions_list,
    () => {
      tableProps.value.rows = [...fiduciary_business_commissions_list.value]

      const { currentPage, lastPage } =
        fiduciary_business_commissions_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,

    handleFilter,
    updatePage,
    updatePerPage,
    handleClear,
    validateRouter,
  }
}

export default useFiduciaryBusinessCommissionsList
