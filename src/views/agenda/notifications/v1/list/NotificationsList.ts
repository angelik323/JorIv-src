// Vue - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps, INotificationsList } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useCalendarRules } from '@/composables/useCalendarRules'
import { useRules } from '@/composables/useRules'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useScheduleResourceStore } from '@/stores/resources-manager/schedules'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useNotificationsStore } from '@/stores/notifications'

const useNotificationsList = () => {
  const { date_after_or_equal_to_specific_date, is_required } = useRules()
  const { openMainLoader } = useMainLoader()
  const { only_until } = useCalendarRules()
  const { formatDate } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _listAction } = useNotificationsStore('v1')

  const {
    notifications_modules: modules,
    notifications_statuses: statuses,
    users_to_notify: users,
  } = storeToRefs(useScheduleResourceStore('v1'))

  const isTableEmpty = ref(true)
  const showState = ref(0)

  const keys = {
    schedule: ['notifications_statuses', 'notifications_modules'],
  }

  const keysClean = {
    schedule: [
      'notifications_statuses',
      'notifications_modules',
      'users_by_name',
    ],
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const headerProps = {
    title: 'Notificaciones',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Agenda y notificaciones',
      },
      {
        label: 'Notificaciones',
        route: 'NotificationsList',
      },
    ],
  }

  const updateFilterValue = (name: string, value: string | number | null) => {
    const field = filterConfig.value.find((f) => f.name === name)
    if (field) field.value = value
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'user_id',
      label: 'Usuario*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: users,
      remote: true,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Buscar por usuario',
      rules: [(val: string) => is_required(val, 'El usuario es requerido')],
      onChange: async (val: string) => {
        await _getResources(
          { schedule: ['users_by_name'] },
          val
            ? `filter[full_name]=${encodeURIComponent(
                val
              )}&users_by_name_limit=10`
            : `users_by_name_limit=10`
        )
      },
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: statuses,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
      onChange: (val: string | number | null) =>
        updateFilterValue('status_id', val),
      isForceValue: true,
    },
    {
      name: 'source_module',
      label: 'Módulo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: modules,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Todos',
      onChange: (val: string | number | null) =>
        updateFilterValue('source_module', val),
      isForceValue: true,
    },
    {
      name: 'initial_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM-DD',
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      isForceValue: true,
      option_calendar: only_until(
        formatDate(new Date().toISOString(), 'YYYY-MM-DD')
      ),
      onChange: (val: string | number | null) => {
        updateFilterValue('initial_date', val)

        const endDateField = filterConfig.value.find(
          (f) => f.name === 'end_date'
        )
        if (endDateField?.value && val && typeof val === 'string') {
          const res = date_after_or_equal_to_specific_date(
            endDateField.value as string,
            val
          )
          if (res !== true) {
            endDateField.value = null
          }
        }
      },
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      mask: 'YYYY-MM-DD',
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      rules: [
        (val: string): true | string => {
          const dateFromField = filterConfig.value.find(
            (f) => f.name === 'initial_date'
          )
          const startDate = dateFromField?.value

          if (!val || !startDate) return true
          return date_after_or_equal_to_specific_date(val, startDate)
        },
      ],
      option_calendar: only_until(
        formatDate(new Date().toISOString(), 'YYYY-MM-DD')
      ),
      onChange: (val: string | number | null) =>
        updateFilterValue('end_date', val),
      isForceValue: true,
    },
  ])

  const tableProps = ref<IBaseTableProps<INotificationsList>>({
    title: 'Listado de notificaciones',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'description',
        label: 'Descripción',
        align: 'left',
        field: (row: INotificationsList) => row.description || '-',
        sortable: true,
      },
      {
        name: 'source_module',
        label: 'Módulo',
        align: 'left',
        field: (row: INotificationsList) => row.source_module || '-',
        sortable: true,
      },
      {
        name: 'date',
        label: 'Fecha',
        align: 'left',
        field: (row: INotificationsList) =>
          row.date ? formatDate(row.date, 'YYYY-MM-DD HH:mm') : '-',
        sortable: true,
      },
      {
        name: 'status_id',
        label: 'Estado',
        align: 'center',
        field: 'status_id',
        sortable: true,
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

    await Promise.all([
      _getResources({ schedule: ['users_by_name'] }, 'users_by_name_limit=10'),
      _getResources(keys),
    ])

    openMainLoader(false)
  }

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)
    tableProps.value.rows = []

    const response = await _listAction(filters)

    if (response) {
      tableProps.value.rows = response.list
      tableProps.value.pages = response.pages
    }

    isTableEmpty.value = tableProps.value.rows.length === 0
    showState.value = filters ? 1 : 0

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleFilter = async ($filters: {
    'filter[source_module]': string
    'filter[initial_date]': string
    'filter[status_id]': string
    'filter[end_date]': string
    'filter[user_id]': string
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
    isTableEmpty.value = true
    tableProps.value.rows = []

    filterConfig.value.forEach((filter) => {
      filter.value = null
    })

    filtersFormat.value = {
      page: 1,
      rows: 20,
    }
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page

    await loadData(filtersFormat.value)
  }

  const handleUpdatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await loadData(filtersFormat.value)
  }

  onMounted(async () => await loadResources())

  onBeforeUnmount(() => _resetKeys(keysClean))

  return {
    showState,
    tableProps,
    headerProps,
    isTableEmpty,
    handleFilter,
    filterConfig,
    handleUpdatePage,
    handleClearFilters,
    handleUpdatePerPage,
  }
}

export default useNotificationsList
