import { ref } from 'vue'
const mainLoaderStatus = ref<boolean>(false)
const titleLoader = ref<string>('Cargando')
const loaderMessage = ref<string>('Por favor, espere un momento')

export const useMainLoader = () => {
  const openMainLoader = (value: boolean) => {
    mainLoaderStatus.value = value
  }

  const setOCloseMainLoader = (time = 600) => {
    mainLoaderStatus.value = true
    setTimeout(() => {
      mainLoaderStatus.value = false
    }, time)
  }

  return {
    openMainLoader,
    titleLoader,
    mainLoaderStatus,
    loaderMessage,
    setOCloseMainLoader,
  }
}
