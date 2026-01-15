// vue - quasar - router
import { useRouter } from 'vue-router'
import { onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// pinia
import { storeToRefs } from 'pinia'

// stores
import {
  useResourceStore,
  useDesactivateDailyClousingVouchersStore,
} from '@/stores'

// utils
import { formatParamsCustom } from '@/utils'

// interfaces
import { IDesativateDailyClosingVouchers } from '@/interfaces/customs'
import { useRouteValidator } from '@/composables'

const useDesactivateDailyClousingVouchersList = () => {
  // imports
  const router = useRouter()

  const { validateRouter } = useRouteValidator()

  const { _getListAction } = useDesactivateDailyClousingVouchersStore('v1')

  const { desactivate_daily_closing_list, desactivate_daily_closing_pages } =
    storeToRefs(useDesactivateDailyClousingVouchersStore('v1'))

  const {
    account_structures_active_revert_vouchers,
    daily_closing_business_by_account_structure,
  } = storeToRefs(useResourceStore('v1'))

  const keys = [
    'account_structures_active',
    'daily_closing_business_by_account_structure',
  ]

  const { _getAccountingResources } = useResourceStore('v1')

  // props
  const headerProps = {
    title: 'Desactualizar comprobantes de cierre diario',
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
        label: 'Desactualizar comprobantes de cierre diario',
        route: 'DesactivateDailyClosingList',
      },
    ],
  }

  // table
  const tableProps = ref({
    title: 'Listado de comprobantes desactualizados',
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
        name: 'structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: 'structure',
        sortable: true,
      },
      {
        name: 'from_business',
        required: true,
        label: 'Desde negocio',
        align: 'left',
        field: (row) =>
          `${row.from_business_trust_id?.business_code} - ${row.from_business_trust_id?.business_name}`,
        sortable: true,
      },
      {
        name: 'to_business',
        required: false,
        label: 'Hasta negocio',
        align: 'center',
        field: (row) =>
          `${row.to_business_trust_id?.business_code} - ${row.to_business_trust_id?.business_name}`,
        sortable: true,
      },
      {
        name: 'last_closing_daily',
        required: false,
        label: 'Último cierre diario',
        align: 'center',
        field: (row) => row.last_closing_daily,
        sortable: true,
      },
      {
        name: 'revert_balances_date',
        required: true,
        label: 'Desactualizados saldos a',
        align: 'center',
        field: (row) => row.revert_balances_date,
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IDesativateDailyClosingVouchers[],
    pages: desactivate_daily_closing_pages.value,
  })

  // filter
  const filterConfig = ref([
    {
      name: 'account_structure_code',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-4 q-py-md',
      options: account_structures_active_revert_vouchers,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'from_business_trust_id',
      label: 'Desde negocio',
      type: 'q-select',
      value: null,
      class: 'col-4 q-py-md',
      options: daily_closing_business_by_account_structure,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'to_business_trust_id',
      label: 'Hasta negocio',
      type: 'q-select',
      value: null,
      class: 'col-4 q-py-md',
      options: daily_closing_business_by_account_structure,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[account_structure_code]': string
    'filter[from_business_trust_id]': string
    'filter[to_business_trust_id]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
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

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const handleCleanFilters = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  onMounted(async () => {
    await _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  watch(
    () => desactivate_daily_closing_list.value,
    () => {
      tableProps.value.rows = desactivate_daily_closing_list.value
      tableProps.value.pages = desactivate_daily_closing_pages.value
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,

    handleFilter,
    handlerGoTo,
    updatePage,
    updateRows,
    validateRouter,
    handleCleanFilters,
  }
}

export default useDesactivateDailyClousingVouchersList
