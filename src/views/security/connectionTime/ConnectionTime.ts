// Vue tools
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Utils
// Stores
import { useFiltersStore, useSecurityStore } from '@/stores'
// Composables
import { useAlert } from '@/composables'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { IFieldFilters, IUserConnectionTime } from '@/interfaces/customs'
// Assets
import moment from 'moment'
import { defaultIcons } from '@/utils'
import { QTable } from 'quasar'

export const useConnectionTimeView = () => {
  // Tools and utils:
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  // Stores

  const { setFiltersState } = useFiltersStore()

  const { _getUserConnectionTime, _exportUserConnectionTime } =
    useSecurityStore('v1')

  const { userConnectionTime, pages } = storeToRefs(useSecurityStore('v1'))

  // Variables
  const disableXlsxBtn = computed(() => userConnectionTime?.value?.length === 0)
  const filtersList = ref()
  const showTable = ref(false)

  const headerProperties = {
    title: 'Tiempo de conexión de usuarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Seguridad',
      },
      {
        label: 'Tiempo de conexión de usuarios',
      },
    ],
  }

  // Props to filter
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'startDate',
      label: 'Desde fecha*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [(val: string) => !!val || 'El campo "Desde fecha" es requerido'],
    },
    {
      name: 'endDate',
      label: 'Hasta fecha*',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      rules: [(val: string) => !!val || 'El campo "Hasta fecha" es requerido'],
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'search',
      label: 'Usuario a consultar*',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
      disable: false,
      prepend_icon: defaultIcons.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre / correo',
      rules: [(val: string) => !!val || 'El usuario a consultar es requerido'],
    },
  ])

  const tableProperties = ref({
    title: 'Tiempo de conexión',
    loading: false,
    columns: [
      {
        name: 'index',
        required: false,
        label: '#',
        align: 'left',
        field: 'index', // Usar el índice de la fila
        sortable: true,
      },
      {
        name: 'user',
        required: false,
        label: 'Usuario',
        align: 'left',
        field: (row) => row?.user?.email,
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'names',
        required: false,
        label: 'Nombres',
        align: 'left',
        field: (row) => row?.user?.name,
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'last_names',
        required: false,
        label: 'Apellidos',
        align: 'left',
        field: (row) => row?.user?.last_name ?? '-',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'rol',
        required: false,
        label: 'Cargo',
        align: 'left',
        field: (row) => row?.user?.profile_type ?? '-',
        sortable: true,
      },
      {
        name: 'login_at',
        required: false,
        label: 'Hora ingreso',
        align: 'left',
        field: (row) =>
          moment(row?.login_at).format('YYYY-MM-DD hh:mm A') ?? '-',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'logout_at',
        required: false,
        label: 'Hora salida',
        align: 'left',
        field: (row) =>
          row?.logout_at
            ? moment(row.logout_at).format('YYYY-MM-DD hh:mm A')
            : '-',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'duration',
        required: false,
        label: 'T.Conexión',
        align: 'left',
        field: 'duration',
        sortable: true,
        style: {
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
    ] as QTable['columns'],
    rows: [] as IUserConnectionTime[],
    pages: pages,
  })

  const handleSearch = async (
    filters: {
      'filter[startDate]': number | string | null
      'filter[endDate]': string | null
      'filter[search]': string | null
    },
    noAlert?: boolean
  ) => {
    if (
      moment(filters['filter[startDate]']).isAfter(filters['filter[endDate]'])
    ) {
      return showAlert(
        'La fecha final debe ser mayor o igual a la fecha inicial',
        'error'
      )
    }
    filtersList.value = filters

    openMainLoader(true)
    const response = await _getUserConnectionTime({
      ...filters,
    })

    if (response?.success === true && !noAlert) {
      showAlert(response.message, 'success')
      showTable.value = true
      tableProperties.value.rows = userConnectionTime.value
    }
    openMainLoader(false)
  }

  const exportXlsx = async () => {
    openMainLoader(true)
    await _exportUserConnectionTime({
      ...filtersList.value,
      page: pages.value.currentPage,
    })
    openMainLoader(false)
  }

  const handleClear = async () => {
    clearTable()
  }

  const clearTable = () => {
    if (userConnectionTime?.value) userConnectionTime.value = []
  }

  const updatePage = async (page: number) => {
    try {
      tableProperties.value.rows = []
      tableProperties.value.loading = true
      await _getUserConnectionTime({
        ...filtersList.value,
        page,
      })
    } finally {
      tableProperties.value.loading = false
    }
  }

  const updateRows = async (rowsPerPage: number) => {
    filtersList.value = {
      ...filtersList.value,
      rows: rowsPerPage,
    }

    await _getUserConnectionTime(filtersList.value)
  }

  const setFilters = async () => {
    openMainLoader(true)
    setFiltersState(filterConfig.value)
    openMainLoader(false)
  }

  watch(
    () => userConnectionTime.value,
    (val) => {
      tableProperties.value.rows = val
    }
  )

  onMounted(async () => {
    openMainLoader(true)
    clearTable()
    await setFilters()
    openMainLoader(false)
  })

  onUnmounted(() => {
    clearTable()
    setFiltersState([])
  })

  return {
    showTable,
    tableProperties,
    headerProperties,
    disableXlsxBtn,
    handleSearch,
    handleClear,
    updateRows,
    exportXlsx,
    updatePage,
  }
}
