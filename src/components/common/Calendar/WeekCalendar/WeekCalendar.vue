<template>
  <BaseCalendarLayout
    :title="formattedDate"
    :onFinish="handleGoToListEvents"
    :formatted-date="formattedDate"
    @today="goToday"
    @prev="prevWeek"
    @next="nextWeek"
  >
    <template #header>
      <div class="d-calendar-table-header weekly">
        <span>Hora</span>
        <span v-for="(day, i) in weekDays" :key="i">
          {{ day.label }}
        </span>
      </div>
    </template>

    <template #body>
      <div
        v-for="(hour, hIndex) in hours"
        :key="hIndex"
        class="d-calendar-table-body weekly"
        :style="{
          borderBottom: hIndex <= hours.length ? '1px solid #e0e0e0' : 'none',
          borderTop: hIndex === 0 ? '1px solid #e0e0e0' : 'none',
        }"
      >
        <span
          class="pill-time q-card--bordered no-shadow v-card-rounded--xl text-grey-8"
        >
          {{ hour }}
        </span>

        <div v-for="(day, dIndex) in weekDays" :key="dIndex" class="day-cell">
          <template v-if="eventsByHourMap[day.value]?.[hour]">
            <div
              v-for="(event, eIndex) in eventsByHourMap[day.value][hour]"
              :key="eIndex"
              class="pill-event no-shadow v-card-rounded--xl has-events"
              :style="
                getEventStyle(
                  event,
                  eIndex,
                  eventsByHourMap[day.value][hour].length
                )
              "
            >
              <span class="text-black-90 pill-event__text">{{
                event.title
              }}</span>

              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                class="calendar-tooltip"
              >
                <div class="text-body2">
                  <strong>{{ event.title }}</strong
                  ><br />
                  {{ moment(event.start_date).format('HH:mm') }} -
                  {{ moment(event.end_date).format('HH:mm') }}
                </div>
              </q-tooltip>
            </div>
          </template>
        </div>
      </div>
    </template>
  </BaseCalendarLayout>
</template>

<script setup lang="ts">
// Vue - Moment
import moment from 'moment'
import { Ref } from 'vue'

// Components
import BaseCalendarLayout from '@/components/common/Calendar/BaseCalendarLayout.vue'

// Interfaces
import { ICalendarAgenda } from '@/interfaces/customs/agenda/CalendarEvents'

// Logic view
import useWeekCalendar from '@/components/common/Calendar/WeekCalendar/WeekCalendar'

const props = withDefaults(
  defineProps<{
    filters?: Ref<Record<string, string | number | boolean>>
    initialData?: ICalendarAgenda
    initialDate?: string
  }>(),
  {}
)

const {
  hours,
  goToday,
  prevWeek,
  nextWeek,
  weekDays,
  getEventStyle,
  formattedDate,
  eventsByHourMap,
  handleGoToListEvents,
} = useWeekCalendar(props)
</script>
