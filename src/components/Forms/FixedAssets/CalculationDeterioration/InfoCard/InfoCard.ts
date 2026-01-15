// vue - quasar

import { ref, watch } from 'vue'

const useInfoCard = (props: {
  title: string | null
  value: string | number | null
  description: string | null
}) => {
  const models = ref({
    title: props.title,
    value: props.value,
    description: props.description,
  })

  watch(
    () => props.value,
    (newVal) => {
      models.value.value = newVal
    }
  )

  watch(
    () => props.title,
    (newVal) => {
      models.value.title = newVal
    }
  )

  watch(
    () => props.description,
    (newVal) => {
      models.value.description = newVal
    }
  )

  return {
    models,
  }
}

export default useInfoCard
