import { ref } from 'vue'

const useBasicDataForm = () => {
  const formElementRef = ref()

  return {
    formElementRef,
  }
}

export default useBasicDataForm
