import { defineComponent, computed } from 'vue'
import { useMainLoader } from './composable/useMainLoader'
export default defineComponent({
  name: 'MainLoader',
  setup() {
    const { mainLoaderStatus, loaderMessage, titleLoader } = useMainLoader()
    const getLoaderMainStatus = computed(() => mainLoaderStatus.value)

    return {
      titleLoader,
      getLoaderMainStatus,
      loaderMessage,
    }
  },
})
