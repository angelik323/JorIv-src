<template>
  <BaseCalendarLayout
    :title="formattedDate"
    :onFinish="handleGoToListEvents"
    :formatted-date="formattedDate"
    @today="goToday"
    @prev="prevMonth"
    @next="nextMonth"
  >
    <template #header>
      <div class="d-calendar-grid-header q-mb-md">
        <span v-for="(day, i) in weekHeaders" :key="i">{{ day }}</span>
      </div>
    </template>

    <template #body>
      <div class="d-calendar-grid-body">
        <div
          v-for="(day, dIndex) in calendarDays"
          :key="dIndex"
          class="d-calendar-grid-item q-card--bordered no-shadow v-card-rounded--xl"
          :class="{
            'has-events': notificationsCount(day.dateStr) > 0,
            'is-sunday': day.date.day() === 0,
            'is-saturday': day.date.day() === 6,
            'is-holiday': eventsMap[day.dateStr]?.isHoliday,
            'is-marked-day': eventsMap[day.dateStr]?.isMarkedDay,
            'is-outside-month': day.date.month() !== currentDate.month(),
          }"
          @click="handleDayClick(day.dateStr)"
        >
          <div class="d-calendar-grid-item-label q-mb-sm">
            {{ day.date.format('D') }}
          </div>

          <div v-if="notificationsCount(day.dateStr) > 0" class="text-grey-10">
            {{ notificationsCount(day.dateStr) }} notificación(es)
          </div>
        </div>
      </div>
    </template>
  </BaseCalendarLayout>

  <AlertModalComponent
    ref="alertModalRef"
    styleModal="max-width: 1000px; width: 100%;"
    :showBtnConfirm="false"
    :showBtnCancel="false"
    :showImgDefault="false"
    :showCloseBtn="true"
  >
    <template #default-body>
      <DayCalendar
        :initial-date="selectedDate"
        :initial-data="dayData"
        :minimal="true"
      />
    </template>
  </AlertModalComponent>
</template>

<script setup lang="ts">
// Vue
import { Ref } from 'vue'

// Components
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import BaseCalendarLayout from '@/components/common/Calendar/BaseCalendarLayout.vue'
import DayCalendar from '@/components/common/Calendar/DayCalendar/DayCalendar.vue'

// Interfaces
import {
  ICalendarAgenda,
  ICalendarFilters,
} from '@/interfaces/customs/agenda/CalendarEvents'

// Logic view
import useMonthCalendar from '@/components/common/Calendar/MonthCalendar/MonthCalendar'

const props = withDefaults(
  defineProps<{
    filters?: Ref<ICalendarFilters>
    initialData?: ICalendarAgenda
    initialDate?: string
  }>(),
  {}
)

const {
  dayData,
  goToday,
  prevMonth,
  nextMonth,
  eventsMap,
  currentDate,
  weekHeaders,
  calendarDays,
  selectedDate,
  formattedDate,
  alertModalRef,
  handleDayClick,
  notificationsCount,
  handleGoToListEvents,
} = useMonthCalendar(props)
</script>
