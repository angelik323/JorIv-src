// Vue - Moment
import { computed, CSSProperties, Ref } from 'vue'
import moment from 'moment'

// Components
import useBaseCalendarLayout from '@/components/common/Calendar/BaseCalendarLayout'

// Interfaces
import {
  ICalendarEvent,
  ICalendarAgenda,
  ICalendarFilters,
} from '@/interfaces/customs/agenda/CalendarEvents'

const useWeekCalendar = (props: {
  initialDate?: string
  initialData?: ICalendarAgenda
  filters?: Ref<ICalendarFilters>
}) => {
  const base = useBaseCalendarLayout(
    props.initialDate,
    props.initialData,
    props.filters,
    'weekly'
  )

  const hours = Array.from(
    { length: 18 - 7 + 1 },
    (_, i) => `${String(i + 7).padStart(2, '0')}:00`
  )

  const weekDays = computed(() => {
    const startOfWeek = base.currentDate.value.clone().day(0)
    return Array.from({ length: 7 }).map((_, i) => {
      const dayMoment = startOfWeek.clone().add(i, 'day')
      const dayName = moment().day(i).locale('es').format('dddd')
      const dayNameCapitalized =
        dayName.charAt(0).toUpperCase() + dayName.slice(1)
      const dayNumber = dayMoment.date()
      return {
        label: `${dayNameCapitalized} ${dayNumber}`,
        value: dayMoment.format('YYYY-MM-DD'),
        date: dayMoment,
      }
    })
  })

  const formattedDate = computed(() => {
    const startOfWeek = base.currentDate.value.clone().day(0)
    const endOfWeek = startOfWeek.clone().add(6, 'days')
    const startDay = startOfWeek.date()
    const endDay = endOfWeek.date()
    const monthName = startOfWeek.locale('es').format('MMMM')
    const year = startOfWeek.year()
    return `Semana ${startDay}-${endDay}, ${
      monthName.charAt(0).toUpperCase() + monthName.slice(1)
    } ${year}`
  })

  const eventsMap = computed<Record<string, ICalendarEvent[]>>(() => {
    const map: Record<string, ICalendarEvent[]> = {}

    if (props.initialData?.visualization_type === 'weekly') {
      for (const weekObj of Object.values(props.initialData.week || {})) {
        for (const [date, events] of Object.entries(weekObj)) {
          map[date] = events
        }
      }
    }

    return map
  })

  const eventsByHourMap = computed<
    Record<string, Record<string, ICalendarEvent[]>>
  >(() => {
    const map: Record<string, Record<string, ICalendarEvent[]>> = {}

    for (const day of weekDays.value) {
      const events = eventsMap.value[day.value] || []
      map[day.value] = {}

      for (const event of events) {
        let hour = moment(event.start_date).format('HH:00')

        if (event.type === 'holiday' || event.type === 'marked_day') {
          hour = '07:00'
        }

        if (!map[day.value][hour]) map[day.value][hour] = []
        map[day.value][hour].push(event)
      }
    }

    return map
  })

  const getEventStyle = (
    event: ICalendarEvent,
    eIndex = 0,
    totalEvents = 1
  ): CSSProperties => {
    if (event.type === 'holiday' || event.type === 'marked_day') {
      return {
        position: 'absolute',
        top: '0%',
        height: '22px',
        left: `${eIndex * (100 / totalEvents)}%`,
        width: `calc(${100 / totalEvents}% - 4px)`,
        backgroundColor: '#ffcccc',
        borderRadius: '8px',
        padding: '2px 4px',
        fontSize: '11px',
        zIndex: 2,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
      }
    }

    const start = moment(event.start_date)
    const end = moment(event.end_date)

    const minutesFromHour = start.minutes()
    const durationInMinutes = end.diff(start, 'minutes')

    const topPercent = (minutesFromHour / 60) * 100
    const heightPercent = (durationInMinutes / 60) * 155

    const widthPercent = 100 / totalEvents
    const leftPercent = eIndex * widthPercent

    return {
      position: 'absolute',
      top: `${topPercent}%`,
      height: `${heightPercent}%`,
      left: `${leftPercent}%`,
      width: `calc(${widthPercent}% - 4px)`,
      backgroundColor: '#ffece6',
      borderRadius: '12px !important',
      padding: '12px 6px',
      zIndex: 1,
      overflow: 'hidden',
    }
  }

  const prevWeek = (): Promise<void> => base.prev('week')
  const nextWeek = (): Promise<void> => base.next('week')

  return {
    ...base,
    hours,
    prevWeek,
    nextWeek,
    weekDays,
    eventsMap,
    getEventStyle,
    formattedDate,
    eventsByHourMap,
  }
}

export default useWeekCalendar
