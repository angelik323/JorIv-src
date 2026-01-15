// Vue - Vue Router - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { ICollectiveInvestmentFundResponse } from '@/interfaces/customs/fics/CollectiveInvestmentFunds'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCollectiveInvestmentFundsList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const collectiveInvestmentFundsStore = useCollectiveInvestmentFundsStore('v1')
  const { fund_business_trusts } = storeToRefs(useFicResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { collective_investment_fund_list, collective_investment_fund_pages } =
    storeToRefs(collectiveInvestmentFundsStore)
  const { _listAction } = collectiveInvestmentFundsStore
  const { validateRouter } = useRouteValidator()

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const isCollectiveInvestmentFundsEmpty = ref(true)
  const showState = ref(0)

  const headerProps = {
    title: 'Fondos de inversión colectiva',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Fondos de inversión colectiva',
        route: 'CollectiveInvestmentFundsList',
      },
    ],
  }

  const filterConfig = ref([
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: fund_business_trusts,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'search',
      label: 'Buscar fondo',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por código o nombre',
    },
  ])

  const tableProps = ref({
    title: 'Listado de fondos',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
      },
      {
        name: 'fund_code',
        required: true,
        label: 'Código de fondo',
        align: 'left',
        field: 'fund_code',
        sortable: true,
      },
      {
        name: 'fund_name',
        required: true,
        label: 'Nombre de fondo',
        align: 'left',
        field: 'fund_name',
        sortable: true,
      },
      {
        name: 'business_trust_id',
        required: true,
        label: 'Código de negocio',
        align: 'left',
        field: (row) => row.business_trust.business_code ?? '-',
        sortable: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
      },
    ] as QTable['columns'],
    customColumns: ['actions'],
    rows: [] as ICollectiveInvestmentFundResponse[],
    pages: collective_investment_fund_pages,
  })

  const collectiveInvestmentFundsOptions = (id: number) => [
    {
      label: 'Consulta porcentaje',
      action: () => goToURL('ConsultPercentagesView', id),
    },
    {
      label: 'Consulta rentabilidades',
      action: () => goToURL('ConsultProfitabilityView', id),
    },
    {
      label: 'Documento 523',
      action: () => goToURL('ConsultTransmisionFormat523View', id),
    },
    {
      label: 'Código de registro 77',
      action: () => goToURL('ParticipationTypeSequencesCreate', id),
    },
  ]

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    tableProps.value.loading = true

    await _listAction(filters)
    const hasResults = collective_investment_fund_list.value.length > 0

    showState.value = filters ? 1 : 0
    isCollectiveInvestmentFundsEmpty.value = !hasResults

    setTimeout(() => {
      tableProps.value.loading = false
      openMainLoader(false)
    }, 1000)
  }

  const handleFilter = async ($filters: {
    'filter[business_trust_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await loadData(filtersFormat.value)
  }

  const handleClearFilters = () => {
    showState.value = 0
    tableProps.value.rows = []
    isCollectiveInvestmentFundsEmpty.value = true
  }

  const handleOptions = async (option: string, id: number) => {
    if (option === 'view') goToURL('CollectiveInvestmentFundsView', id)
    else if (option === 'edit') goToURL('CollectiveInvestmentFundsEdit', id)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await loadData(filtersFormat.value)
  }

  const handleUpdatePerPage = async (rowsPerPage: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rowsPerPage

    await loadData(filtersFormat.value)
  }

  onMounted(async () => {
    if (route.query.reload === 'true') loadData({})

    openMainLoader(true)

    await _getResources({ fics: ['fund_business_trusts'] })

    setTimeout(() => openMainLoader(false), 1000)
  })

  onBeforeUnmount(() => _resetKeys({ fics: ['fund_business_trusts'] }))

  watch(
    () => collective_investment_fund_list.value,
    () => {
      tableProps.value.rows = collective_investment_fund_list.value
      tableProps.value.pages = collective_investment_fund_pages.value
    }
  )

  return {
    goToURL,
    showState,
    updatePage,
    tableProps,
    headerProps,
    filterConfig,
    handleFilter,
    handleOptions,
    validateRouter,
    defaultIconsLucide,
    handleClearFilters,
    handleUpdatePerPage,
    isCollectiveInvestmentFundsEmpty,
    collectiveInvestmentFundsOptions,
  }
}

export default useCollectiveInvestmentFundsList
