// vue | quasar | router
import { onMounted, onUnmounted, ref, watch } from 'vue'

// store
import { storeToRefs } from 'pinia'
import { useGroundsBankRefundStore, useResourceStore } from '@/stores'

// utils
import {
  IGroundsBankRefund,
  IGroundsBankRefundForm,
} from '@/interfaces/customs'

const useBasicDataComponent = (props: any) => {
  const { data_information_form } = storeToRefs(useGroundsBankRefundStore('v1'))
  const { _setDataInformationForm } = useGroundsBankRefundStore('v1')
  const { reason_return_apply, reason_return_status } = storeToRefs(
    useResourceStore('v1')
  )
  
  const GroundsForBankRefundDataRef = ref()
  const models = ref<IGroundsBankRefundForm>({
    name: '',
    apply: '',
    status_id: null,
    causal_code: '',
  })
  // props

  // handlers / actions
  const handlerActionForm = (action: 'create' | 'edit') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
    }
    actionHandlers[action]?.()
  }

  const setFormEdit = async () => {
    clearForm()
    const data: IGroundsBankRefund = props.data
    if (data) {
      models.value.causal_code = data?.causal_code ?? ''
      models.value.name = data?.name
      models.value.apply = data?.apply
      models.value.status_id = data?.status?.id ?? null
    }
  }

  const clearForm = () => {
    models.value.causal_code = ''
    models.value.name = ''
    models.value.apply = ''
    models.value.status_id = null
  }

  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value.causal_code = data_information_form.value.causal_code ?? ''
      models.value.name = data_information_form.value.name ?? ''
      models.value.apply = data_information_form.value.apply ?? ''
      models.value.status_id = data_information_form.value?.status_id ?? null
    }
  }

  // lifecycle hooks
  onMounted(async () => {
    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  // watchers
  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )
  watch(
    () => models.value,
    () => {
      if (!models.value) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({
          causal_code: models.value.causal_code,
          name: models.value.name,
          apply: models.value.apply,
          status_id: models.value.status_id,
        })
      }
    },
    { deep: true }
  )

  return {
    models,
    GroundsForBankRefundDataRef,
    reason_return_apply,
    reason_return_status,
  }
}

export default useBasicDataComponent
