// Vue - ¨Pinia - Router
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IGenericInvestmentPlans } from '@/interfaces/customs/fics/GenericInvestmentPlans'
import { IFieldFilters } from '@/interfaces/customs/Filters'

// Composables
import {
  useUtils,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

// Stores
import { useGenericInvestmentPlansStore } from '@/stores/fics/generic-investment-plans'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { IBaseTableProps } from '@/interfaces/global'

const useGenericInvestmentPlansList = () => {
  const { defaultIconsLucide, formatCurrency } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { generic_investment_list, generic_investment_pages } = storeToRefs(
    useGenericInvestmentPlansStore('v1')
  )
  const { funts_to_investment_plans } = storeToRefs(useFicResourceStore('v1'))

  const { _listAction } = useGenericInvestmentPlansStore('v1')
  const { _getResources } = useResourceManagerStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const isGenericInvestmentPlansEmpty = ref(true)
  const showState = ref(0)

  const headerProps = {
    title: 'Planes de inversión genéricos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Planes de inversión genéricos',
        route: 'GenericInvestmentPlansList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'investment_found',
      label: 'Fondo de inversión',
      type: 'q-select',
      options: funts_to_investment_plans,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      value: null,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por código de plan de inversión genérico',
    },
  ])

  const tableProps = ref<IBaseTableProps<IGenericInvestmentPlans>>({
    title: 'Listado de planes genéricos',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'investment_plan',
        label: 'Plan de inversión',
        field: (row) => row.fiduciary_investment_plan || '-',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'investment_fund',
        label: 'Fondo de inversión',
        field: (row) => row.collective_investmen_fund || '-',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'description_investment_plan',
        label: 'Descripción del plan de inversión',
        field: (row) => row.description_investment_plan || '-',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'participation_type',
        label: 'Tipo de participación',
        field: (row) => row.participation_type || '-',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'method_payment',
        label: 'Forma de pago',
        field: (row) => row.treasurie_pay_form || '-',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'plan_balance',
        label: 'Saldo del plan',
        field: (row) =>
          row.plan_balance ? formatCurrency(row.plan_balance) : '-',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'id',
        align: 'center',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _listAction(filters)

    const hasResults = generic_investment_list.value.length > 0

    showState.value = filters ? 1 : 0
    isGenericInvestmentPlansEmpty.value = !hasResults

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleFilter = async ($filters: {
    'filter[investment_found]': string
    'filter[search]': string
  }) => await loadData({ ...$filters })

  const handleClearFilters = () => {
    showState.value = 0
    tableProps.value.rows = []
    isGenericInvestmentPlansEmpty.value = true
  }

  const handleUpdatePage = async (page: number) =>
    await loadData({ ...filtersFormat.value, page })

  const handleUpdateRowsPerPage = async (rowsPerPage: number) =>
    await loadData({ ...filtersFormat.value, rows: rowsPerPage })

  const handleOption = (action: string, id: number) => {
    if (action === 'view') goToURL('GenericInvestmentPlansLegalizeView', id)
    else if (action === 'create')
      goToURL('GenericInvestmentPlansLegalizeCreate', id)
    else if (action === 'delete')
      goToURL('GenericInvestmentPlansLegalizeCancel', id)
  }

  onMounted(async () => {
    if (route.query.reload === 'true') await loadData({})

    openMainLoader(true)

    await _getResources({ fics: ['funts_to_investment_plans'] })

    setTimeout(() => openMainLoader(false), 1000)
  })

  watch(
    generic_investment_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = generic_investment_pages.value
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
    tableProps,
    headerProps,
    filterConfig,
    handleFilter,
    handleOption,
    validateRouter,
    handleUpdatePage,
    defaultIconsLucide,
    handleClearFilters,
    handleUpdateRowsPerPage,
    isGenericInvestmentPlansEmpty,
  }
}

export default useGenericInvestmentPlansList
