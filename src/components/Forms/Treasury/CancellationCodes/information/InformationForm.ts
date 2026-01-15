import { ICancellationCodes } from '@/interfaces/customs'
import { useCancellationCodesStore, useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch } from 'vue'

const useInformationForm = (props: any) => {
  const { data_information_form } = storeToRefs(useCancellationCodesStore('v1'))
  const { _setDataCancellationCodes } = useCancellationCodesStore('v1')

  const { treasury_cancellation_code_type } = storeToRefs(
    useResourceStore('v1')
  )

  const formInformation = ref()

  const models = ref<{
    code?: string
    description: string
    type: string
    reverses_conciliation: boolean
    retains_consecutive_check: boolean
  }>({
    code: '',
    description: '',
    type: '',
    reverses_conciliation: false,
    retains_consecutive_check: false,
  })

  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
    }

    actionHandlers[action]?.()
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const setFormEdit = async () => {
    clearForm()

    const data: ICancellationCodes = props.data
    if (data) {
      models.value.code = data?.code
      models.value.description = data?.description
      models.value.type = data?.type
      models.value.reverses_conciliation = data?.reverses_conciliation
      models.value.retains_consecutive_check = data?.retains_consecutive_check
    }
  }

  const clearForm = () => {
    models.value.code = ''
    models.value.description = ''
    models.value.type = ''
    models.value.reverses_conciliation = false
    models.value.retains_consecutive_check = false
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmpty(models.value)) {
        _setDataCancellationCodes(null)
      } else {
        _setDataCancellationCodes({
          code: models.value.code ?? undefined,
          description: models.value.description ?? null,
          type: models.value.type ?? null,
          reverses_conciliation: models.value.reverses_conciliation ?? null,
          retains_consecutive_check:
            models.value.retains_consecutive_check ?? null,
        })
      }
    },
    { deep: true }
  )

  return {
    models,
    formInformation,
    treasury_cancellation_code_type,
  }
}

export default useInformationForm
