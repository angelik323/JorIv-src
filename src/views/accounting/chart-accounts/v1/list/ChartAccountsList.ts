// vue | quasar | router
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import {
  useChartAccountsStore,
  useResourceStore,
  useResourceManagerStore,
  useAccountingResourceStore,
} from '@/stores'

// composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// utils
import { formatParamsCustom } from '@/utils'

// interfaces
import { IStructureChartAccount } from '@/interfaces/customs'
import { useRouteValidator } from '@/composables'

const useChartAccountsList = () => {
  // imports
  const router = useRouter()

  const { validateRouter } = useRouteValidator()

  const { openMainLoader } = useMainLoader()

  const { _getListAction, _changeStatusAction } = useChartAccountsStore('v1')

  const { chart_accounts_list, chart_accounts_pages } = storeToRefs(
    useChartAccountsStore('v1')
  )

  const { account_structure_statuses, account_chart_purposes } = storeToRefs(
    useResourceStore('v1')
  )

  const { account_chart_structure_accounting } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { _getAccountingResources } = useResourceStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  // keys
  const keys = ['account_structure_statuses', 'account_chart_purposes']

  const keysV2 = {
    accounting: ['account_chart_structure_accounting'],
  }

  // props
  const headerProps = {
    title: 'Plan de cuentas',
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
        label: 'Plan de cuentas',
        route: 'ChartAccountsList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de cuentas',
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
        label: 'Estructura',
        align: 'left',
        field: 'structure',
        sortable: true,
      },
      {
        name: 'purpose',
        required: true,
        label: 'Finalidad',
        align: 'left',
        field: 'purpose',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status_id',
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
    rows: [] as IStructureChartAccount[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  // filter
  const filterConfig = ref([
    {
      name: 'code',
      label: 'Código estructura',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-4 col-md-4 col-lg-4 q-py-md',
      options: account_chart_structure_accounting,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
    },
    {
      name: 'purpose',
      label: 'Finalidad',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-4 col-md-4 col-lg-4 q-py-md',
      options: account_chart_purposes,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-4 col-md-4 col-lg-4 q-py-md',
      options: account_structure_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[code]': string
    'filter[purpose]': string
    'filter[status]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
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

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  // actions
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const changeStatusAction = async () => {
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _changeStatusAction(
      alertModalConfig.value.entityId as number,
      alertModalConfig.value.statusId as number
    )
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    await _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
    await _getResources(keysV2, '', 'v2')
  })

  // modal
  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
    statusId: null as number | null,
  })

  const openAlertModal = async (
    status: string,
    entityId: number,
    statusId: number
  ) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    alertModalConfig.value.statusId = statusId
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el plan de cuentas?`
  }

  // watch
  watch(
    () => chart_accounts_list.value,
    () => {
      tableProps.value.rows = chart_accounts_list.value
      tableProps.value.pages = chart_accounts_pages.value
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    alertModalRef,

    validateRouter,
    handleFilter,
    handlerGoTo,
    openAlertModal,
    changeStatusAction,
    updatePage,
    updateRows,
    handleClearFilters,
  }
}

export default useChartAccountsList
