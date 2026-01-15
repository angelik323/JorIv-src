import { useQuasar } from 'quasar'
import { computed } from 'vue'

export const useScreenSize = () => {
  const $q = useQuasar()
  // Obtener la altura de la pantalla
  const screenSizeName = computed(() => $q.screen.name)
  const screenSizeWidth = computed(() => $q.screen.width)
  const screenSizeHeight = computed(() => $q.screen.height)

  const paddingBySection = computed(() => {
    switch ($q.screen.name) {
      case 'xs':
        return 'q-px-md'
      case 'sm':
        return 'q-px-md'

      default:
        return 'q-px-xl'
    }
  })

  return {
    screenSizeName,
    screenSizeWidth,
    screenSizeHeight,
    paddingBySection,
  }
}
