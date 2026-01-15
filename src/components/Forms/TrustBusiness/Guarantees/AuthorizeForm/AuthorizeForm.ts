// pinia - vue - quasar
import { nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// stores
import { useGuaranteesStore, useTrustBusinessResourceStore } from '@/stores'
import { useRules } from '@/composables'
import { isEmptyOrZero } from '@/utils'

const useAuthorizeForm = (
  props: {
    action: 'view' | 'authorize'
    data?: string
  },
  emit: Function
) => {
  const { business_trusts, participant_types } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { data_authorization } = storeToRefs(useGuaranteesStore('v1'))

  const { is_required, max_length, min_length, only_alphanumeric } = useRules()

  const { _setRecordStatus } = useGuaranteesStore('v1')
  const formAuthorize = ref()
  const isSettingModel = ref(false)

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

  const _setModelValue = () => {
    isSettingModel.value = true

    clearForm()
    const data_value = data_authorization.value
    if (data_value) {
      models.value.observation = data_value
    }

    nextTick(() => {
      isSettingModel.value = false
    })
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
    { deep: true, immediate: true }
  )

  watch(
    models.value,
    (val) => {
      if (isSettingModel.value) return
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val.observation)
    },
    { deep: true }
  )

  watch(
    () => models.value.observation,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setRecordStatus('')
      } else {
        _setRecordStatus(models.value.observation)
      }
    },
    { deep: true, immediate: true }
  )

  return {
    formAuthorize,
    models,
    business_trusts,
    participant_types,
    is_required,
    max_length,
    only_alphanumeric,
    min_length,
  }
}
export default useAuthorizeForm
