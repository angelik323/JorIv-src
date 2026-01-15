<template>
  <BaseCalendarLayout
    :title="formattedDate"
    :onFinish="handleGoToListEvents"
    :formatted-date="formattedDate"
    @today="goToday"
    @prev="prevYear"
    @next="nextYear"
  >
    <template #body>
      <div class="y-calendar-list q-pa-md">
        <VCard v-for="(month, index) in months" :key="index">
          <template #content-card>
            <div class="q-pa-lg">
              <div class="text-h6 q-mb-sm text-center text-grey-10 q-mb-lg">
                {{ month.label }}
              </div>

              <div class="y-calendar-header q-mb-sm text-grey-8">
                <span v-for="(day, i) in weekHeaders" :key="i">{{ day }}</span>
              </div>

              <div class="y-calendar-body">
                <div v-for="(day, dIndex) in month.days" :key="dIndex">
                  <div class="q-mb-xs">
                    <div
                      :class="{
                        'y-calendar': true,
                        'is-holiday': eventsMap[day.dateStr]?.isHoliday,
                        'is-marked-day': eventsMap[day.dateStr]?.isMarkedDay,
                        'has-events': eventsMap[day.dateStr]?.countEvents > 0,
                        'is-outside-month':
                          day.date.month() !== month.currentMonth,
                      }"
                      @click="handleDayClick(day.dateStr)"
                    >
                      {{ day.date.format('D') }}
                    </div>
                  </div>

                  <q-tooltip
                    v-if="eventsMap[day.dateStr]?.countEvents > 0"
                    anchor="top middle"
                    self="bottom middle"
                    class="bg-white text-grey-10 text-body2 q-card--bordered no-shadow v-card-rounded--lg"
                  >
                    {{ eventsMap[day.dateStr]?.countEvents }} notificación(es)
                  </q-tooltip>
                </div>
              </div>
            </div>
          </template>
        </VCard>
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
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'
import BaseCalendarLayout from '@/components/common/Calendar/BaseCalendarLayout.vue'
import DayCalendar from '@/components/common/Calendar/DayCalendar/DayCalendar.vue'
import VCard from '@/components/common/VCard/VCard.vue'

// Interfaces
import { ICalendarAgenda } from '@/interfaces/customs/agenda/CalendarEvents'

// Logic view
import useYearCalendar from '@/components/common/Calendar/YearCalendar/YearCalendar'

const props = withDefaults(
  defineProps<{
    initialData?: ICalendarAgenda
  }>(),
  {}
)

const {
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
} = useYearCalendar(props)
</script>
