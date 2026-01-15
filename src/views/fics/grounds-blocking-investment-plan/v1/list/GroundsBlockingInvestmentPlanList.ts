// Vue - Vue Router - Pinia - Quasar
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { StatusID } from '@/interfaces/global'
import {
  IGroundsBlockingInvestmentPlanTable,
  IGroundsBlockingInvestmentPlanItemList,
} from '@/interfaces/customs/fics/GroundsBlockingInvestmentPlan'
import {
  IFilterConfig,
  IStatusResource,
  IFilterConfigOptions,
} from '@/interfaces/customs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useGroundsBlockingInvestmentPlanStore } from '@/stores/fics/grounds-blocking-investment-plan'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useGroundsBlockingInvestmentPlanList = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const {
    rounds_blocking_investment_plan_list,
    rounds_blocking_investment_plan_pages,
  } = storeToRefs(useGroundsBlockingInvestmentPlanStore('v1'))
  const { _getGroundsBlockingInvestment, _updateStatus } =
    useGroundsBlockingInvestmentPlanStore('v1')

  const { grounds_blocking_investment_status } = useFicResourceStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const filtersFormat = ref<Record<string, string | number | null | undefined>>(
    {}
  )
  const isTableEmpty = ref(true)
  const alertModalRef = ref()
  const showState = ref(0)

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
    status_id: null as number | null,
  })

  const keys = {
    fics: ['status_blocking_reason_investment'],
  }

  const headerProps = {
    title: 'Causales de bloqueos plan de inversión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Causales de bloqueos plan de inversión',
        route: 'GroundsBlockingInvestmentPlanList',
      },
    ],
  }

  const filterConfig = ref<IFilterConfig[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      options: [] as IFilterConfigOptions[],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por descripción o código',
      prepend_icon: defaultIconsLucide.magnify,
    },
  ])

  const tableProps = ref({
    title: 'Listado de causales de bloqueos plan de inversión',
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
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IGroundsBlockingInvestmentPlanTable[],
    pages: rounds_blocking_investment_plan_pages,
  })

  const handleFilter = (
    $filters: Record<string, string | number | null | undefined>
  ) => {
    filtersFormat.value = {
      ...$filters,
      paginate: 1,
    }
    let query = ''

    if ($filters['filter[status_id]'] === 'all') {
      query = 'paginate=1&status=all'
    } else {
      const queryString = formatParamsCustom(filtersFormat.value)
      query = queryString ? '&' + queryString : ''
    }
    listAction(query)
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: 20,
      paginate: 1,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      paginate: 1,
    }
    listAction(formatParamsCustom(filtersFormat.value))
  }

  const listAction = async (filter: string = 'paginate=1') => {
    openMainLoader(true)
    tableProps.value.rows = []

    const pairs = filter.split('&')

    const filtered = pairs.filter((param) => !param.includes('_name')).join('&')

    await _getGroundsBlockingInvestment(filtered)

    const hasResults = rounds_blocking_investment_plan_list.value.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filtered ? 1 : 0

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleClear = () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const setAlertModalDescription = (statusId: number) => {
    const action = statusId === StatusID.ACTIVE ? 'inactivar' : 'activar'
    return `¿Desea ${action} esta causal?`
  }

  const openAlertModal = async (
    row: IGroundsBlockingInvestmentPlanItemList
  ) => {
    if (!row.id) return
    alertModalConfig.value.description = setAlertModalDescription(
      Number(row.status_id ?? 0)
    )
    alertModalConfig.value.id = row.id
    alertModalConfig.value.status_id = Number(row.status_id)
    await alertModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _updateStatus(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  watch(
    () => rounds_blocking_investment_plan_list.value,
    () => {
      tableProps.value.rows =
        rounds_blocking_investment_plan_list.value as IGroundsBlockingInvestmentPlanTable[]
      tableProps.value.pages = rounds_blocking_investment_plan_pages.value
    }
  )

  onMounted(async () => {
    if (route.query.reload === 'true') await listAction()

    await _getResources(keys)
    filterConfig.value[0].options = [
      { label: 'Todos', value: 'all' },
      ...grounds_blocking_investment_status.map((option: IStatusResource) => ({
        label: option.label,
        value: String(option.value),
      })),
    ]
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    alertModalConfig,
    alertModalRef,
    filtersFormat,
    filterConfig,
    headerProps,
    tableProps,
    changeStatusAction,
    openAlertModal,
    updatePerPage,
    handleFilter,
    handleClear,
    isRowActive,
    goToURL,
    updatePage,
    showState,
    isTableEmpty,
    defaultIconsLucide,
  }
}

export default useGroundsBlockingInvestmentPlanList
