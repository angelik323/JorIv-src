// vue - quasar - router
import { ref } from 'vue'
import { QTable } from 'quasar'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

//interfaces
import {
  IActiveNoveltyFilters,
  IConfigurationActiveResponseList,
} from '@/interfaces/customs/fixed-assets/ConfigurationActiveNoveltyTypes'

// stores
import { useActiveConfigNoveltyStore } from '@/stores/fixed-assets/configuration-active-novelty-types'

const useActiveNoveltyTypeList = () => {
  // composables
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide, formatDate } = useUtils()

  // stores

  const { _getActiveNoveltyList, _deleteActiveNovelty } =
    useActiveConfigNoveltyStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const tableRef = ref()
  const perPage = ref(20)
  const alertModalRef = ref()

  const headerProps = {
    title: 'Configuración de tipos de novedad activos fijos / bienes',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Activos fijos',
        route: '',
      },
      {
        label: 'Configuración de tipos de novedad activos fijos/bienes',
        route: 'ConfigurationActiveNoveltyTypesList',
      },
    ],
    btn: {
      label: 'Crear',

      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  // filters
  const filterConfig = ref([
    {
      name: 'start_date',
      label: 'Fecha de inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'end_date',
      label: 'Fecha de final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'q',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código y/o descripción',
      rules: [(val: string) => useRules().max_length(val, 50)],
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    customColumns: string[]
    rows: IConfigurationActiveResponseList[]
    filterRows: IConfigurationActiveResponseList[]
    pages: {
      currentPage: number
      lastPage: number
    }
  }>({
    title: 'Listado de tipos de novedad activos fijos / bienes',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Codigo',
        align: 'center',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'center',
        field: 'description',
        sortable: true,
      },
      {
        name: 'accounting',
        required: true,
        label: 'Contabilidad',
        align: 'center',
        field: (row) => (row.accounting ? 'Sí' : 'No'),
        sortable: true,
      },
      {
        name: 'affectation_type',
        required: true,
        label: 'Afectación bien',
        align: 'center',
        field: 'affectation_type',
        sortable: true,
      },
      {
        name: 'created_at',
        required: true,
        label: 'Fecha de creación',
        align: 'center',
        field: (row) =>
          row.created_at && typeof row.created_at === 'string'
            ? formatDate(row.created_at, 'YYYY-MM-DD')
            : '-',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: true,
      },
    ] as QTable['columns'],
    customColumns: ['actions'],
    rows: [],
    filterRows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const alertModalConfig = ref({
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
    option: '',
  })

  const openDeleteModal = async (id: number) => {
    alertModalConfig.value.description = '¿Desea eliminar esta novedad?'
    alertModalConfig.value.id = id
    alertModalConfig.value.option = 'novelty'

    alertModalRef.value.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)
    let result = false

    if (alertModalConfig.value.option === 'novelty') {
      result = await _deleteActiveNovelty(alertModalConfig.value.id)
    }

    if (result) {
      await alertModalRef.value.closeModal()
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const listAction = async (filters: typeof filtersFormat.value) => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    tableRef.value.clearSelection()

    const list = await _getActiveNoveltyList(filters)

    tableProps.value.rows = list?.data || []
    tableProps.value.pages = list?.pages ?? { currentPage: 1, lastPage: 1 }

    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: IActiveNoveltyFilters) => {
    filtersFormat.value = { ...$filters }

    await listAction(filtersFormat.value)
  }

  const handleClearFilters = async () => {
    tableProps.value.rows = []
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage.value,
      page,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    await listAction(filtersFormat.value)
  }

  return {
    headerProps,
    filterConfig,
    tableProps,
    tableRef,
    openDeleteModal,
    goToURL,
    updatePage,
    updatePerPage,
    handleFilter,
    handleClearFilters,
    handleDelete,
    validateRouter,
    alertModalRef,
    alertModalConfig,
  }
}

export default useActiveNoveltyTypeList
