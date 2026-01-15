// vue - quasar - router
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'
import { StatusID } from '@/interfaces/global/Status'

//interfaces
import { IBaseTableProps } from '@/interfaces/global'
import {
  ILocationListItem,
  ILocationListResponse,
  ILocationsListFilters,
} from '@/interfaces/customs/fixed-assets/v1/Locations'

// stores
const { _getResources, _resetKeys } = useResourceManagerStore('v1')
import { default_statuses } from '@/constants/resources'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'

const { location_types } = storeToRefs(useFixedAssetsResourceStore('v1'))
import { useResourceManagerStore } from '@/stores'
import { useLocationsStore } from '@/stores/fixed-assets/locations'

const useLocationsList = () => {
  // composables
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide } = useUtils()

  // stores

  const { _getLocationsList, _toggleLocationsStatus } = useLocationsStore('v1')

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const tableRef = ref()
  const alertModalRef = ref()

  const fixedAssetsKeys = {
    fixed_assets: ['location_types'],
  }

  const headerProps = {
    title: 'Ubicaciones',
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
        label: 'Ubicaciones',
        route: 'LocationsList',
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
      name: 'location_type_id',
      label: 'Tipo de ubicación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: location_types,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: default_statuses,
      disable: false,
      clean_value: true,
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
      placeholder: 'Buscar por código y/o descripción',
      rules: [(val: string) => useRules().max_length(val, 50)],
    },
  ])

  const tableProps = ref<IBaseTableProps<ILocationListItem>>({
    title: 'Listado de ubicaciones',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'code',
        required: true,
        label: 'Código ubicación',
        align: 'center',
        field: 'code',
        sortable: true,
      },
      {
        name: 'address',
        required: true,
        label: 'Dirección ubicación',
        align: 'center',
        field: 'address',
        sortable: true,
      },
      {
        name: 'tipo',
        required: true,
        label: 'Tipo de ubicación',
        align: 'center',
        field: (row) => row.location_type?.name ?? '-',
        sortable: true,
      },
      {
        name: 'country',
        required: true,
        label: 'País',
        align: 'center',
        field: (row) => row.country?.name ?? '-',
        sortable: true,
      },
      {
        name: 'department',
        required: true,
        label: 'Departamento',
        align: 'center',
        field: (row) => row.department?.name ?? '-',
        sortable: true,
      },
      {
        name: 'city',
        required: true,
        label: 'Ciudad',
        align: 'center',
        field: (row) => row.city?.name ?? '-',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => row.status.id,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Está seguro que desea eliminar la notificación?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    action: '' as 'change-status',
    id: null as null | number,
  })

  const listAction = async (filters: typeof filtersFormat.value) => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    tableRef.value.clearSelection()

    const response = await _getLocationsList(filters)

    if (response) {
      tableProps.value.rows = response.list
      tableProps.value.pages = response.pages
    }

    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: ILocationsListFilters) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const handleClearFilters = async () => {
    tableProps.value.rows = []
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rowsPerPage: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rowsPerPage

    await listAction(filtersFormat.value)
  }

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const openAlertModal = (
    row: ILocationListResponse,
    action: 'change-status'
  ) => {
    alertModalConfig.value.id = row.id
    alertModalConfig.value.action = action

    if (action === 'change-status') {
      const newStatus =
        row.status.id === StatusID.ACTIVE ? 'Inactivar' : 'Activar'

      alertModalConfig.value.description = `¿Está seguro que desea ${newStatus} la ubicación?`
    }

    alertModalRef.value?.openModal()
  }

  const toggleStatus = async () => {
    if (!alertModalConfig.value.id) return

    const success = await _toggleLocationsStatus(alertModalConfig.value.id)

    if (success) {
      const selected_row = tableProps.value.rows.find(
        (row: ILocationListItem) => row.id === alertModalConfig.value.id
      )

      if (selected_row) {
        selected_row.status.id =
          selected_row.status.id === StatusID.ACTIVE
            ? StatusID.INACTIVE
            : StatusID.ACTIVE
      }
    }
  }

  const handleConfirmButtonModal = () => {
    if (alertModalConfig.value.action === 'change-status') {
      toggleStatus()
    }
    alertModalRef.value.closeModal()
  }

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all([_getResources(fixedAssetsKeys)])
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(fixedAssetsKeys))

  return {
    headerProps,
    filterConfig,
    tableProps,
    tableRef,
    goToURL,
    updatePage,
    updatePerPage,
    handleFilter,
    handleClearFilters,
    validateRouter,
    openAlertModal,
    isRowActive,
    alertModalRef,
    alertModalConfig,
    handleConfirmButtonModal,
  }
}

export default useLocationsList
