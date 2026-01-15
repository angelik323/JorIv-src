<script setup lang="ts">
import Icon from '@/components/common/Icon/Icon.vue'

withDefaults(
  defineProps<{
    icon: string
    color?: string
    colorBg?: string
    colorIcon?: string
    text: string
    defaultClass?: string
  }>(),
  {
    color: 'black',
    colorIcon: 'red',
    colorBg: '#ffeaeb',
  }
)
</script>

<template>
  <q-badge
    class="q-mt-none q-mr-xs"
    :style="{
      background: colorBg,
      color: color,
      // width: '105px !important',
      maxWidth: '155px !important',
      minHeight: '28px !important',
      'border-radius': '20px',
      'font-size': '13px',
    }"
  >
    <div class="row q-gutter-sm items-center justify-center q-px-sm">
      <p v-if="text" :style="{ color: colorIcon }" class="mb-0">{{ text }}</p>

      <Icon
        :name="icon"
        :defaultClass="defaultClass"
        :size="20"
        :color="colorIcon"
      />
    </div>
  </q-badge>
</template>
