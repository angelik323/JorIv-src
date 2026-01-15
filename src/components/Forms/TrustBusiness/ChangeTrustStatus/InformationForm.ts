// pinia - vue - quasar
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref, watch } from 'vue'

// stores
import { useChangeTrustStatusStore, useResourceStore } from '@/stores'
import { IChangeTrustStatusRequest } from '@/interfaces/customs'

const useInformationForm = (props: {
  action: 'edit' | 'view'
  data?: IChangeTrustStatusRequest | null
}) => {
  const { _setDataInformationForm } = useChangeTrustStatusStore('v1')

  const { business_trust_change_status } = storeToRefs(useResourceStore('v1'))

  const formInformation = ref()

  const models = ref<IChangeTrustStatusRequest>({
    id_business_trust: 0,
    id_status_history: 0,
    business_code: '',
    name: '',
    status_id: 0,
    status: '',
    observation: '',
    previous_status_id: 0,
    previous_status: null,
  })

  const handlerActionForm = (action: 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      edit: _setFormEdit,
      view: _setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const _setFormEdit = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value = {
        ...data,
        previous_status_id: data.previous_status_id
          ? data.previous_status_id
          : data.status_id,
      }
    }
  }

  const clearForm = async () => {
    models.value.id_business_trust = 0
    models.value.id_status_history = 0
    models.value.business_code = ''
    models.value.name = ''
    models.value.status_id = 0
    models.value.status = ''
    models.value.observation = ''
    models.value.previous_status_id = 0
    models.value.previous_status = null
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmpty(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({
          ...models.value,
        })
      }
    },
    { deep: true }
  )

  return {
    models,
    formInformation,
    business_trust_change_status,
  }
}

export default useInformationForm
