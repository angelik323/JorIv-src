<template>
  <q-chip
    :class="chipClass"
    :style="chipStyles"
    :clickable
    dense
    @click="$emit('click', $event)"
  >
    <span class="title">
      {{ currentStatus.title }}
    </span>

    <Icon
      class="icon"
      :name="currentStatus.icon"
      :color="currentStatus.iconColor"
      :size="18"
    />
  </q-chip>
</template>

<script setup lang="ts">
import { StatusType } from '@/interfaces/global'
import Icon from '@/components/common/Icon/Icon.vue'
import useShowStatus from '@/components/showStatus/v2/ShowStatus'

const props = withDefaults(
  defineProps<{
    type: number
    chipClass?: string
    clickable?: boolean
    statusType?: StatusType
  }>(),
  {
    chipClass: 'q-py-xs q-px-sm',
    clickable: false,
    statusType: 'default',
  }
)

const emits = defineEmits(['click'])

const { currentStatus, chipStyles } = useShowStatus(props)
</script>

<style lang="scss" scoped>
.title {
  font-size: 15px;
}
.icon {
  padding-left: 6px;
}
</style>
