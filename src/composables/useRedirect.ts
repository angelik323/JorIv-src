import { computed, ref } from 'vue'
const currentComponent = ref('LoginView')

export const useRedirect = () => {
  const getCurrentComponent = computed(() => currentComponent.value)
  const setComponetUrl = (urlByComponent: string): void => {
    currentComponent.value = urlByComponent
  }

  return {
    getCurrentComponent,
    setComponetUrl,
  }
}
