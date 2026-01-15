// vue - pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'
import { IDesativateDailyClosingVouchersListItem } from '@/interfaces/customs/accounting/DesactivateDailyClosingVouchersV2'

// composables
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

// stores
import { useDesactivateDailyClousingVouchersStore } from '@/stores/accounting/desactivate-daily-clousing-vouchers'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

const useDesactivateDailyClousingVouchersList = () => {
  const { goToURL } = useGoToUrl()
  const { formatParamsCustom, defaultIconsLucide } = useUtils()

  const { validateRouter } = useRouteValidator()

  const { _getListAction } = useDesactivateDailyClousingVouchersStore('v2')

  const keys_v2 = {
    accounting: ['accounting_account_structures'],
  }

  const { accounting_account_structures, business_trusts_for_period_opening } =
    storeToRefs(useAccountingResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // props
  const headerProps = {
    title: 'Desactualización de cierre diario',
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
        label: 'Desactualización de cierre diario',
        route: 'DesactivateDailyClosingList',
      },
    ],
  }

  // filter
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: accounting_account_structures,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'current_period',
      label: 'Periodo actual',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
    },
    {
      name: 'business_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_for_period_opening,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[account_structure_code]': string
    'filter[period]': string
    'filter[business_trust_id]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // table
  const tableProps = ref<
    IBaseTableProps<IDesativateDailyClosingVouchersListItem>
  >({
    title: 'Listado de procesos de desactualización',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'accounting_structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: 'accounting_structure',
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: 'business',
        sortable: true,
      },
      {
        name: 'current_period',
        required: true,
        label: 'Periodo actual',
        align: 'left',
        field: 'current_period',
        sortable: true,
      },
      {
        name: 'initial_date',
        required: true,
        label: 'Fecha inicial',
        align: 'left',
        field: 'initial_date',
        sortable: true,
      },
      {
        name: 'final_date',
        required: true,
        label: 'Fecha final',
        align: 'left',
        field: 'final_date',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const { data_list, pages } = await _getListAction(filters)
    tableProps.value.rows = data_list
    tableProps.value.pages = pages
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rows,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction('&' + queryString)
  }

  const handleCleanFilters = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  onMounted(async () => {
    _getResources(keys_v2, '', 'v2')
    _getResources(
      { accounting: ['business_trusts_for_period_opening'] },
      'filter[daily_closing]=true',
      'v2'
    )
  })

  onBeforeUnmount(() => {
    _resetKeys(keys_v2)
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    defaultIconsLucide,
    handleFilter,
    goToURL,
    updatePage,
    updateRows,
    validateRouter,
    handleCleanFilters,
  }
}

export default useDesactivateDailyClousingVouchersList
