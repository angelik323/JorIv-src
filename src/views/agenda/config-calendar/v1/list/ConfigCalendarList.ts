// Vue - Pinia - Quasar
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

// Interfaces
import { IConfigCalendarData } from '@/interfaces/customs/agenda/ConfigCalendar'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import {
  useUtils,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

// Stores
import { useConfigCalendarStore } from '@/stores/agenda/config-calendar'
import { useResourceStore } from '@/stores/resources-selects'

const useConfigCalendarList = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getConfigCalendarList, _deleteAction } = useConfigCalendarStore('v1')
  const { year_list, month_list } = storeToRefs(useResourceStore('v1'))
  const { config_calendar_list, config_calendar_pages } = storeToRefs(
    useConfigCalendarStore('v1')
  )

  const isConfigCalendarEmpty = ref(true)
  const alertModalRef = ref()
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

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el día?',
    id: null as number | null,
  })

  const headerProperties = {
    title: 'Configurar calendarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Agenda y notificaciones',
      },
      {
        label: 'Configurar calendario',
        route: 'ConfigCalendarList',
      },
    ],
  }

  const filterConfig = ref([
    {
      name: 'years',
      label: 'Año',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: year_list,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'month',
      label: 'Mes',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: month_list,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'rason',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      prepend_icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por motivo',
    },
  ])

  const tableProperties = ref<IBaseTableProps<IConfigCalendarData>>({
    title: 'Listado de configuración calendarios',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
        required: true,
      },
      {
        name: 'year',
        label: 'Año',
        align: 'left',
        field: 'marked_day',
        format: (val: string) => new Date(val).getFullYear().toString(),
        style:
          'max-width: 140px; min-width: 100px; word-wrap: break-word; white-space: break-spaces;',
        sortable: true,
        required: true,
      },
      {
        name: 'month',
        label: 'Mes',
        align: 'left',
        field: 'marked_day',
        format: (val: string) =>
          month_list.value[new Date(val).getMonth()].label.toString(),
        style:
          'max-width: 140px; min-width: 100px; word-wrap: break-word; white-space: break-spaces;',
        sortable: true,
        required: true,
      },
      {
        name: 'day',
        label: 'Día',
        align: 'left',
        field: 'marked_day',
        format: (val: string) => new Date(val).getDate().toString(),
        style:
          'max-width: 140px; min-width: 100px; word-wrap: break-word; white-space: break-spaces;',
        sortable: true,
        required: true,
      },
      {
        name: 'reason',
        label: 'Motivo',
        align: 'left',
        field: 'marking_reason',
        style:
          'max-width: 240px; min-width: 100px; word-wrap: break-word; white-space: break-spaces;',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const loadData = async (
    filters: Record<string, string | number>,
    showAlert: boolean = true
  ) => {
    openMainLoader(true)
    tableProperties.value.rows = []

    await _getConfigCalendarList(filters, showAlert)

    const hasResults = config_calendar_list.value.length > 0

    showState.value = filters ? 1 : 0
    isConfigCalendarEmpty.value = !hasResults

    openMainLoader(false)
  }

  const handleFilter = async (
    $filters: {
      'filter[years]': string
      'filter[month]': string
      'filter[rason]': string
    },
    showAlert: boolean = true
  ) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await loadData(filtersFormat.value, showAlert)
  }

  const handleClearFilters = () => {
    showState.value = 0
    tableProperties.value.rows = []
    isConfigCalendarEmpty.value = true
  }

  const updatePage = async (page: number, showAlert: boolean = true) => {
    filtersFormat.value.page = page
    await loadData(filtersFormat.value, showAlert)
  }

  const updatePerPage = async (rows: number, showAlert: boolean = true) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value, showAlert)
  }

  const handleOptions = async (option: string, id: number) => {
    if (option === 'edit') goToURL('ConfigCalendarEdit', id)
    else if (option === 'delete') {
      alertModalConfig.value.id = id
      await alertModalRef.value.openModal()
    }
  }

  const deleteItem = async () => {
    openMainLoader(true)
    await _deleteAction(alertModalConfig.value.id as number)
    await alertModalRef.value.closeModal()

    await loadData(filtersFormat.value, false)

    alertModalConfig.value.id = null

    openMainLoader(false)
  }

  watch(
    () => config_calendar_list.value,
    (val) => {
      const sortedRows = [...val].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))

      tableProperties.value.rows = sortedRows

      const { currentPage, lastPage } = config_calendar_pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    goToURL,
    showState,
    deleteItem,
    updatePage,
    filterConfig,
    handleFilter,
    updatePerPage,
    alertModalRef,
    handleOptions,
    validateRouter,
    tableProperties,
    headerProperties,
    alertModalConfig,
    handleClearFilters,
    defaultIconsLucide,
    isConfigCalendarEmpty,
  }
}

export default useConfigCalendarList
