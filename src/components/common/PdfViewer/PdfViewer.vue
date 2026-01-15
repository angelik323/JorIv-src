<template>
  <div class="pdf-viewer__container">
    <div
      v-if="isLoading"
      class="pdf-viewer__message pdf-viewer__message--loading"
    >
      <q-spinner-dots size="3rem" color="primary" />
      <p class="q-mt-md text-black-90">{{ loadingMessage }}</p>
    </div>

    <div
      v-else-if="hasError"
      class="pdf-viewer__message pdf-viewer__message--error"
    >
      <Icon
        class="q-mb-md"
        name="error_outline"
        :size="24"
        aria-hidden="true"
      />
      <p class="text-h6 text-negative">Error al cargar el documento</p>
      <p class="text-black-90">{{ errorMessage }}</p>
    </div>

    <iframe
      v-else-if="pdfSrc"
      :src="pdfSrc"
      :title="title"
      class="pdf-viewer__viewer"
    />

    <div v-else class="pdf-viewer__message pdf-viewer__message--empty">
      <Icon name="description" :size="24" class="q-mb-md" />
      <p class="text-black-90 text-weight-medium">Vista previa del documento</p>
      <p class="text-black-90 text-caption">
        El documento se mostrará aquí cuando esté disponible
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
// vue
import { ref, computed, watch, onUnmounted } from 'vue'
// components
import Icon from '@/components/common/Icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    title?: string
    loadingMessage?: string
    pdfBlob?: Blob | null
    pdfUrl?: string | null
    isLoading?: boolean
    hasError?: boolean
    errorMessage?: string
  }>(),
  {
    title: 'Documento PDF',
    loadingMessage: 'Cargando documento...',
    pdfBlob: null,
    pdfUrl: null,
    isLoading: false,
    hasError: false,
    errorMessage: 'No se pudo cargar el documento',
  }
)

const blobUrl = ref<string>('')

const pdfSrc = computed(() => {
  if (blobUrl.value) return blobUrl.value
  if (props.pdfUrl) return props.pdfUrl
  return ''
})

watch(
  () => props.pdfBlob,
  (newBlob) => {
    if (blobUrl.value) {
      URL.revokeObjectURL(blobUrl.value)
      blobUrl.value = ''
    }

    if (newBlob && newBlob instanceof Blob) {
      blobUrl.value = URL.createObjectURL(newBlob)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
  }
})
</script>

<style scoped lang="scss" src="@/components/common/PdfViewer/PdfViewer.scss" />
