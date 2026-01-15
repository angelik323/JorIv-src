// Vue - Moment
import { computed, Ref } from 'vue'
import moment from 'moment'

// Components
import useBaseCalendarLayout from '@/components/common/Calendar/BaseCalendarLayout'

// Interfaces
import {
  ICalendarAgenda,
  ICalendarFilters,
  ICalendarAgendaItem,
} from '@/interfaces/customs/agenda/CalendarEvents'

const useMonthCalendar = (props: {
  initialDate?: string
  initialData?: ICalendarAgenda
  filters?: Ref<ICalendarFilters>
}) => {
  const base = useBaseCalendarLayout(
    props.initialDate,
    props.initialData,
    props.filters,
    'monthly'
  )

  const today = moment()
  const year = computed(() => base.currentDate.value.year())
  const month = computed(() => base.currentDate.value.month())

  type DayItem = { date: moment.Moment | null; label: string }

  const daysInMonth = computed<DayItem[]>(() => {
    const startOfMonth = base.currentDate.value.clone().startOf('month')
    const endOfMonth = base.currentDate.value.clone().endOf('month')
    const startDay = startOfMonth.day()
    const totalDays = endOfMonth.date()

    const days: DayItem[] = []

    for (let i = 0; i < startDay; i++) {
      days.push({ date: null, label: '' })
    }

    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      days.push({
        date: moment([year.value, month.value, dayNum]),
        label: String(dayNum),
      })
    }

    return days
  })

  const eventsMap = computed<Record<string, ICalendarAgendaItem>>(() => {
    const map: Record<string, ICalendarAgendaItem> = {}

    if (
      props.initialData?.visualization_type === 'monthly' &&
      props.initialData.events
    ) {
      for (const monthObj of Object.values(props.initialData.events)) {
        for (const [date, event] of Object.entries(monthObj)) {
          map[date] = event
        }
      }
    }

    return map
  })

  const notificationsCount = (dateStr: string): number => {
    return eventsMap.value[dateStr]?.countEvents ?? 0
  }

  const formattedDate = computed<string>(() =>
    base.currentDate.value
      .format('MMMM YYYY')
      .replace(/^./, (c) => c.toUpperCase())
  )

  const prevMonth = (): Promise<void> => base.prev('month')
  const nextMonth = (): Promise<void> => base.next('month')

  return {
    ...base,
    year,
    month,
    today,
    eventsMap,
    prevMonth,
    nextMonth,
    daysInMonth,
    formattedDate,
    notificationsCount,
  }
}

export default useMonthCalendar
