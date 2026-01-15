// vue | quasar | router
import { QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import {
  useChartAccountsStore,
  useResourceManagerStore,
  useAccountingResourceStore,
} from '@/stores'

import { useRouteValidator, useUtils } from '@/composables'

// interfaces
import { IStructureChartAccount } from '@/interfaces/customs'

const useChartAccountsList = () => {
  // imports
  const router = useRouter()

  const { formatParamsCustom } = useUtils()

  const { validateRouter } = useRouteValidator()

  const { _getListAction } = useChartAccountsStore('v2')

  const { chart_accounts_list, chart_accounts_pages } = storeToRefs(
    useChartAccountsStore('v2')
  )

  const {
    account_chart_structure_accounting,
    account_structure_statuses,
    account_chart_purposes,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

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
    title: 'Listado de plan de cuentas',
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
        name: 'structure_code',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: 'code',
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
        name: 'structure',
        required: true,
        label: 'Diseño de la estructura',
        align: 'left',
        field: 'structure',
        sortable: true,
      },
      {
        name: 'status_id',
        required: false,
        label: 'Estado de la estructura',
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

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  // keys
  const keys = ['account_structure_statuses', 'account_chart_purposes']

  const keysV2 = {
    accounting: ['account_chart_structure_accounting'],
  }

  onMounted(async () => {
    _resetKeys({ accounting: [...keys, ...keysV2.accounting] })
    await _getResources({ accounting: keys })
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
    updatePage,
    updateRows,
    handleClearFilters,
  }
}

export default useChartAccountsList
