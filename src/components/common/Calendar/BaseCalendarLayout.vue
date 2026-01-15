<template>
  <div class="d-calendar" :class="!minimal ? 'q-py-md' : 'q-pb-lg'">
    <div v-if="!minimal" class="flex justify-between items-center q-my-md">
      <h2 class="d-calendar-title">{{ formattedDate }}</h2>

      <div class="d-calendar-options">
        <Button
          label="Hoy"
          left-icon="Calendar"
          color="orange"
          class="custom"
          outline
          @click="$emit('today')"
        />
        <Button
          :outline="false"
          :right-icon="'ChevronLeft'"
          color="primary_fiduciaria"
          color-icon="white"
          class="btn-filter custom text-white"
          @click="$emit('prev')"
        />
        <Button
          :outline="false"
          :right-icon="'ChevronRight'"
          color="primary_fiduciaria"
          color-icon="white"
          class="btn-filter custom text-white"
          @click="$emit('next')"
        />
      </div>
    </div>

    <div
      :class="
        !minimal
          ? 'd-calendar-table q-pa-lg q-card--bordered no-shadow v-card-rounded'
          : 'q-pb-lg'
      "
    >
      <slot name="header" />
      <slot name="body" />
      <div v-if="!minimal" class="flex justify-end q-mt-lg">
        <Button
          :outline="false"
          label="Finalizar"
          color="orange"
          class="btn-filter custom"
          @click="onFinish"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import Button from '@/components/common/Button/Button.vue'

defineProps<{
  title: string
  minimal?: boolean
  onFinish: () => void
  formattedDate: string
}>()

defineEmits(['today', 'prev', 'next'])
</script>

<style lang="scss" src="./BaseCalendarLayout.scss" />
