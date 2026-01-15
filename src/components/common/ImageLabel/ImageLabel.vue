<template>
  <div class="flex items-center q-gutter-sm">
    <q-img
      v-if="props.src && !imageErrored"
      :src="props.src"
      :alt="props.alt"
      :style="{ width: imageSize, height: imageSize }"
      :spinner-color="props.spinnerColor || 'orange'"
      fit="contain"
      @error="imageErrored = true"
    />
    <span>{{ props.label }}</span>
  </div>
</template>

<script setup lang="ts">
import useImageLabel from './ImageLabel'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: false,
  },
  spinnerColor: {
    type: String,
    required: false,
  },
  imageSize: {
    type: String,
    required: false,
  },
})

const { imageSize, imageErrored } = useImageLabel(props)
</script>
