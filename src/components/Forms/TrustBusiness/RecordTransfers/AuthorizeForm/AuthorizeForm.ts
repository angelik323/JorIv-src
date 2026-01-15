// pinia - vue - quasar
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// stores
import { useRecordTransfersStore } from '@/stores'
import { useRules } from '@/composables'

const useAuthorizeForm = (props: {
  action: 'view' | 'authorize'
  data?: string | null
}) => {
  const { _setDataAuthorize } = useRecordTransfersStore('v1')

  const { data_authorization } = storeToRefs(useRecordTransfersStore('v1'))

  const { is_required, max_length, min_length, only_alphanumeric } = useRules()

  const formAuthorize = ref()

  const models = ref({
    observation: '',
  })

  // actions
  const handlerActionForm = (action: 'view' | 'authorize') => {
    const actionHandlers: Record<typeof action, () => void> = {
      view: _setModelValue,
      authorize: _setModelValue,
    }
    actionHandlers[action]?.()
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const _setModelValue = () => {
    clearForm()
    const data_value = data_authorization.value
    if (data_value) {
      models.value.observation = data_value
    }
  }

  const clearForm = async () => {
    models.value.observation = ''
  }

  onMounted(() => {
    handlerActionForm(props.action)
  })

  // watch
  watch(
    () => props.data,
    () => {
      handlerActionForm(props.action)
      models.value.observation = props.data || ''
    },
    { immediate: true }
  )

  watch(
    () => models.value.observation,
    () => {
      if (isEmpty(models.value)) {
        _setDataAuthorize(null)
      } else {
        _setDataAuthorize(models.value.observation)
      }
    },
    { deep: true, immediate: true }
  )

  return {
    formAuthorize,
    models,
    is_required,
    max_length,
    only_alphanumeric,
    min_length,
  }
}
export default useAuthorizeForm
