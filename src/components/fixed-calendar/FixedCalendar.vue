<script setup lang="ts">
import { onMounted, ref, toRef, watch } from 'vue'
import { useUtils } from '@/composables'

const { getHolidaysByYear } = useUtils()

const selector = defineProps(['year', 'month', 'offDays'])
const year = toRef(selector, 'year')
const month = toRef(selector, 'month')
const offDays = toRef(selector, 'offDays')

const days = ref<
  {
    day: number
    dayName: string
    dayOfWeekNumber: number
    isSunday: boolean
    isSaturday: boolean
    isHoliday: boolean
    isMarked: boolean
    markingReason: string
  }[]
>([])

const startDay = ref(0)

const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const generateCalendar = () => {
  const startDate = new Date(year.value, month.value - 1, 1)
  const endDate = new Date(year.value, month.value, 0)

  const newDays = []
  const currentDate = new Date(startDate)
  startDay.value = startDate.getDay()
  const validOffDays = Array.isArray(offDays.value) ? offDays.value : []

  const holidays = getHolidaysByYear(year.value)

  do {
    const dayOfWeek = currentDate.getDay()
    const currentDay = currentDate.getDate()

    const holiday = holidays.find((h) => {
      const holidayDate = new Date(h + 'T00:00:00')
      return (
        holidayDate.getDate() === currentDate.getDate() &&
        holidayDate.getMonth() === currentDate.getMonth() &&
        holidayDate.getFullYear() === currentDate.getFullYear()
      )
    })

    const offDay = validOffDays.find(
      ({ day }: { day: number }) => day === currentDay
    )

    newDays.push({
      day: currentDate.getDate(),
      dayName: dayNames[dayOfWeek],
      dayOfWeekNumber: dayOfWeek,
      isSunday: dayOfWeek === 0,
      isSaturday: dayOfWeek === 6,
      isHoliday: !!holiday,
      isMarked: offDay ? offDay.isMarkedDay : false,
      markingReason: offDay ? offDay.markingReason : null,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  } while (currentDate <= endDate)

  days.value = newDays
}

watch([year, month, offDays], generateCalendar, { immediate: true })

onMounted(generateCalendar)
</script>

<template>
  <div class="calendar-container">
    <p class="text-center mt-3">
      {{
        new Date(year, month - 1)
          .toLocaleDateString('es-ES', { month: 'long' })
          .toUpperCase()
      }}
    </p>

    <div class="calendar-grid">
      <div class="calendar-header" v-for="day in dayNames" :key="day">
        {{ day }}
      </div>

      <div
        v-for="n in startDay"
        :key="'empty-' + n"
        class="calendar-day empty"
      ></div>

      <div
        v-for="(d, index) in days"
        :key="'day-' + index"
        class="calendar-day"
        :class="{
          holiday: d.isHoliday,
          weekend: d.isSunday,
          saturday: d.isSaturday,
          marked: d.isMarked,
        }"
      >
        {{ d.day }}
        <div v-if="d.isMarked" class="tooltip-card">
          <div class="tooltip-content">
            {{ d.markingReason }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" src="./FixedCalendar.scss" />
