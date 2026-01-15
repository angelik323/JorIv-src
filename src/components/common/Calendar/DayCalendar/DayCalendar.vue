<template>
  <BaseCalendarLayout
    :title="formattedDate"
    :onFinish="handleGoToListEvents"
    :formatted-date="formattedDate"
    @today="goToday"
    @prev="prevDay"
    @next="nextDay"
    :minimal="minimal"
  >
    <template #header>
      <div class="d-calendar-table-header daily">
        <span>Hora</span>
        <span>{{ dayName }}</span>
      </div>
    </template>

    <template #body>
      <div v-if="dailyEvents.length > 0">
        <div
          v-for="(event, index) in dailyEvents"
          :key="index"
          class="d-calendar-table-body-daily daily"
        >
          <span
            class="pill-time q-card--bordered no-shadow v-card-rounded--xl text-grey-8"
          >
            {{ event.start_time }}
          </span>
          <div
            class="pill-event no-shadow v-card-rounded--xl"
            :class="{
              'has-events': event.type === 'event',
              'is-marked-day':
                event.type === 'marked_day' || event.type === 'holiday',
            }"
          >
            <span class="text-grey-10">{{ event.title }}</span>
          </div>
        </div>
      </div>
      <div v-else class="d-calendar-table-body daily q-mt-lg">
        <span class="pill-time"></span>
        <div class="text-grey-8">No hay eventos para este día.</div>
      </div>
    </template>
  </BaseCalendarLayout>
</template>

<script setup lang="ts">
// Vue
import { Ref } from 'vue'

// Components
import BaseCalendarLayout from '@/components/common/Calendar/BaseCalendarLayout.vue'

// Interfaces
import {
  ICalendarAgenda,
  ICalendarFilters,
} from '@/interfaces/customs/agenda/CalendarEvents'

// Logic view
import useDayCalendar from '@/components/common/Calendar/DayCalendar/DayCalendar'

const props = withDefaults(
  defineProps<{
    filters?: Ref<ICalendarFilters>
    initialData?: ICalendarAgenda
    initialDate?: string
    minimal?: boolean
  }>(),
  {}
)

const {
  dayName,
  goToday,
  prevDay,
  nextDay,
  dailyEvents,
  formattedDate,
  handleGoToListEvents,
} = useDayCalendar(props)
</script>
