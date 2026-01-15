<template>
  <div class="q-mt-md">
    <div class="justify-center q-gutter-md ml-6 mt-2">
      <div v-for="(check, index) in checks" :key="check.id" class="q-my-sm">
        <q-checkbox
          v-model="check.value"
          :label="check.label"
          :color="'deep-orange'"
          @update:model-value="(val) => handleCheck(index, val)"
        />
      </div>
    </div>
  </div>

  <div class="q-mt-md">
    <section class="mx-4 mb-4">
      <div class="row justify-center q-gutter-md">
        <Button
          :label="'Aceptar'"
          :size="'md'"
          :unelevated="true"
          :outline="false"
          :color="'orange'"
          :disabled="!hasSelectedItem"
          :class="'text-capitalize btn-filter custom'"
          @click="onSubmit"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// imports
import { IDownloadData } from '@/interfaces/customs'
import { useModalDownload } from './ModalDownload'
import Button from '@/components/common/Button/Button.vue'

const emit = defineEmits<{
  (e: 'save', item: IDownloadData[]): void
}>()

const { checks, handleCheck, hasSelectedItem, onSubmit } =
  useModalDownload(emit)
</script>

<style scoped>
.q-checkbox .q-checkbox__bg {
  border-radius: 8px;
}
</style>
