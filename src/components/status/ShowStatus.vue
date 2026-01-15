<script setup lang="ts">
import { computed, toRef } from 'vue'

const statusProps = defineProps(['type', 'status'])

//default | oneRightIcon |bothIcons | oneLeftIcon

const currentType = toRef(statusProps, 'type')
const currentStatus = toRef(statusProps, 'status')

const showCardStyled = computed(() => {
  switch (currentStatus.value) {
    case 'Agendada':
      return 'card__status--warning'

    case 'Realizada':
      return 'card__status--success'

      case 'Cancelada':
      return 'card__status--cancel'

    default:
      return 'card__status--info'
  }
})

const showCardIcon = computed(() => {
  switch (currentStatus.value) {
    case 'Agendada':
      return {
        icon: 'mdi-calendar-month',
        color: 'card__icon--reschedule',
      }

    case 'Realizada':
      return {
        icon: 'mdi-check-circle',
        color: 'card__icon--success',
      }

      case 'Cancelada':
      return {
        icon: 'mdi-close-circle',
        color: 'card__icon--cancel',
      }

    default:
      return {
        icon: 'mdi-hand-front-right-outline',
        color: 'card__icon--standby',
      }
  }
})

const fixLabelStatus = computed(() => currentStatus.value === 'Agendada' ? 'Pendiente' : currentStatus.value)

const textStatusPadding = computed(() => {
  switch (currentType.value) {
    case 'oneLeftIcon':
      return 'q-pl-md q-pr-sm'

    case 'oneRightIcon':
      return 'q-pl-md q-pr-none'

    case 'bothIcons':
      return 'q-px-none'

    default:
      return 'q-px-md'
  }
})
</script>

<template>
  <q-card flat class="card__container--rounded" :class="showCardStyled">
    <q-item class="card__container--item q-px-none">
      <q-item-section
        class="card__container--icon-left q-pa-none"
        avatar
        v-if="currentType === 'oneLeftIcon'"
      >
        <q-avatar
          size="xl"
          :class="showCardIcon.color"
          :icon="showCardIcon.icon"
        />
      </q-item-section>

      <q-item-section class="card__container--text" :class="textStatusPadding">
        <q-item-label>{{ fixLabelStatus  }}</q-item-label>
      </q-item-section>

      <q-item-section
        class="card__container--icon-right q-pa-none"
        avatar
        v-if="currentType === 'oneRightIcon'"
      >
        <q-avatar
          size="xl"
          :class="showCardIcon.color"
          :icon="showCardIcon.icon"
        />
      </q-item-section>
    </q-item>
  </q-card>
</template>

<style lang="scss" src="./ShowStatus.scss" />
