<template>
  <q-dialog v-model="openDialogLocal" :persistent="persistent" no-esc-dismiss>
    <q-card
      class="v-card-rounded p-5 mb-4"
      flat
      bordered
      :style="'min-width: ' + minWidth"
      style="border-radius: 30px"
    >
      <q-card-section class="row items-center q-mx-md">
        <div :class="classTitle">{{ title }}</div>
        <q-space />
        <q-btn
          v-if="closable"
          icon="mdi-close"
          flat
          round
          dense
          @click="$emit('update:openDialog', false)"
        />
      </q-card-section>
      <section class="row justify-center" v-if="showImgDefault">
        <q-img
          :src="imageSrc"
          :width="imageWidth"
          :max-width="imageWidth"
          fit="contain"
        />
        <slot name="default-img" />
      </section>
      <q-card-section class="q-mx-md q-mb-md">
        <slot name="content-modal"></slot>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
const props = withDefaults(
  defineProps<{
    persistent?: boolean
    closable?: boolean
    minWidth?: string
    maxWidth?: string
    width?: string
    title?: string
    classTitle?: string
    openDialog: boolean
    showImgDefault?: boolean
    imageSrc?: string
    imageWidth?: string
  }>(),
  {
    persistent: true,
    closable: true,
    minWidth: '50%',
    maxWidth: '80%',
    width: '100%',
    title: '',
    classTitle: 'text-h5 text-weight-medium',
    openDialog: false,
    showImgDefault: false,
    imageSrc: '@/assets/images/icons/alert_popup.svg',
    imageWidth: '80px',
  }
)

// Emits

const openDialogLocal = ref(props.openDialog)
defineEmits<(e: 'update:openDialog', value: boolean) => void>()

watch(
  () => props.openDialog,
  (val) => {
    openDialogLocal.value = val
  }
)
</script>
