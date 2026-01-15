// Vue - Pinia - moment
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// Interfaces
import { IInvestmentPlanParticipationModification } from '@/interfaces/customs/fics/InvestmentPlanParticipationModification'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import { useInvestmentPlanParticipationModificationStore } from '@/stores/fics/investment-plan-participation-modification'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const AUTHORIZATION_STATUS = {
  AUTHORIZED: 69,
  NOT_AUTHORIZED: 70,
} as const

const useInvestmentPlanParticipationModificationList = () => {
  const { defaultIconsLucide, addDaysToDate } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { is_required } = useRules()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { statuses, funts_to_investment_plans, fiduciary_investment_plans } =
    storeToRefs(useFicResourceStore('v1'))

  const { _getList, _bulkDelete, _toggleAuth } =
    useInvestmentPlanParticipationModificationStore('v1')
  const {
    investment_plan_participation_modification_list,
    investment_plan_participation_modification_pages,
  } = storeToRefs(useInvestmentPlanParticipationModificationStore('v1'))

  const selectedRows = ref<IInvestmentPlanParticipationModification[]>([])
  const filtersFormat = ref<Record<string, string | number>>({})
  const currentAction = ref<string | null>(null)
  const isTableEmpty = ref(true)
  const alertModalRef = ref()
  const showState = ref(0)
  const filtersRef = ref()

  let lastFetchedFundId: string | number | null = null
  let perPage = 20

  const alertModalConfig = ref({
    title: 'Confirmación',
    description: '',
  })

  const keys = {
    fics: ['statuses', 'funts_to_investment_plans'],
  }

  const headerProps = {
    title: 'Modificación tipo de participación de plan de inversiones',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Modificación tipo de participación de plan de inversiones',
        route: 'InvestmentPlanParticipationModificationList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'fund_id',
      label: 'Código fondo de inversión*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: funts_to_investment_plans,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val) => is_required(val, 'El fondo de inversión es requerido')],
    },
    {
      name: 'plan_code',
      label: 'Código plan de inversión',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: fiduciary_investment_plans,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'date',
      label: 'Fecha de solicitud',
      type: 'q-date',
      value: moment().format('YYYY-MM-DD'),
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
    },
    {
      name: 'request_date',
      label: 'Fecha de operación',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
    },
    {
      name: 'status_id',
      label: 'Estado de autorización',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<
    IBaseTableProps<IInvestmentPlanParticipationModification>
  >({
    title: 'Listado de solicitudes de modificación',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'center',
        sortable: true,
      },
      {
        name: 'fund',
        label: 'Fondo de inversión',
        field: 'fund',
        align: 'left',
        sortable: true,
      },
      {
        name: 'fiduciary_investment_plan',
        label: 'Plan de inversión',
        field: 'fiduciary_investment_plan',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_line',
        label: 'Línea de negocio anterior',
        field: 'business_line',
        align: 'left',
        sortable: true,
      },
      {
        name: 'new_business_line',
        label: 'Línea de negocio nueva',
        field: 'new_business_line',
        align: 'left',
        sortable: true,
      },
      {
        name: 'date',
        label: 'Fecha solicitud',
        field: 'date',
        align: 'center',
        sortable: true,
      },
      {
        name: 'operation_date',
        label: 'Fecha de operación',
        field: 'operation_date',
        align: 'center',
        sortable: true,
      },
      {
        name: 'requester',
        label: 'Usuario solicitante',
        field: 'requester',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado de autorización',
        field: (row: IInvestmentPlanParticipationModification) =>
          row.status.status,
        align: 'center',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources({ fics: ['statuses'] }, 'filter[id]=70,69,25')
    await _getResources(
      { fics: ['funts_to_investment_plans'] },
      'filter[has_participation_types]=true'
    )

    setTimeout(() => openMainLoader(false), 1000)
  }

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getList(filters)

    const hasResults =
      investment_plan_participation_modification_list.value.length > 0

    showState.value = filters ? 1 : 0
    isTableEmpty.value = !hasResults

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleFilter = async ($filters: {
    'filter[request_date]': string
    'filter[plan_code]': string
    'filter[status_id]': string
    'filter[fund_id]': string
  }) => {
    const fiduciaryInvestmentPlans = fiduciary_investment_plans.value.find(
      (p) => String(p.id) === String($filters['filter[plan_code]'])
    )

    const filters: Record<string, string | number> = {
      ...$filters,
      'filter[plan_code]': fiduciaryInvestmentPlans?.code ?? '',
    }

    delete filters['filter[date]']

    await loadData({ ...filters })
  }

  const handleClear = () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  const today = moment()
  const getRequestDate = (
    selectedFund: (typeof funts_to_investment_plans.value)[number]
  ): string => {
    if (selectedFund.last_closing_date) {
      return addDaysToDate(selectedFund.last_closing_date)
    }

    const ficParams = selectedFund.fic_parameters
    const firstFicParam = Array.isArray(ficParams) ? ficParams[0] : ficParams

    return firstFicParam?.operation_start_date ?? today.format('YYYY-MM-DD')
  }

  const onChangeFilter = async (values: Record<string, string | number>) => {
    const fundId = values['filter[fund_id]']
    if (!fundId) {
      if (filtersRef.value) {
        filtersRef.value.setFieldValueByName('plan_code', null)
        filtersRef.value.setFieldValueByName('request_date', null)
      }
      return
    }

    if (lastFetchedFundId === fundId) return

    lastFetchedFundId = fundId

    const selectedFund = funts_to_investment_plans.value.find(
      (f) => f.value === fundId
    )
    if (!selectedFund) return

    if (filtersRef.value) {
      filtersRef.value.setFieldValueByName('plan_code', null)
    }
    selectedRows.value = []
    tableProps.value.rows = []
    isTableEmpty.value = true

    openMainLoader(true)

    await _getResources(
      { fics: ['fiduciary_investment_plans'] },
      `filter[collective_investment_fund_id]=${fundId}`
    )

    openMainLoader(false)

    const requestDate = getRequestDate(selectedFund)
    if (filtersRef.value) {
      filtersRef.value.setFieldValueByName('request_date', requestDate)
    }
  }

  const updatePage = async (page: number) =>
    await loadData({ ...filtersFormat.value, page, rows: perPage })

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    await loadData({ ...filtersFormat.value, rows: perPage })
  }

  const onUpdateSelected = (val: IInvestmentPlanParticipationModification[]) =>
    (selectedRows.value = val)

  const openAuthorizeModal = async () => {
    if (selectedRows.value.length === 0) return
    currentAction.value = 'authorize'
    alertModalConfig.value.description =
      '¿Está seguro que desea autorizar los registros seleccionados?'
    await alertModalRef.value.openModal()
  }

  const openDeleteModal = async () => {
    if (selectedRows.value.length === 0) return
    currentAction.value = 'delete'
    alertModalConfig.value.description =
      '¿Desea eliminar las modificaciones de tipo de participacion seleccionadas?'
    await alertModalRef.value.openModal()
  }

  const handleModalConfirm = async () => {
    const ids = selectedRows.value.map((row) => row.id)
    let result = { success: false, message: '' }

    if (currentAction.value === 'authorize')
      result = await _toggleAuth(ids, AUTHORIZATION_STATUS.AUTHORIZED)
    else if (currentAction.value === 'delete') result = await _bulkDelete(ids)

    if (result.success) {
      await loadData({})
      selectedRows.value = []
      tableProps.value.rows = []
      isTableEmpty.value = true

      filterConfig.value.forEach((filter) => {
        filter.value = null
        if (filtersRef.value) {
          filtersRef.value.setFieldValueByName(filter.name, null)
        }
      })
    }

    currentAction.value = null
    await alertModalRef.value.closeModal()
  }

  const handleModalCancel = async () => {
    if (currentAction.value === 'authorize') {
      const ids = selectedRows.value.map((row) => row.id)
      const result = await _toggleAuth(ids, AUTHORIZATION_STATUS.NOT_AUTHORIZED)

      if (result.success) {
        await loadData({})
        selectedRows.value = []
      }
    }

    currentAction.value = null
    await alertModalRef.value.closeModal()
  }

  onMounted(async () => await loadResources())

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    investment_plan_participation_modification_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } =
        investment_plan_participation_modification_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    goToURL,
    showState,
    filtersRef,
    updatePage,
    tableProps,
    headerProps,
    handleClear,
    isTableEmpty,
    filterConfig,
    handleFilter,
    selectedRows,
    currentAction,
    alertModalRef,
    updatePerPage,
    onChangeFilter,
    validateRouter,
    openDeleteModal,
    onUpdateSelected,
    alertModalConfig,
    handleModalCancel,
    defaultIconsLucide,
    handleModalConfirm,
    openAuthorizeModal,
  }
}

export default useInvestmentPlanParticipationModificationList
