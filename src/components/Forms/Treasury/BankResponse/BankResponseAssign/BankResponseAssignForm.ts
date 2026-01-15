import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import {
  IBankResponseAssignForm,
  IBankResponseAssignEmits,
} from '@/interfaces/customs'

import { useMainLoader, useUtils, useRules } from '@/composables'

import { useBankResponseStore, useTreasuryResourceStore } from '@/stores'

const useBankResponseAssignForm = (emit: IBankResponseAssignEmits) => {
  const { openMainLoader } = useMainLoader()
  const { isEmptyOrZero } = useUtils()

  const { reasons_bank_return } = storeToRefs(useTreasuryResourceStore('v1'))
  const { _setBankResponseAssignForm } = useBankResponseStore('v1')

  const bankResponseAssignFormElementRef = ref()

  const models = ref<IBankResponseAssignForm>({
    status: null,
    reason_id: null,
    reason_label: '',
    observations: '',
  })

  const validateForm = async () => {
    return (await bankResponseAssignFormElementRef.value?.validate()) ?? false
  }

  const handleUpdateStatus = (status: number) => {
    models.value.status = status
    if (status !== 10) {
      models.value.reason_id = null
      models.value.reason_label = ''
    }
  }

  const handleUpdateReason = (reason_id: number) => {
    models.value.reason_id = reason_id

    const foundCode = reasons_bank_return.value.find(
      (item) => Number(item.value) === Number(reason_id)
    )

    models.value.reason_label = foundCode?.label || ''
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return

    openMainLoader(true)

    emit('update:table-status')
    emit('close:modal')

    openMainLoader(false)
  }

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setBankResponseAssignForm(null)
      } else {
        _setBankResponseAssignForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    models,
    bankResponseAssignFormElementRef,
    reasons_bank_return,

    handleUpdateStatus,
    handleUpdateReason,
    onSubmit,
    useRules,
  }
}

export default useBankResponseAssignForm
