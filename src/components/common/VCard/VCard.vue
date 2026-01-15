<script setup lang="ts">
defineProps({
  customStyle: {
    type: String,
    require: false,
    default: '',
  },
  showBorder: {
    type: Boolean,
    require: false,
    default: true,
  },
})
</script>
<template>
  <q-card
    class="v-card-rounded p-3 mb-4"
    flat
    :bordered="showBorder"
    :style="customStyle"
  >
    <slot name="content-card"></slot>
  </q-card>
</template>
