// Vue
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { ISeizuresList } from '@/interfaces/customs/seizures/Seizures'

// Composables
import {
  useUtils,
  useGoToUrl,
  useRules,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

// Stores
import { useSeizuresStore } from '@/stores/seizures'
import {
  useResourceManagerStore,
  useSeizuresResourcesStore,
  useThirdPartyResourceStore,
} from '@/stores'

const useSeizuresList = () => {
  const store = useSeizuresStore('v1')
  const { _listAction, _exportAction } = store
  const { _getResources } = useResourceManagerStore('v1')

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { management_areas, seizure_status } = storeToRefs(
    useSeizuresResourcesStore('v1')
  )

  const keys = {
    third_party: ['third_parties'],
    seizures: ['management_areas', 'seizure_status'],
  }

  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()
  const { max_length } = useRules()
  const { openMainLoader } = useMainLoader()

  const headerProperties = {
    title: 'Embargos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Embargos', route: 'SeizuresList' },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
      options: [
        { label: 'Individual', routeName: 'SeizuresCreate' },
        { label: 'Masivo', routeName: 'SeizuresCreateMassive' },
      ],
      color: 'primary',
      textColor: 'white',
      size: 'md',
      class: 'btn-header',
      outline: false,
      disable: false,
    },
  }

  const filterComponentRef = ref()
  const isRegisteredStatus = (statusId: number) => statusId === 63

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      type: 'q-input',
      class: 'col-12 col-md-4',
      label: 'Número de proceso',
      placeholder: 'Inserte número de proceso',
      value: null,
      clean_value: true,
      rules: [(val: string) => max_length(val, 30)],
      disable: false,
    },
    {
      name: 'claimant_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Demandante',
      placeholder: 'Seleccione',
      options: third_parties,
      value: null,
      clean_value: true,
      disable: false,
    },
    {
      name: 'defendant_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Demandado',
      placeholder: 'Seleccione',
      options: third_parties,
      value: null,
      clean_value: true,
      disable: false,
    },
    {
      name: 'status_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Estado',
      placeholder: 'Seleccione',
      value: null,
      options: seizure_status,
      clean_value: true,
      disable: false,
    },
    {
      name: 'management_area_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Área que lo gestiona',
      placeholder: 'Seleccione',
      value: null,
      options: management_areas,
      clean_value: true,
      disable: false,
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const tableProperties = ref<IBaseTableProps<ISeizuresList>>({
    title: 'Listado de embargos',
    loading: false,
    wrapCells: true,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'process_number',
        label: 'Número de proceso',
        align: 'left',
        field: 'process_number',
        sortable: true,
      },
      {
        name: 'seizure_date',
        label: 'Fecha del embargo',
        align: 'left',
        field: 'seizure_date',
        sortable: true,
      },
      {
        name: 'claimant',
        label: 'Demandante',
        align: 'left',
        field: (row) => getPersonName(row.claimant),
        sortable: true,
      },
      {
        name: 'defendant',
        label: 'Demandado',
        align: 'left',
        field: (row) => getPersonName(row.defendant),
        sortable: true,
      },
      {
        name: 'value_seizure',
        label: 'Valor del embargo',
        align: 'right',
        field: 'value_seizure',
        sortable: true,
      },
      {
        name: 'origin',
        label: 'Origen',
        align: 'left',
        field: 'origin',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'left',
        field: (row) => row.status?.id,
        sortable: true,
      },
      { name: 'actions', label: 'Acciones', align: 'center', field: 'id' },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const getPersonName = (item: ISeizuresList['claimant']) => {
    if (item?.natural_person) return item.natural_person.full_name ?? ''
    if (item?.legal_person) return item.legal_person.business_name ?? ''
    return ''
  }

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true

    const response = await _listAction(filtersFormat.value)

    tableProperties.value.loading = false

    if (!response) {
      tableProperties.value.pages = { currentPage: 0, lastPage: 0 }
      return
    }

    tableProperties.value.rows = [...response.data]
    tableProperties.value.pages = {
      currentPage: response.current_page,
      lastPage: response.last_page,
    }
  }

  const handleFilterSearch = async (
    filters: Record<string, string | number>
  ) => {
    filtersFormat.value = {
      ...filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction()
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction()
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction()
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    await listAction()
  }

  const handleReport = async () => {
    openMainLoader(true)

    const { page, rows, ...exportFilters } = filtersFormat.value

    const blob = await _exportAction(1, exportFilters)

    openMainLoader(false)
    if (!blob) return

    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'embargos.xlsx'
    link.click()
    window.URL.revokeObjectURL(url)
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(
      { third_party: keys.third_party },
      'include=status,addresses,legalPerson,naturalPerson&filter[is_customer]=1&fields[]=id,document,third_party_category,commercial_registration'
    )
    await _getResources({ seizures: keys.seizures })

    openMainLoader(false)
  })

  return {
    defaultIconsLucide,
    headerProperties,
    tableProperties,
    filterComponentRef,
    filterConfig,
    isRegisteredStatus,
    handleReport,
    validateRouter,
    goToURL,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
  }
}

export default useSeizuresList
