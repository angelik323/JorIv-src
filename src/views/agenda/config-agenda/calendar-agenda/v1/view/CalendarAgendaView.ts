// Components
import MonthCalendar from '@/components/common/Calendar/MonthCalendar/MonthCalendar.vue'
import YearCalendar from '@/components/common/Calendar/YearCalendar/YearCalendar.vue'
import WeekCalendar from '@/components/common/Calendar/WeekCalendar/WeekCalendar.vue'
import DayCalendar from '@/components/common/Calendar/DayCalendar/DayCalendar.vue'

// Vue - Pinia
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import {
  ICalendarAgenda,
  ICalendarFilters,
} from '@/interfaces/customs/agenda/CalendarEvents'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useCalendarEventsStore } from '@/stores/agenda/calendar-events'
import { useFiltersStore, useResourceStore } from '@/stores'

const useCalendarAgenda = () => {
  const { openMainLoader } = useMainLoader()
  const { formatParamsCustom } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getCalendarAgendaByType } = useCalendarEventsStore('v1')
  const { year_list, month_list, repeat_options } = storeToRefs(
    useResourceStore('v1')
  )
  const { setFiltersState } = useFiltersStore()

  const filtersFormat = ref<Record<string, string | number>>({})
  const selectedFilters = ref<ICalendarFilters>({})
  const modelData = ref<ICalendarAgenda>()
  const selectedType = ref<string>('')
  const hasSearched = ref(false)

  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  const headerProperties = {
    title: 'Ver agenda',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Agenda y notificaciones' },
      { label: 'Configurar agenda', route: 'CalendarEventList' },
      { label: 'Ver agenda', route: 'CalendarAgendaView' },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'visualization_type',
      label: 'Tipo de visualización*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: repeat_options,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: false,
    },
    {
      name: 'year',
      label: 'Año*',
      type: 'q-select',
      value: currentYear,
      class: 'col-12 col-md-4',
      options: year_list,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'month',
      label: 'Mes*',
      type: 'q-select',
      value: currentMonth,
      class: 'col-12 col-md-4',
      options: month_list,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const onChangeFilter = (values: Record<string, string | number>) => {
    const val = values['filter[visualization_type]']
    if (!val) return

    filterConfig.value.forEach((filter) => {
      let showFilters = new Set<string>()

      if (val === 'daily' || val === 'weekly') {
        showFilters = new Set(['visualization_type', 'year', 'month'])
      } else if (val === 'monthly') {
        showFilters = new Set(['visualization_type', 'year'])
      } else if (val === 'yearly') {
        showFilters = new Set(['visualization_type'])
      }

      filter.hide = !showFilters.has(filter.name)

      if (filter.name === 'visualization_type') {
        filter.value = val
      }
    })
  }

  const handleFilter = async ($filters: {
    'filter[visualization_type]': string
    'filter[year]'?: string
    'filter[month]'?: string
  }) => {
    filtersFormat.value = {
      visualization_type: $filters['filter[visualization_type]'] ?? '',
      year: $filters['filter[year]'] ?? '',
      month: $filters['filter[month]'] ?? '',
    }

    openMainLoader(true)

    const agenda = await _getCalendarAgendaByType(
      formatParamsCustom(filtersFormat.value)
    )

    if (agenda) {
      hasSearched.value = true
      modelData.value = agenda
      Object.assign(selectedFilters.value, $filters)
      selectedType.value = $filters['filter[visualization_type]']
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleClearFilters = () => {
    hasSearched.value = false
    selectedType.value = ''

    filterConfig.value.forEach((filter) => {
      if (filter.name === 'year') {
        filter.value = currentYear
        filter.hide = true
      } else if (filter.name === 'month') {
        filter.value = currentMonth
        filter.hide = true
      } else if (filter.name === 'visualization_type') {
        filter.value = null
        filter.hide = false
      }
    })

    selectedFilters.value = {}
  }

  const componentKey = computed(() => {
    return `${selectedType.value}-${selectedFilters.value['filter[year]']}-${selectedFilters.value['filter[month]']}`
  })

  const calendarComponent = computed(() => {
    switch (selectedType.value.toLowerCase()) {
      case 'daily':
        return DayCalendar
      case 'weekly':
        return WeekCalendar
      case 'monthly':
        return MonthCalendar
      case 'yearly':
        return YearCalendar
      default:
        return null
    }
  })

  const handleGoToList = () => goToURL('CalendarEventList')

  onMounted(() => setFiltersState(filterConfig.value))

  return {
    modelData,
    hasSearched,
    filterConfig,
    handleFilter,
    componentKey,
    handleGoToList,
    onChangeFilter,
    selectedFilters,
    headerProperties,
    calendarComponent,
    handleClearFilters,
  }
}

export default useCalendarAgenda
