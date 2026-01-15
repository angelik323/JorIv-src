// Vue - Moment
import { computed, Ref } from 'vue'
import moment from 'moment'

// Components
import useBaseCalendarLayout from '@/components/common/Calendar/BaseCalendarLayout'

// Interfaces
import {
  ICalendarEvent,
  ICalendarAgenda,
  ICalendarFilters,
} from '@/interfaces/customs/agenda/CalendarEvents'

const useDayCalendar = (props: {
  initialDate?: string
  initialData?: ICalendarAgenda
  filters?: Ref<ICalendarFilters>
}) => {
  const base = useBaseCalendarLayout(
    props.initialDate,
    props.initialData,
    props.filters,
    'daily'
  )

  const formattedDate = computed<string>(() => {
    const raw = base.currentDate.value.format('D [de] MMMM YYYY')
    return raw.replace(/ de (\w)/, (_, p1) => ` de ${p1.toUpperCase()}`)
  })

  const dayName = computed<string>(() => {
    const day = base.currentDate.value.format('dddd D')
    return day.charAt(0).toUpperCase() + day.slice(1)
  })

  const eventsMap = computed<Record<string, ICalendarEvent[]>>(() => {
    const map: Record<string, ICalendarEvent[]> = {}

    if (props.initialData?.visualization_type === 'daily') {
      for (const [date, events] of Object.entries(
        props.initialData.days || {}
      )) {
        map[date] = events
      }
    }

    return map
  })

  const dailyEvents = computed(() => {
    const dateStr = base.currentDate.value.format('YYYY-MM-DD')
    const events = eventsMap.value[dateStr] || []
    return events
      .slice()
      .sort((a, b) => moment(a.start_date).diff(moment(b.start_date)))
      .map((event) => ({
        ...event,
        start_time: moment(event.start_date).format('HH:mm'),
      }))
  })

  const prevDay = (): Promise<void> => base.prev('day')
  const nextDay = (): Promise<void> => base.next('day')

  return {
    ...base,
    dayName,
    prevDay,
    nextDay,
    dailyEvents,
    formattedDate,
  }
}

export default useDayCalendar
