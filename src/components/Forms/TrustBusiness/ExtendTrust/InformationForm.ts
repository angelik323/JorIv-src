// pinia - vue - quasar
import { onMounted, onUnmounted, ref, watch } from 'vue'

// stores
import { useExtendTrustStore } from '@/stores'

// interfaces
import {
  IExtendTrustResponse,
  IExtendTrustInterface,
} from '@/interfaces/customs'

const useInformationForm = (props: {
  action: 'create' | 'edit' | 'view'
  data?: IExtendTrustInterface | null
}) => {
  const { _setDataInformationForm } = useExtendTrustStore('v1')

  const formInformation = ref()

  const models = ref<IExtendTrustResponse>({
    name: '',
    start_date: '',
    end_date: '',
    extension_date: '',
    new_extension_date: '',
    observation: '',
  })

  const hasInitialExtensionDate = ref(false)

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: _setModelValue,
      view: _setModelValue,
    }
    actionHandlers[action]?.()
  }

  const isEmpty = (obj: Record<string, unknown>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const _setModelValue = () => {
    clearForm()
    const data: IExtendTrustResponse =
      props.data as unknown as IExtendTrustResponse
    if (data) {
      models.value.id = data.id
      models.value.name = data.name
      models.value.start_date = data.start_date
      models.value.end_date = data.end_date
      models.value.extension_date = data.extension_date ?? ''
      models.value.new_extension_date = data.new_extension_date ?? ''
      models.value.observation = data.observation ?? ''
      hasInitialExtensionDate.value = !!data.extension_date
    }
  }

  const clearForm = async () => {
    models.value.name = ''
    models.value.start_date = ''
    models.value.end_date = ''
    models.value.extension_date = ''
    models.value.new_extension_date = ''
    models.value.observation = ''
  }

  onMounted(() => {
    handlerActionForm(props.action)
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    () => {
      handlerActionForm(props.action)
    },
    { immediate: true }
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
    formInformation,
    models,
    handlerActionForm,
    hasInitialExtensionDate,
  }
}
export default useInformationForm
