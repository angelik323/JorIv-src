// Vue - pinia - moment
import { ref, computed, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IFieldFilters,
  IPaginatedFiltersFormat,
  ResourceTypes,
} from '@/interfaces/customs'
import {
  IBudgetClosureProcessType,
  IBudgetClosureBusinessItem,
  IBudgetClosureClosureType,
  IBudgetClosureCreateClosure,
} from '@/interfaces/customs/budget/BudgetClosure'

// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Composables
import { useMainLoader } from '@/composables'
import { useUtils } from '@/composables/useUtils'
import { useCalendarRules } from '@/composables/useCalendarRules'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useRules } from '@/composables/useRules'

// Stores
import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import { useBudgetClosureStore } from '@/stores/budget/budget-closure'

// Constants
import {
  BUDGET_CLOSURE_CREATE_PROCESS_TYPE_FILTER_OPTIONS,
  BUDGET_CLOSURE_CREATE_CLOSURE_TYPE_FILTER_OPTIONS,
} from '@/constants/resources/budget'

const useBudgetClosureCreate = () => {
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { is_required } = useRules()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { business_trusts_selector } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { _getBusinessList, _createBudgetClosure } = useBudgetClosureStore('v1')

  const headerConfig = {
    title: 'Crear cierre o deshacer cierre de presupuestos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Presupuesto',
        route: '',
      },
      {
        label: 'Cierre de presupuestos',
        route: 'BudgetClosureList',
      },
      {
        label: 'Crear',
        route: '',
      },
    ],
  }

  // Refs & Computed props

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = ref(tabs[0].name)
  const tabActiveIdx = computed<number>(() =>
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const alertModalRef = ref<InstanceType<typeof AlertModalComponent> | null>(
    null
  )

  const alertModalTitle = ref<string>('')

  const processType = ref<IBudgetClosureProcessType>('crear')

  const filtersRef = ref<InstanceType<typeof FiltersComponent> | null>(null)

  const filtersFormat = ref<IPaginatedFiltersFormat>({
    page: 1,
    rows: 20,
  })

  const keys: ResourceTypes = {
    accounting: ['business_trusts_selector'],
  }

  const getBusinessTrustSelector = async (closureType?: string) => {
    if (!closureType) {
      filtersRef.value?.cleanFiltersByNames(['business_from', 'business_to'])
      return
    }

    const closingType = closureType === 'diario' ? 'daily' : 'monthly'

    openMainLoader(true)
    await _getResources(
      keys,
      `filter[can]=true&filter[has_budget]=true&filter[budget_closing_type]=${closingType}`,
      'v2'
    )
    openMainLoader(false)
  }

  const filtersConfig = ref<IFieldFilters[]>([
    {
      name: 'closure_type',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Tipo de cierre*',
      value: null,
      options: BUDGET_CLOSURE_CREATE_CLOSURE_TYPE_FILTER_OPTIONS,
      clean_value: true,
      disable: false,
      rules: [(v: string) => is_required(v)],
      onChange: (v: string) => {
        filtersFormat.value['filter[closure_type]'] = v
        getBusinessTrustSelector(v ?? undefined)
      },
    },

    {
      name: 'business_from',
      label: 'Negocio desde*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_selector,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [(v: string) => is_required(v)],
    },
    {
      name: 'business_to',
      label: 'Negocio hasta*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_selector,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [(v: string) => is_required(v)],
    },
    {
      name: 'closing_date',
      label: 'Fecha de cierre*',
      type: 'q-date',
      value: null,
      placeholder: 'YYYY-MM-DD',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      rules: [(v: string) => is_required(v)],
      option_calendar: (date: string) => {
        return filtersFormat.value['filter[closure_type]'] === 'mensual'
          ? useCalendarRules().only_last_day_month(date)
          : true
      },
    },
    {
      name: 'last_closing_date',
      label: 'Última fecha de cierre*',
      type: 'q-date',
      value: null,
      placeholder: 'YYYY-MM-DD',
      class: 'col-12 col-md-4',
      disable: true,
      clean_value: true,
      mask: 'YYYY-MM-DD',
    },
  ])

  const businessTableProps = ref<IBaseTableProps<IBudgetClosureBusinessItem>>({
    title: 'Listado de negocios',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        align: 'left',
        required: false,
        sortable: true,
      },
      {
        name: 'business',
        field: 'business',
        label: 'Código/Negocio',
        align: 'left',
        required: false,
        sortable: true,
      },
      {
        name: 'current_period',
        field: 'current_period',
        label: 'Periodo',
        align: 'left',
        required: false,
        sortable: true,
      },
      {
        name: 'closing_type',
        field: (row: IBudgetClosureBusinessItem) =>
          row.budget.closing_type === 'monthly' ? 'Mensual' : 'Diario',
        label: 'Tipo de cierre',
        align: 'left',
        required: false,
        sortable: true,
      },
      {
        name: 'last_closing_date',
        field: (row: IBudgetClosureBusinessItem) =>
          useUtils().formatDate(row.budget.last_closing_date, 'YYYY-MM-DD'),
        label: 'Fecha último cierre',
        align: 'left',
        required: false,
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const selectedBusinesses = ref<IBudgetClosureBusinessItem[]>([])

  const hasSelectedBusinesses = computed<boolean>(
    () => selectedBusinesses.value.length > 0
  )

  const handleSelectBusinesses = (businesses: IBudgetClosureBusinessItem[]) =>
    (selectedBusinesses.value = businesses)

  // Functions/Methods

  const setLastClosingDate = (
    closingDateStr: string | undefined,
    closureType: IBudgetClosureClosureType | undefined
  ) => {
    if (!closingDateStr || !closureType) {
      filtersRef.value?.cleanFiltersByNames(['last_closing_date'])
      return
    }

    const closingDate = moment(closingDateStr)

    if (closureType === 'diario') {
      filtersRef.value?.setFieldValueByName(
        'last_closing_date',
        closingDate.subtract(1, 'day').format('YYYY-MM-DD')
      )
      return
    }

    if (closureType === 'mensual') {
      filtersRef.value?.setFieldValueByName(
        'last_closing_date',
        closingDate.subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
      )
      return
    }
  }

  const handleFiltersUpdate = (filters: IPaginatedFiltersFormat) => {
    const {
      'filter[closing_date]': closingDate,
      'filter[closure_type]': closureType,
    } = filters

    setLastClosingDate(
      closingDate as string,
      closureType as IBudgetClosureClosureType
    )
  }

  const listAction = async (rawFilters: IPaginatedFiltersFormat) => {
    const { 'filter[closing_date]': _closingDate, ...filters } = rawFilters

    businessTableProps.value.rows = []
    businessTableProps.value.loading = true

    const response = await _getBusinessList(filters)
    businessTableProps.value.rows = response.list
    businessTableProps.value.pages = response.pages

    businessTableProps.value.loading = false
  }

  const handleFilterSearch = async (filters: IPaginatedFiltersFormat) => {
    filtersFormat.value = {
      ...filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const handleClearFilters = () => {
    businessTableProps.value.rows = []
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    await listAction(filtersFormat.value)
  }

  const buildExecutePayload = (
    filters: IPaginatedFiltersFormat,
    selectedBusinesses: IBudgetClosureBusinessItem[]
  ): IBudgetClosureCreateClosure | null => {
    const {
      'filter[closure_type]': closure_type,
      'filter[business_from]': business_from,
      'filter[business_to]': business_to,
      'filter[closing_date]': closing_date,
    } = filters

    if (!closure_type || !business_from || !business_to || !closing_date)
      return null

    return {
      action_type: processType.value,
      closure_type: closure_type as IBudgetClosureClosureType,
      business_from: business_from as number,
      business_to: business_to as number,
      closure_date: closing_date as string,
      selected_businesses: selectedBusinesses.map((business) => business.id),
    }
  }

  const setAlertModalTitle = (
    processType: IBudgetClosureProcessType,
    processId: string
  ): string => {
    const processTypeMsg =
      processType === 'crear'
        ? 'Cierre de presupuestos'
        : 'Deshacer cierre de presupuestos'

    return `Se ha iniciado el proceso de ${processTypeMsg} número ${processId}`
  }

  const handleExecuteProcess = async () => {
    const payload = buildExecutePayload(
      filtersFormat.value,
      selectedBusinesses.value
    )

    if (!payload) return

    const resp = await _createBudgetClosure(payload)

    if (!resp) return

    alertModalTitle.value = setAlertModalTitle(payload.action_type, resp.job_id)
    alertModalRef.value?.openModal()
  }

  const handleGoToProcessList = () => goToURL('BudgetClosureList')

  // Life cycle hooks

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    BUDGET_CLOSURE_CREATE_PROCESS_TYPE_FILTER_OPTIONS,

    headerConfig,
    tabs,
    tabActive,
    tabActiveIdx,
    alertModalRef,
    alertModalTitle,
    processType,
    filtersRef,
    filtersConfig,
    businessTableProps,
    hasSelectedBusinesses,

    handleFiltersUpdate,
    handleFilterSearch,
    handleClearFilters,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    handleExecuteProcess,
    handleGoToProcessList,
    handleSelectBusinesses,
  }
}

export default useBudgetClosureCreate
