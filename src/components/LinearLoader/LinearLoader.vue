<template>
  <div class="linearloader__container">
    <q-linear-progress rounded :size="props.size" :value="progress" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineEmits } from 'vue'

const props = withDefaults(
  defineProps<{
    timeDelay: number
    id: number
    size?: string
  }>(),
  {
    timeDelay: 2,
    size: '4px',
  }
)

const emit = defineEmits<(e: 'completed', id: string | number) => void>()

const progress = ref(0)
let animationFrameId: number

onMounted(() => {
  const start = performance.now()
  const duration = props.timeDelay * 1000

  const animate = (now: number) => {
    const elapsed = now - start
    progress.value = Math.min(elapsed / duration, 1)

    if (progress.value < 1) {
      animationFrameId = requestAnimationFrame(animate)
    } else {
      emit('completed', props.id)
    }
  }

  animationFrameId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId)
})
</script>
<style lang="scss" src="./LinearLoader.scss" scoped />
