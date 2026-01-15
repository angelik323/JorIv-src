import { ref, onMounted, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { formatParamsCustom } from '@/utils'
import { QTable } from 'quasar'
import {
  useResourceManagerStore,
  useInterestRatesStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'
import {
  IInterestRate,
  IFieldFilters,
  IInterestRateFilters,
} from '@/interfaces/customs'
import { useRouteValidator } from '@/composables'

const useInterestRatesList = () => {
  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const key = ['interest_rate_mode', 'interest_rate_payment_frequency']
  const { interest_rate_mode, interest_rate_payment_frequency } =
    useInvestmentPortfolioResourceStore('v1')
  const { _getListAction, _deleteInterestRate } = useInterestRatesStore('v1')

  const { interest_rate_list, interest_rate_pages } = storeToRefs(
    useInterestRatesStore('v1')
  )

  const headerProps = {
    title: 'Tasas de interés',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: 'Tasas de interés', route: 'InterestRatesList' },
    ],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IInterestRate[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de tasas de interés',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'interest_rate_description',
        label: 'Descripción tasa de interés',
        align: 'left',
        field: (row) => row.interest_rate_description,
        sortable: true,
      },
      {
        name: 'mode',
        label: 'Modalidad',
        align: 'left',
        field: (row) => row.mode,
        sortable: true,
      },
      {
        name: 'payment_frequency',
        label: 'Periodicidad',
        align: 'left',
        field: (row) => row.payment_frequency,
        sortable: true,
      },
      {
        name: 'rate_value',
        label: 'Valor de tasa (%)',
        align: 'left',
        field: (row) => row.rate_value + ' %',
        sortable: true,
      },
      {
        name: 'date',
        label: 'Fecha',
        align: 'left',
        field: (row) => row.date,
        sortable: true,
      },
      { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' },
    ],

    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const filters = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Modalidad',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 q-py-md',
      options: interest_rate_mode,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Periodicidad',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 q-py-md',
      options: interest_rate_payment_frequency,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 q-py-md',
      prepend_icon: 'mdi-magnify',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por codigo o coincidencia',
    },
  ])

  const modelFilters = ref<IInterestRateFilters>({
    modality: null,
    frequency: null,
    search: null,
    page: 1,
    rows: 10,
  })

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: '¿Desea eliminar la tasa de interés seleccionada?',
    description_message: '',
    id: null as number | null,
  })

  const listAction = async (params = '') => {
    tableProps.value.loading = true
    await _getListAction(params)
    tableProps.value.loading = false
  }

  const handleUpdateFilters = (data: IInterestRateFilters) => {
    modelFilters.value = data
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const updatePage = (page: number) => {
    modelFilters.value.page = page
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    modelFilters.value.rows = rowsPerPage
    const q = formatParamsCustom(modelFilters.value)
    listAction(q ? '&' + q : '')
  }

  const handleOptions = async (option: string, id: number) => {
    if (option === 'edit') {
      router.push({ name: 'InterestRatesEdit', params: { id } })
    }

    if (option === 'delete') {
      alertModalConfig.value.id = id
      await alertModalRef.value.openModal()
    }
  }

  const deleteItem = async () => {
    if (alertModalConfig.value.id != null) {
      const success = await _deleteInterestRate(alertModalConfig.value.id)
      if (success) {
        await listAction()
      }
      await alertModalRef.value.closeModal()
      alertModalConfig.value.id = null
    }
  }

  const handleClearFilters = () => {
    modelFilters.value = {
      modality: null,
      frequency: null,
      search: null,
      page: 1,
      rows: 10,
    }
    tableProps.value.rows = []
  }

  onMounted(async () => {
    await _getResources({ investment_portfolio: key })
  })

  onBeforeMount(async () => await _resetKeys({ investment_portfolio: key }))

  watch(interest_rate_list, () => {
    tableProps.value.rows = interest_rate_list.value
  })

  watch(interest_rate_pages, () => {
    tableProps.value.pages = {
      currentPage: interest_rate_pages.value.currentPage,
      lastPage: interest_rate_pages.value.lastPage,
    }
  })

  return {
    headerProps,
    tableProps,
    filters,
    modelFilters,
    alertModalRef,
    alertModalConfig,
    deleteItem,
    handleUpdateFilters,
    handleOptions,
    updatePage,
    updatePerPage,
    handleClearFilters,
    validateRouter,
  }
}

export default useInterestRatesList
