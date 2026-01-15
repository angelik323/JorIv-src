// Vue - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IFiduciaryInvestmentPlanItem,
  IFiduciaryInvestmentPlansToggleStatus,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import {
  useRules,
  useUtils,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryInvestmentPlanList = () => {
  const { defaultIconsLucide, isEmptyOrZero } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { is_required } = useRules()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    plan_business_trusts,
    funts_to_investment_plans,
    status_investment_plan_to_filter,
    blocking_reasons_on_investment_plans,
  } = storeToRefs(useFicResourceStore('v1'))
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const {
    _clearData,
    _setDataSelection,
    _setDataToggleStatus,
    _getFiduciaryInvestmentPlanList,
    _toggleStatusFiduciaryInvestmentPlan,
  } = useFiduciaryInvestmentPlanStore('v1')

  const {
    data_toggle_status,
    fiduciary_investment_plan_list,
    fiduciary_investment_plan_pages,
  } = storeToRefs(useFiduciaryInvestmentPlanStore('v1'))

  const filtersFormat = ref<Record<string, string | number>>({})
  const isTableEmpty = ref(true)
  const hideFilters = ref(true)
  const selectedRows = ref([])
  const alertModalRef = ref()
  const formStatus = ref()
  const showState = ref(0)

  const models = ref<IFiduciaryInvestmentPlansToggleStatus>({
    status_id: null,
    blocking_reason_id: null,
    status_observation: null,
  })

  const fiduciary_investment_plan_options = (id: number) => [
    {
      label: 'Cuentas',
      action: () => goToURL('AccountManagementList', id),
    },
    {
      label: 'Ajustes',
      action: () => goToURL('AccountAdjustmentCreate', id),
    },
    {
      label: 'Consultar saldo',
      action: () => goToURL('CheckBalancesView', id),
    },
    {
      label: 'Consultar unidades',
      action: () => goToURL('ConsultUnitsView', id),
    },
  ]

  const headerProps = {
    title: 'Planes de inversión fiduciarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Planes de inversión fiduciarios',
        route: 'FiduciaryInvestmentPlanList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'collective_investment_fund_id',
      label: 'Fondo de inversión*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: funts_to_investment_plans,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
      rules: [],
    },
    {
      name: 'collectiveInvestmentFund.business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: plan_business_trusts,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código de plan',
      hide: false,
    },
    {
      name: 'fipHolderIdentifications.holder_id',
      label: 'Identificación titular',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: third_parties,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: status_investment_plan_to_filter,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const tableProps = ref({
    title: 'Listado de planes de inversión',
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
        name: 'investment_plan',
        field: 'code',
        required: false,
        label: 'Plan de inversión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'investment_fund',
        field: (item) =>
          item.collective_investment_fund
            ? `${item.collective_investment_fund.fund_code} - ${item.collective_investment_fund.fund_name}`
            : 'Sin fondo',
        required: false,
        label: 'Fondo de inversión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business',
        field: (item) =>
          item.business_trust
            ? `${item.business_trust.business_code} - ${item.business_trust.name}`
            : 'Sin negocio',
        required: false,
        label: 'Negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'holder_identification',
        field: (item) =>
          item.titular
            ? `${item.titular.document} - ${item.titular.name}`
            : 'Sin titular',
        required: false,
        label: 'Identificación titular',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
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
    rows: [] as IFiduciaryInvestmentPlanItem[],
    pages: fiduciary_investment_plan_pages.value,
  })

  const handleFilter = async ($filters: {
    'filter[collective_investment_fund_id]': string
    'filter[collectiveInvestmentFund.business_trust_id]': string
    'filter[search]': string
    'filter[fipHolderIdentifications.holder_id]': string
    'filter[status_id]': string
  }) => await listAction({ ...$filters })

  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value

    for (let i = 3; i < filterConfig.value.length; i++) {
      filterConfig.value[i].hide = hideFilters.value
    }
  }

  const handleSelectedRows = (val: IFiduciaryInvestmentPlanItem[]) => {
    _setDataSelection(val)
  }

  const listAction = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getFiduciaryInvestmentPlanList(filters)

    const hasResults = fiduciary_investment_plan_list.value.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filters ? 1 : 0

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleToggleStatus = () => alertModalRef.value?.openModal()

  const makePayload = () => {
    return {
      status_id: data_toggle_status.value?.status_id ?? null,
      blocking_reason_id: data_toggle_status.value?.blocking_reason_id ?? null,
      status_observation: data_toggle_status.value?.status_observation ?? null,
    }
  }

  const toggleStatus = async () => {
    if (!(await formStatus.value?.validate())) return

    const payload = makePayload()

    openMainLoader(true)
    await Promise.all(
      (selectedRows.value as Array<{ id: number }>).map((item) =>
        _toggleStatusFiduciaryInvestmentPlan(item.id, payload)
      )
    )

    selectedRows.value = []
    _setDataSelection(null)

    await listAction({ ...filtersFormat.value })
    openMainLoader(false)

    models.value = {
      status_id: null,
      blocking_reason_id: null,
      status_observation: null,
    }

    alertModalRef.value?.closeModal()
  }

  const clearFilters = () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  const updatePage = async (page: number) =>
    await listAction({ ...filtersFormat.value, page })

  const updatePerPage = async (rowsPerPage: number) =>
    await listAction({ ...filtersFormat.value, rows: rowsPerPage })

  const keys = {
    fics: [
      'plan_business_trusts',
      'funts_to_investment_plans',
      'status_investment_plan_to_filter',
      'blocking_reasons_on_investment_plans',
    ],
  }
  const keysThirdParty = {
    key: {
      third_party: ['third_parties'],
    },
    params:
      'sort=id&include=legalPerson,financialInfo,naturalPerson,estate,documentType,contacts,addresses,status&filter[is_customer]=true&fields[]=id,document,is_customer,third_party_category,document_type_id,status_id',
  }
  
  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys({ fics: ['plan_business_trusts'] })
    _resetKeys(keysThirdParty.key)
  })

  onMounted(async () => {
    _clearData()

    openMainLoader(true)

    await _getResources(keys)
    await _getResources({ fics: ['plan_business_trusts'] })
    await _getResources(keysThirdParty.key, keysThirdParty.params)

    await listAction({})

    openMainLoader(false)
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataToggleStatus(null)
      } else {
        _setDataToggleStatus({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => fiduciary_investment_plan_list.value,
    () => {
      tableProps.value.rows = fiduciary_investment_plan_list.value
      tableProps.value.pages.currentPage =
        fiduciary_investment_plan_pages.value.currentPage
      tableProps.value.pages.lastPage =
        fiduciary_investment_plan_pages.value.lastPage
    },
    { deep: true }
  )

  return {
    models,
    goToURL,
    showState,
    tableProps,
    formStatus,
    updatePage,
    headerProps,
    is_required,
    filterConfig,
    toggleStatus,
    selectedRows,
    clearFilters,
    isTableEmpty,
    handleFilter,
    alertModalRef,
    updatePerPage,
    validateRouter,
    handleSelectedRows,
    handleToggleStatus,
    defaultIconsLucide,
    handleShowMoreFilters,
    status_investment_plan_to_filter,
    fiduciary_investment_plan_options,
    blocking_reasons_on_investment_plans,
  }
}

export default useFiduciaryInvestmentPlanList
