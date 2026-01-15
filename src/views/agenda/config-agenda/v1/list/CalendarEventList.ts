// Vue - Pinia
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

// Interfaces
import { ICalendarEventResponse } from '@/interfaces/customs/agenda/CalendarEvents'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import {
  useUtils,
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

// Stores
import { useCalendarEventsStore } from '@/stores/agenda/calendar-events'
import { useResourceStore } from '@/stores/resources-selects'

const useCalendarEventList = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getCalendarEventList, _deleteAction } = useCalendarEventsStore('v1')
  const { year_list, month_list } = storeToRefs(useResourceStore('v1'))
  const { calendar_event_list, calendar_event_pages } = storeToRefs(
    useCalendarEventsStore('v1')
  )

  const isEventsEmpty = ref(true)
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
    description: '¿Desea eliminar la notificación?',
    id: null as number | null,
  })

  const headerProperties = {
    title: 'Configuración de agendas',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Agenda y notificaciones',
      },
      {
        label: 'Configurar agenda',
        route: 'CalendarEventList',
      },
    ],
  }

  const filterConfig = ref([
    {
      name: 'year',
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
      name: 'reason',
      label: 'Buscar',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      prepend_icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por título/detalle',
    },
  ])

  const tableProperties = ref<IBaseTableProps<ICalendarEventResponse>>({
    title: 'Listado de configuración de agendas',
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
        field: 'start_date',
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
        field: 'start_date',
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
        field: 'start_date',
        format: (val: string) => new Date(val).getDate().toString(),
        style:
          'max-width: 140px; min-width: 100px; word-wrap: break-word; white-space: break-spaces;',
        sortable: true,
        required: true,
      },
      {
        name: 'title',
        label: 'Título',
        align: 'left',
        field: 'title',
        style:
          'max-width: 240px; min-width: 100px; word-wrap: break-word; white-space: break-spaces;',
        sortable: true,
        required: true,
      },
      {
        name: 'detail',
        label: 'Detalle',
        align: 'left',
        field: 'description',
        style:
          'max-width: 240px; min-width: 100px; word-wrap: break-word; white-space: break-spaces;',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
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

    await _getCalendarEventList(filters, showAlert)

    const hasResults = calendar_event_list.value.length > 0

    showState.value = filters ? 1 : 0
    isEventsEmpty.value = !hasResults

    openMainLoader(false)
  }

  const handleFilter = async (
    $filters: {
      'filter[year]': string
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
    isEventsEmpty.value = true
    tableProperties.value.rows = []

    filtersFormat.value = {
      page: 1,
      rows: 20,
    }
  }

  const handleUpdatePage = async (page: number, showAlert: boolean = true) => {
    filtersFormat.value.page = page

    await loadData(filtersFormat.value, showAlert)
  }

  const handleUpdatePerPage = async (
    rows: number,
    showAlert: boolean = true
  ) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value, showAlert)
  }

  const handleOptions = async (option: string, id: number) => {
    if (option === 'view') goToURL('CalendarEventView', id)
    else if (option === 'edit') goToURL('CalendarEventEdit', id)
    else if (option === 'delete') {
      alertModalConfig.value.id = id
      await alertModalRef.value.openModal()
    }
  }

  const handleDeleteItem = async () => {
    if (alertModalConfig.value.id != null) {
      await _deleteAction(alertModalConfig.value.id)
      await alertModalRef.value.closeModal()

      await loadData(filtersFormat.value, false)

      alertModalConfig.value.id = null
    }
  }

  watch(
    () => calendar_event_list.value,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = calendar_event_pages.value
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
    handleFilter,
    filterConfig,
    handleOptions,
    alertModalRef,
    isEventsEmpty,
    validateRouter,
    tableProperties,
    handleDeleteItem,
    headerProperties,
    handleUpdatePage,
    alertModalConfig,
    defaultIconsLucide,
    handleClearFilters,
    handleUpdatePerPage,
  }
}

export default useCalendarEventList
