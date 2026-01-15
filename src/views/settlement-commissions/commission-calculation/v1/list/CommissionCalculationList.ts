// Vue - pinia - moment
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { ICommissionCalculationListV2 } from '@/interfaces/customs/settlement-commissions/CommissionCalculationV2'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import {
  useGoToUrl,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import {
  useResourceManagerStore,
  useSettlementCommissionsResourceStore,
} from '@/stores'
import { useCommissionCalculationStore } from '@/stores/settlement-commissions/commission-calculation'

const useCommissionCalculationList = () => {
  const { _getCommissionCalculationList } = useCommissionCalculationStore('v2')

  const { commission_types, periodicities } = storeToRefs(
    useSettlementCommissionsResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { validateRouter } = useRouteValidator()
  const { max_length } = useRules()
  const { defaultIconsLucide, formatCodeName, formatDate } = useUtils()
  const { goToURL } = useGoToUrl()

  const headerProps = {
    title: 'Cálculo de comisiones',
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
        label: 'Cálculo de comisiones',
        route: 'CommissionsCalculationList',
      },
    ],
  }

  const tableProperties = ref<IBaseTableProps<ICommissionCalculationListV2>>({
    title: 'Listados de cálculos de Comisiones',
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
        name: 'business_name',
        field: (row) =>
          formatCodeName(
            row.business_trust_commissions?.business_code_snapshot,
            row.business_trust_commissions?.business_name_snapshot
          ),
        required: true,
        label: 'Código y nombre del negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'commission_name',
        field: (row) =>
          formatCodeName(
            row.business_trust_commissions?.type_commission?.code,
            row.business_trust_commissions?.type_commission?.description
          ),
        required: true,
        label: 'Nombre de la comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'periodicity',
        field: (row) =>
          row.business_trust_commissions?.billing_trust?.periodicity ??
          row.business_trust_commissions?.periodicity,
        required: true,
        label: 'Periodicidad',
        align: 'left',
        sortable: true,
        format: (val) => val || '-',
      },
      {
        name: 'period_start',
        field: 'period_start',
        required: true,
        label: 'Fecha inicial',
        align: 'left',
        sortable: true,
        format: (val) => formatDate(val, 'YYYY-MM-DD') ?? '-',
      },
      {
        name: 'period_end',
        field: 'period_end',
        required: true,
        label: 'Fecha final',
        align: 'left',
        sortable: true,
        format: (val) => formatDate(val, 'YYYY-MM-DD') ?? '-',
      },
      {
        name: 'business_start_date',
        field: (row) =>
          row.business_trust_commissions?.business_start_date_snapshot,
        required: true,
        label: 'Fecha inicio de comisión',
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

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_start_date',
      label: 'Fecha inicio de comisión',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'commission_type_id',
      label: 'Nombre de la comisión',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: commission_types,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'periodicity',
      label: 'Periodicidad',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-4',
      options: periodicities,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
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
    const result = await _getCommissionCalculationList(filters)
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
    'filter[commission_type_id]': string
    'filter[business_start_date]': string
    'filter[business_end_date]': string
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

  const keys = {
    settlement_commissions: [
      'business_status_snapshot',
      'commission_types',
      'periodicities',
    ],
  }

  onMounted(async () => {
    await _getResources(keys)
    filterConfig.value[2].options.unshift({ label: 'Todos', value: '' })
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

export default useCommissionCalculationList
