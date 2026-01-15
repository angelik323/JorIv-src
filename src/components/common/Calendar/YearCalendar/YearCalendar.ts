// Vue - Router - Moment
import { ref, computed } from 'vue'
import 'moment/dist/locale/es'
import router from '@/router'
import moment from 'moment'

// Utils
import { filtersToParams } from '@/utils'

// Interfaces
import {
  ICalendarDay,
  ICalendarAgenda,
  ICalendarAgendaItem,
} from '@/interfaces/customs/agenda/CalendarEvents'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useCalendarEventsStore } from '@/stores/agenda/calendar-events'

const useYearCalendar = (props: { initialData?: ICalendarAgenda }) => {
  const { openMainLoader } = useMainLoader()
  const { formatParamsCustom } = useUtils()

  const { _getCalendarAgendaByType } = useCalendarEventsStore('v1')

  const formattedDate = computed(() => currentYear.value.format('YYYY'))
  const dayData = ref<ICalendarAgenda>()
  const selectedDate = ref<string>('')
  const currentYear = ref(moment())
  const alertModalRef = ref()

  const weekHeaders = Array.from({ length: 7 }, (_, i) => {
    const dayShort = moment().day(i).format('ddd').replace('.', '')
    return dayShort.charAt(0).toUpperCase() + dayShort.slice(1).toLowerCase()
  })

  const months = computed(() => {
    const result: {
      label: string
      days: ICalendarDay[]
      currentMonth: number
    }[] = []

    for (let m = 0; m < 12; m++) {
      const startOfMonth = moment(currentYear.value).month(m).startOf('month')
      const firstDay = startOfMonth.clone()
      while (firstDay.day() !== 0) {
        firstDay.subtract(1, 'day')
      }

      const endOfMonth = moment(currentYear.value).month(m).endOf('month')
      const lastDay = endOfMonth.clone()
      while (lastDay.day() !== 6) {
        lastDay.add(1, 'day')
      }

      const days: ICalendarDay[] = []
      const day = firstDay.clone()
      while (day.isSameOrBefore(lastDay)) {
        days.push({ date: day.clone(), dateStr: day.format('YYYY-MM-DD') })
        day.add(1, 'day')
      }

      const monthName = moment(currentYear.value).month(m).format('MMMM')

      result.push({
        label:
          monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase(),
        days,
        currentMonth: m,
      })
    }

    return result
  })

  const eventsMap = computed<Record<string, ICalendarAgendaItem>>(() => {
    const map: Record<string, ICalendarAgendaItem> = {}

    if (
      props.initialData &&
      props.initialData.visualization_type === 'monthly'
    ) {
      for (const monthMap of Object.values(props.initialData.events)) {
        for (const [date, events] of Object.entries(monthMap)) {
          map[date] = events
        }
      }
    }

    return map
  })

  const fetchYearAgenda = async (year: number) => {
    const filters = {
      'filter[visualization_type]': 'monthly',
      'filter[year]': String(year),
    }

    const paramsObject = filtersToParams(filters)
    const queryString = formatParamsCustom(paramsObject)

    openMainLoader(true)

    const result = await _getCalendarAgendaByType(queryString)

    openMainLoader(false)

    if (result && props.initialData) {
      Object.assign(props.initialData, result)
    }
  }

  const fetchDayAgenda = async (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')

    const filters = {
      'filter[visualization_type]': 'daily',
      'filter[year]': year,
      'filter[month]': String(parseInt(month, 10)),
      'filter[day]': day,
    }

    const paramsObject = filtersToParams(filters)
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

  const goToday = async () => {
    currentYear.value = moment()
    await fetchYearAgenda(currentYear.value.year())
  }

  const prevYear = async () => {
    currentYear.value = moment(currentYear.value).subtract(1, 'year')
    await fetchYearAgenda(currentYear.value.year())
  }

  const nextYear = async () => {
    currentYear.value = moment(currentYear.value).add(1, 'year')
    await fetchYearAgenda(currentYear.value.year())
  }

  const handleGoToListEvents = () => router.push({ name: 'CalendarEventList' })

  return {
    months,
    dayData,
    goToday,
    prevYear,
    nextYear,
    eventsMap,
    weekHeaders,
    selectedDate,
    alertModalRef,
    formattedDate,
    handleDayClick,
    handleGoToListEvents,
  }
}

export default useYearCalendar
