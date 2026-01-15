// Vue - Router - Moment
import { ref, watch, Ref, computed } from 'vue'
import router from '@/router'
import moment from 'moment'

// Utils
import { filtersToParams } from '@/utils'

// Interfaces
import {
  ICalendarAgenda,
  ICalendarFilters,
} from '@/interfaces/customs/agenda/CalendarEvents'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useCalendarEventsStore } from '@/stores/agenda/calendar-events'

const useBaseCalendarLayout = (
  initialDate?: string,
  initialData?: ICalendarAgenda,
  filters?: Ref<ICalendarFilters>,
  visualizationType?: string
) => {
  const { openMainLoader } = useMainLoader()
  const { formatParamsCustom } = useUtils()

  const { _getCalendarAgendaByType } = useCalendarEventsStore('v1')

  const currentDate = ref(moment(initialDate || undefined))
  const currentMonthRef = ref(currentDate.value.month())
  const currentYearRef = ref(currentDate.value.year())

  const dayData = ref<ICalendarAgenda>()
  const selectedDate = ref<string>('')
  const alertModalRef = ref()

  const fetchAgenda = async (
    date: moment.Moment,
    customFilters: ICalendarFilters = {}
  ) => {
    const year = String(customFilters['filter[year]'] ?? date.year())
    const month = String(customFilters['filter[month]'] ?? date.month() + 1)

    const baseFilters: ICalendarFilters = {
      'filter[visualization_type]': visualizationType,
      'filter[year]': year,
      'filter[month]': month,
      ...customFilters,
    }

    const paramsObject = filtersToParams(
      baseFilters as Record<string, string | undefined>
    )
    const queryString = formatParamsCustom(paramsObject)

    openMainLoader(true)
    const result = await _getCalendarAgendaByType(queryString)
    openMainLoader(false)

    if (result && initialData) {
      Object.assign(initialData, result)
      return true
    }

    return false
  }

  const fetchDayAgenda = async (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')

    const baseFilters: ICalendarFilters = {
      'filter[visualization_type]': 'daily',
      'filter[year]': year,
      'filter[month]': String(parseInt(month, 10)),
      'filter[day]': day,
    }

    const paramsObject = filtersToParams(
      baseFilters as Record<string, string | undefined>
    )
    const queryString = formatParamsCustom(paramsObject)

    openMainLoader(true)
    const result = await _getCalendarAgendaByType(queryString)
    openMainLoader(false)

    if (result) {
      dayData.value = result
      return true
    }

    return false
  }

  const handleDayClick = async (dateStr: string) => {
    const success = await fetchDayAgenda(dateStr)
    if (success) {
      selectedDate.value = dateStr
      alertModalRef.value?.openModal()
    }
  }

  const setDate = async (dateStr: string) => {
    const newDate = moment(dateStr)
    const newMonth = newDate.month()
    const newYear = newDate.year()

    if (
      newMonth !== currentMonthRef.value ||
      newYear !== currentYearRef.value
    ) {
      await fetchAgenda(newDate, filters?.value)
      currentMonthRef.value = newMonth
      currentYearRef.value = newYear
    }
    currentDate.value = newDate
  }

  const goToday = async () => {
    const today = moment()
    await setDate(today.format('YYYY-MM-DD'))
  }

  const prev = async (
    unit: moment.unitOfTime.DurationConstructor,
    amount = 1
  ) => {
    const newDate = currentDate.value.clone().subtract(amount, unit)
    await setDate(newDate.format('YYYY-MM-DD'))
  }

  const next = async (
    unit: moment.unitOfTime.DurationConstructor,
    amount = 1
  ) => {
    const newDate = currentDate.value.clone().add(amount, unit)
    await setDate(newDate.format('YYYY-MM-DD'))
  }

  const handleGoToListEvents = (): void => {
    router.push({ name: 'CalendarEventList' })
  }

  const weekHeaders = Array.from({ length: 7 }, (_, i) => {
    const dayName = moment().day(i).format('dddd')
    return dayName.charAt(0).toUpperCase() + dayName.slice(1)
  })

  const calendarDays = computed(() => {
    const start = moment(currentDate.value).startOf('month')
    while (start.day() !== 0) {
      start.subtract(1, 'day')
    }

    const end = moment(currentDate.value).endOf('month')
    while (end.day() !== 6) {
      end.add(1, 'day')
    }

    const days: { date: moment.Moment; dateStr: string }[] = []
    const day = start.clone()

    while (day <= end) {
      days.push({ date: day.clone(), dateStr: day.format('YYYY-MM-DD') })
      day.add(1, 'day')
    }

    return days
  })

  if (filters) {
    watch(
      filters,
      async (newFilters) => {
        if (newFilters?.['filter[year]']) {
          const year = Number(newFilters['filter[year]'])
          const month = newFilters['filter[month]']
            ? Number(newFilters['filter[month]']) - 1
            : 0
          const newDate = moment([year, month, 1])
          currentDate.value = newDate
          currentMonthRef.value = newDate.month()
          currentYearRef.value = newDate.year()
          await fetchAgenda(newDate, newFilters)
        }
      },
      { deep: true, immediate: true }
    )
  }

  return {
    currentDate,
    goToday,
    prev,
    next,
    setDate,
    handleGoToListEvents,
    weekHeaders,
    calendarDays,
    handleDayClick,
    fetchDayAgenda,
    alertModalRef,
    selectedDate,
    dayData,
  }
}

export default useBaseCalendarLayout
