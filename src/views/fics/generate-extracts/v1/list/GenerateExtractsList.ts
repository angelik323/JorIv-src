// Vue - Vue - Router - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFicsExtractGeneration } from '@/interfaces/customs/fics/GenerateExtractst'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useGenerateExtractsStore } from '@/stores/fics/generate-extracts'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useGenerateExtractsList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { generate_extracts_list, generate_extracts_pages } = storeToRefs(
    useGenerateExtractsStore('v1')
  )
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { funds, status_extracts } = storeToRefs(useFicResourceStore('v1'))

  const { _listAction, _resendAction, _downloadZipAction, _errorDetailAction } =
    useGenerateExtractsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const isGenerateExtractsEmpty = ref(true)
  const detailModalRef = ref()
  const errorMessage = ref('')
  const showState = ref(0)

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const keys = {
    fics: ['funds', 'status_extracts'],
    trust_business: ['business_trusts'],
  }

  const headerProps = {
    title: 'Generación de extractos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Generación de extractos',
        route: 'GenerateExtractsList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'fund_id',
      label: 'Fondo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: funds,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trusts,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'period',
      label: 'Fecha',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      autocomplete: true,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: status_extracts,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<IBaseTableProps<IFicsExtractGeneration>>({
    title: 'Historial de generaciones de extractos',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'center',
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'file_name',
        align: 'left',
        label: 'Nombre de archivo',
        field: (row: IFicsExtractGeneration) => row.file_name,
        sortable: true,
        required: true,
        style: 'min-width: 200px; max-width: 300px;',
      },
      {
        name: 'business_code',
        align: 'left',
        label: 'Negocio',
        field: (row: IFicsExtractGeneration) => row.business_code || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'fund_code',
        align: 'left',
        label: 'Fondo',
        field: (row: IFicsExtractGeneration) => row.fund_code || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'investment_plan_code',
        align: 'left',
        label: 'Plan de inversión',
        field: (row) => row.investment_plan_code || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'registration_date',
        align: 'left',
        label: 'Fecha de registro',
        field: (row: IFicsExtractGeneration) => row.registration_date || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'period_from',
        align: 'left',
        label: 'Período desde',
        field: (row: IFicsExtractGeneration) => row.period_from || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'period_to',
        align: 'left',
        label: 'Período hasta',
        field: (row: IFicsExtractGeneration) => row.period_to || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'extract_type',
        align: 'left',
        label: 'Tipo de extracto',
        field: (row: IFicsExtractGeneration) => row.extract_type || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'status_id',
        align: 'center',
        label: 'Estado',
        field: 'status_id',
      },
      {
        name: 'details',
        align: 'center',
        label: 'Detalle',
        field: 'details',
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'id',
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

    await _getResources(keys)

    setTimeout(() => openMainLoader(false), 1000)
  }

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _listAction(filters)

    const hasResults = generate_extracts_list.value.length > 0

    isGenerateExtractsEmpty.value = !hasResults
    showState.value = filters ? 1 : 0

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleOptions = async (option: string, id: number) => {
    if (option === 'detail') openDetailModal(id)
    else if (option === 'download') await _downloadZipAction(id)
    else if (option === 'resend') await _resendAction(id)
  }

  const openDetailModal = async (id: number) => {
    const response = await _errorDetailAction(id)

    if (response) errorMessage.value = response.error ?? '-'

    detailModalRef.value.openModal()
  }

  const handleFilter = async ($filters: {
    'filter[business]': string
    'filter[status]': string
    'filter[fund]': string
    'filter[date]': string
  }) => await loadData({ ...$filters })

  const handleClearFilters = () => {
    showState.value = 0
    tableProps.value.rows = []
    isGenerateExtractsEmpty.value = true
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await loadData(filtersFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value)
  }

  onMounted(async () => {
    await loadResources()

    if (route.query.reload === 'true') await loadData({})
  })

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    generate_extracts_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = generate_extracts_pages.value
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
    handleFilter,
    filterConfig,
    errorMessage,
    handleOptions,
    detailModalRef,
    handleUpdatePage,
    handleClearFilters,
    defaultIconsLucide,
    handleUpdateRowsPerPage,
    isGenerateExtractsEmpty,
  }
}

export default useGenerateExtractsList
